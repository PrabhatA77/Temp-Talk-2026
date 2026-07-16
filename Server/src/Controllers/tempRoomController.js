import TempRoom from "../Models/tempRoomModel.js";
import { generateRoomId } from "../Utils/generateRoomId.js";
import { getParticipants,broadcastRoomExtended } from "../websocket/tempChat.ws.js";

//create a temp room
export const createTempRoom = async (req, res) => {
  try {
    const { duration, topic, maxParticipants,creatorName } = req.body;

    if (!duration) {
      return res.status(400).json({
        success: false,
        message: "Duration is required",
      });
    }

    const expiresAt = new Date(Date.now() + duration * 60 * 1000);

    const room = await TempRoom.create({
      roomId: generateRoomId(),
      topic: topic,
      maxParticipants: maxParticipants,
      expiresAt,
      creatorName
    });

    return res.status(201).json({
      success: true,
      message: "Temp Room Created",
      roomId: room.roomId,
      topic: room.topic,
      maxParticipants: room.maxParticipants,
      expiresAt: room.expiresAt,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to Create Room",
    });
  }
};

//get a room
export const getTempRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    // simple param check — no need for Zod here
    if (!roomId || roomId.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Room ID is required" });
    }

    const room = await TempRoom.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found or has expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Joined the Room",
      roomId: room.roomId,
      maxParticipants: room.maxParticipants,
      expiresAt: room.expiresAt,
      createdAt: room.createdAt,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch room",
    });
  }
};

export const getTempRoomParticipants = async (req,res) => {
  const {roomId} = req.params;
  const participants = getParticipants(roomId);
  return res.status(200).json({
    success:true,
    message:"Participants list fetched successfully",
    participants
  })
}

export const extendTempRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { extraMinutes, userName } = req.body;

    const room = await TempRoom.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found or expired" });
    }

    // check if already extended
    if (room.isExtended) {
      return res.status(400).json({ success: false, message: "Room can only be extended once" });
    }

    // check if requester is the creator
    if (room.creatorName !== userName) {
      return res.status(403).json({ success: false, message: "Only the room creator can extend" });
    }

    // add extraMinutes on top of remaining time
    const currentExpiry = new Date(room.expiresAt);
    room.expiresAt = new Date(currentExpiry.getTime() + extraMinutes * 60 * 1000);
    room.isExtended = true;
    await room.save();

    broadcastRoomExtended(roomId, room.expiresAt);

    res.status(200).json({
      success: true,
      expiresAt: room.expiresAt,
      message: `Room extended by ${extraMinutes} minutes`,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to extend room" });
  }
};