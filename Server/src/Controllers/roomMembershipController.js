import PersistentRoom from "../Models/PersistentRoomModel.js";
import Message from "../Models/messageModel.js";
import {
  broadcastToRoom,
  removeRoomFromMemory,
  forceDisconnectUser
} from "../websocket/persistentChat.ws.js";
import User from "../Models/userModel.js";

export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id.toString();

    const room = await PersistentRoom.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const isMember = room.members.some((m) => m.toString() === userId);
    if (!isMember) {
      return res
        .status(403)
        .json({ success: false, message: "You are not a member of this room" });
    }

    const isAdmin = room.admins.some((a) => a.toString() === userId);
    const remainingMembers = room.members.filter(
      (m) => m.toString() !== userId,
    );

    // Edge Case 1 — Ghost Town: this was the last member. Delete the whole room.
    if (remainingMembers.length === 0) {
      await PersistentRoom.findByIdAndDelete(roomId);
      await Message.deleteMany({ roomId });
      removeRoomFromMemory(roomId); // clear the in-memory WS Map entry
      return res.status(200).json({ success: true, message: "Room deleted (you were the last member)" });
    }

    // Edge Case 2 — Last Admin: other members remain, but this user is the only admin.
    const remainingAdmins = room.admins.filter((a) => a.toString() !== userId);
    if (isAdmin && remainingAdmins.length === 0) {
      return res.status(400).json({
        success: false,
        actionRequired: "transfer_admin",
        message: "You must promote another user to admin before leaving.",
      });
    }

    // Normal case — remove from both members and admins, save.
    room.members = remainingMembers;
    room.admins = remainingAdmins;
    await room.save();

    return res.status(200).json({ success: true, message: "Left room successfully" });
  } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to leave room" });

  }
};

export const deleteRoom = async (req,res)=>{
    try {
    const { roomId } = req.params;
    const userId = req.user._id.toString();

    const room = await PersistentRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const isAdmin = room.admins.some((a) => a.toString() === userId);
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Only admins can delete this room" });
    }

    // Tell everyone connected BEFORE destroying data, so live clients get a clean signal.
    broadcastToRoom(roomId, { type: "roomDeleted" });

    await PersistentRoom.findByIdAndDelete(roomId);
    await Message.deleteMany({ roomId });
    removeRoomFromMemory(roomId);

    return res.status(200).json({ success: true, message: "Room deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to delete room" });
  }
}

export const promoteAdmin = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { targetUserId } = req.body;
    const requesterId = req.user._id.toString();

    const room = await PersistentRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const requesterIsAdmin = room.admins.some((a) => a.toString() === requesterId);
    if (!requesterIsAdmin) {
      return res.status(403).json({ success: false, message: "Only admins can promote members" });
    }

    const targetIsMember = room.members.some((m) => m.toString() === targetUserId);
    if (!targetIsMember) {
      return res.status(400).json({ success: false, message: "User is not a member of this room" });
    }

    // $addToSet avoids duplicate entries if they're already an admin
    await PersistentRoom.findByIdAndUpdate(roomId, {
      $addToSet: { admins: targetUserId },
    });

    broadcastToRoom(roomId, {
      type: "adminPromoted",
      userId: targetUserId
    });

    return res.status(200).json({ success: true, message: "Member promoted to admin" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to promote member" });
  }
};

export const kickMember = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { targetUserId } = req.body;
    const adminId = req.user._id.toString();

    const adminUser = await User.findById(adminId);

    const room = await PersistentRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const requesterIsAdmin = room.admins.some((a) => a.toString() === adminId);
    if (!requesterIsAdmin) {
      return res.status(403).json({ success: false, message: "Only admins can kick members" });
    }

    const targetIsMember = room.members.some((m) => m.toString() === targetUserId);
    if (!targetIsMember) {
      return res.status(400).json({ success: false, message: "User is not a member of this room" });
    }

    await PersistentRoom.findByIdAndUpdate(roomId, {
      $pull: { 
        members: targetUserId,
        admins: targetUserId 
      }
    });

    broadcastToRoom(roomId, {
      type: "memberKicked",
      targetUserId,
      targetUserName: req.body.targetUserName, // sent by frontend so we don't need an extra DB lookup here
      adminName: adminUser.userName,
    });

    // force-close their live socket immediately, don't wait for them to notice
    forceDisconnectUser(roomId, targetUserId);

    return res.status(200).json({ success: true, message: "Member kicked" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to kick member" });
  }
};

export const blockMember = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { targetUserId } = req.body;
    const adminId = req.user._id.toString();

    const adminUser = await User.findById(adminId);

    const room = await PersistentRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const requesterIsAdmin = room.admins.some((a) => a.toString() === adminId);
    if (!requesterIsAdmin) {
      return res.status(403).json({ success: false, message: "Only admins can block members" });
    }

    const targetIsMember = room.members.some((m) => m.toString() === targetUserId);
    if (!targetIsMember) {
      return res.status(400).json({ success: false, message: "User is not a member of this room" });
    }

    await PersistentRoom.findByIdAndUpdate(roomId, {
      $pull: { 
        members: targetUserId,
        admins: targetUserId 
      },
      $addToSet: { blockedUsers: targetUserId }
    });
    
    broadcastToRoom(roomId, {
      type: "memberBlocked",
      targetUserId,
      targetUserName: req.body.targetUserName,
      adminName: adminUser.userName,
    });

    forceDisconnectUser(roomId, targetUserId);

    return res.status(200).json({ success: true, message: "Member blocked" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to block member" });
  }
};
