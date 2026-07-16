import { success } from "zod";
import PersistentRoom from "../Models/PersistentRoomModel.js";
import Message from "../Models/messageModel.js";
import { getOnlineCount } from "../websocket/persistentChat.ws.js";
import cloudinary from "../Utils/cloudinary.js";
import streamifier from "streamifier";
import { broadcastToRoom,removeRoomFromMemory } from "../websocket/persistentChat.ws.js";
import User from "../Models/userModel.js";


export const createPersistentRoom = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    const room = await PersistentRoom.create({
      name,
      description,
      creator: userId,
      members: [userId],
      admins: [userId],
    });

    return res.status(201).json({
      success: true,
      message: "Persistent Room Created",
      room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create room",
    });
  }
};

export const getPersistentRooms = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mine } = req.query;

    const filter = mine === "true" ? { members: userId } : {};

    const rooms = await PersistentRoom.find(filter)
      .populate("creator", "userName")
      .sort({ lastActivity: -1 });

    const roomsWithOnline = rooms.map((room) => {
      const roomObj = room.toObject();
      // Pass the ID explicitly as a string
      roomObj.onlineCount = getOnlineCount(String(room._id));
      return roomObj;
    });
    return res.status(200).json({
      success: true,
      message: "Room Fetched Successfully",
      rooms: roomsWithOnline,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to Fetch rooms",
    });
  }
};

export const joinPersistentRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;
    const userId = req.user._id.toString();

    // 1. Find the room FIRST without modifying it
    const room = await PersistentRoom.findOne({
      roomCode: roomCode.toUpperCase(),
    });

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // 2. Check if the user is blocked BEFORE adding them
    const isBlocked = room.blockedUsers.some((b) => b.toString() === userId);
    if (isBlocked) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You have been blocked from this room",
        });
    }

    // 3. Now that we know they are safe, add them to the members array
    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    return res.status(200).json({
      success: true,
      message: "Room Joined",
      room, // Send the room back so the frontend has the actual _id!
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to join room",
    });
  }
};

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const before = req.query.before;

    const query = { roomId };
    if (before) {
      query._id = { $lt: before };
    }

    const messages = await Message.find(query)
      .populate("sender", "userName avatarUrl")
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Messages Fetched Successfully",
      messages: messages.reverse(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch messages",
    });
  }
};

export const getRoomByCode = async (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = await PersistentRoom.findOne({
      roomCode: roomCode.toUpperCase(),
    });
    if (!room) return res.status(404).json({ message: "Room not found" });
    return res.status(200).json({ room });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch room" });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await PersistentRoom.findById(roomId)
      .populate("creator", "userName avatarUrl")
      .populate("members", "userName avatarUrl");

    if (!room) return res.status(404).json({ message: "Room not found" });
    return res.status(200).json({ room });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch room" });
  }
};

function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

function getFileCategory(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype === "application/pdf") return "pdf";
  if (
    mimetype === "application/msword" ||
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "document";
  }
  if (mimetype === "text/plain") return "text";
  return "file"; // fallback, shouldn't hit given multer's fileFilter
}

export const sendFileMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const sender = await User.findById(userId);

    //upload in memory buffer to cloudinary
    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      "relay-chat-images",
    );

    const fileName = req.body.fileName || req.file.originalname;
    const fileType = getFileCategory(req.file.mimetype);

    const savedMessage = await Message.create({
      roomId,
      sender: userId,
      content: "Image",
      fileUrl: result.secure_url,
      filePublicId: result.public_id,
      fileName,
      fileType,
    });

    const populatedMessage = {
      _id: savedMessage._id.toString(),
      roomId,
      sender: {
        _id: userId,
        userName: sender.userName,
        avatarUrl: sender.avatarUrl || "",
      },
      fileUrl: savedMessage.fileUrl,
      filePublicId: savedMessage.filePublicId,
      fileName: savedMessage.fileName,
      fileType: savedMessage.fileType,
      createdAt: savedMessage.createdAt,
      imagePublicId: result.public_id,
      isEdited: false,
      isDeleted: false,
    };

    broadcastToRoom(roomId, {
      type: "newMessage",
      message: populatedMessage,
    });

    return res.status(200).json({
      success: true,
      message: "File Sent",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("sendFileMessage error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send file",
    });
  }
};
