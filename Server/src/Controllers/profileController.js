import bcrypt from "bcryptjs";
import User from "../Models/userModel.js";
import PersistentRoom from "../Models/PersistentRoomModel.js";
import Message from "../Models/messageModel.js";
import cloudinary from "../Utils/cloudinary.js";
import streamifier from "streamifier";
import {
  broadcastToRoom,
  removeRoomFromMemory,
} from "../websocket/persistentChat.ws.js";

function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export const updateUsername = async (req, res) => {
  try {
    const { userName } = req.body;
    const userId = req.user._id;

    const existing = await User.findOne({ userName, _id: { $ne: userId } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Username already taken" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { userName },
      { new: true }
    ).select("-password");

    return res.status(200).json({ success: true, message: "Username updated", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update username" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to change password" });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // delete the old avatar from Cloudinary first, so orphaned images don't pile up
    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (err) {
        console.error("Failed to delete old avatar from Cloudinary:", err.message);
        // non-fatal — proceed with uploading the new one anyway
      }
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, "relay-user-avatars");

    user.avatarUrl = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    const safeUser = await User.findById(userId).select("-password");

    return res.status(200).json({ success: true, message: "Avatar updated", user: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update avatar" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // clean up every room this user belongs to — same rules as leaveRoom,
    // except the last-admin case can't block deletion, so we auto-promote instead.
    const rooms = await PersistentRoom.find({ members: userId });

    for (const room of rooms) {
      try {
        const isAdmin = room.admins.some((a) => a.toString() === userId);
        const remainingMembers = room.members.filter((m) => m.toString() !== userId);

        if (remainingMembers.length === 0) {
          // ghost town — this user was the last member
          await PersistentRoom.findByIdAndDelete(room._id);
          await Message.deleteMany({ roomId: room._id });
          removeRoomFromMemory(room._id.toString());
          continue;
        }

        const remainingAdmins = room.admins.filter((a) => a.toString() !== userId);

        if (isAdmin && remainingAdmins.length === 0) {
          // last admin leaving via account deletion — auto-promote the next member
          // rather than blocking (there's no one left to confirm a transfer manually)
          const newAdminId = remainingMembers[0].toString();
          room.admins = [newAdminId];
          broadcastToRoom(room._id.toString(), { type: "adminPromoted", userId: newAdminId });
        } else {
          room.admins = remainingAdmins;
        }

        room.members = remainingMembers;
        await room.save();

        broadcastToRoom(room._id.toString(), {
          type: "userLeft",
          userId,
          userName: user.userName,
        });
      } catch (roomErr) {
        console.error(`Failed to clean up room ${room._id} during account deletion:`, roomErr.message);
        // continue to the next room rather than aborting the whole deletion
      }
    }

    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (err) {
        console.error("Failed to delete avatar during account deletion:", err.message);
      }
    }

    await User.findByIdAndDelete(userId);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to delete account" });
  }
};