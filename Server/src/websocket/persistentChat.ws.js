import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import User from "../Models/userModel.js";
import PersistentRoom from "../Models/PersistentRoomModel.js";
import Message from "../Models/messageModel.js";
import { request } from "express";
import cloudinary from "../Utils/cloudinary.js";
import {
  recordMessage,
  maybeAnalyzeRoomMood,
} from "../services/mood.service.js";

//roomID -> set of {ws , userId, fullName}
const rooms = new Map();

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  return rooms.get(roomId);
}

export function broadcastToRoom(roomId, payload, excludeWs = null) {
  const clients = rooms.get(roomId);
  if (!clients) return;

  const data = JSON.stringify(payload);
  for (const client of clients) {
    if (client.ws.readyState === client.ws.OPEN && client.ws !== excludeWs) {
      client.ws.send(data);
    }
  }
}

export function removeRoomFromMemory(roomId) {
  rooms.delete(roomId);
}

export function forceDisconnectUser(roomId, targetUserId) {
  const clients = rooms.get(roomId);
  if (!clients) return;

  for (const client of clients) {
    if (client.userId === targetUserId.toString()) {
      client.ws.close(); // triggers the existing ws.on("close") cleanup automatically
    }
  }
}

export function getOnlineCount(roomId) {
  if (!roomId) return 0;

  const targetId = String(roomId).trim();
  let count = 0;

  // Iterate through the map to ensure absolute string matching
  for (const [key, clients] of rooms.entries()) {
    if (String(key).trim() === targetId) {
      // Only count connections that are actually alive
      for (const client of clients) {
        if (client.ws.readyState === 1) {
          // 1 === ws.OPEN
          count++;
        }
      }
      break; // Found the room, stop looping
    }
  }

  return count;
}

//verifies the JWT from the httponly cookie during during the HTTP upgrade request
//before the socket is accepted . returns the authenticated user or null.
async function authenticateUpgrade(request) {
  try {
    const cookies = cookie.parse(request.headers.cookie || "");
    const token = cookies.token;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    return user || null;
  } catch (error) {
    return null;
  }
}

export function setupPersistentChatWs(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (request, socket, head) => {
    const { pathname, searchParams } = new URL(
      request.url,
      `http://${request.headers.host}`,
    );

    //only handle upgrades meant for persistent chat
    if (!pathname.startsWith("/ws/persistent-rooms")) return;

    const user = await authenticateUpgrade(request);
    if (!user) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    const roomId = pathname.split("/").pop();

    const room = await PersistentRoom.findById(roomId);
    if (!room) {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.destroy();
      return;
    }

    const isBlocked = room.blockedUsers.some(
      (b) => b.toString() === user._id.toString(),
    );
    if (isBlocked) {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }

    const isMember = room.members.some(
      (m) => m.toString() === user._id.toString(),
    );
    if (!isMember) {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, { user, roomId });
    });
  });

  wss.on("connection", (ws, request, { user, roomId }) => {
    const client = { ws, userId: user._id.toString(), fullName: user.userName };
    const roomClients = getOrCreateRoom(roomId);
    roomClients.add(client);

    broadcastToRoom(roomId, {
      type: "userJoined",
      userId: user._id,
      userName: user.userName,
    });

    const onlineUserIds = Array.from(roomClients).map((c) => c.userId);
    ws.send(JSON.stringify({ type: "onlineUsers", userIds: onlineUserIds }));

    broadcastToRoom(
      roomId,
      {
        type: "userOnline",
        userId: user._id.toString(),
        userName: user.userName,
      },
      ws,
    );

    ws.on("message", async (raw) => {
      let parsed;

      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid message format" }),
        );
        return;
      }

      if (parsed.type === "typing") {
        broadcastToRoom(
          roomId,
          {
            type: "typing",
            userId: user._id.toString(),
            userName: user.userName,
          },
          ws,
        );
        return;
      }

      if (parsed.type === "stopTyping") {
        broadcastToRoom(
          roomId,
          { type: "stopTyping", userId: user._id.toString() },
          ws,
        );
        return;
      }

      if (parsed.type === "editMessage") {
        const { messageId, newContent } = parsed;
        const trimmed = (newContent || "").trim();
        if (!trimmed) return;

        try {
          const message = await Message.findById(messageId);
          if (!message) {
            ws.send(
              JSON.stringify({ type: "error", message: "Message not found" }),
            );
            return;
          }

          if (message.sender.toString() !== user._id.toString()) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "You can only edit your own messages",
              }),
            );
            return;
          }

          message.content = trimmed;
          message.isEdited = true;
          await message.save();

          broadcastToRoom(roomId, {
            type: "messageEdited",
            messageId: message._id.toString(),
            newContent: message.content,
          });
        } catch (error) {
          console.error("editMessage error:", error.message);
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Failed to edit message",
            }),
          );
        }
        return;
      }

      if (parsed.type === "deleteMessage") {
        const { messageId } = parsed;

        try {
          const message = await Message.findById(messageId);
          if (!message) {
            ws.send(
              JSON.stringify({ type: "error", message: "Message not found" }),
            );
            return;
          }

          const isSender = message.sender.toString() === user._id.toString();

          // optional admin override — check room.admins
          const room = await PersistentRoom.findById(roomId).select("admins");
          const isAdmin = room?.admins?.some(
            (a) => a.toString() === user._id.toString(),
          );

          if (!isSender && !isAdmin) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "You can only delete your own messages",
              }),
            );
            return;
          }

          if (message.filePublicId) {
            try {
              await cloudinary.uploader.destroy(message.filePublicId);
            } catch (cloudinaryError) {
              console.error(
                "Failed to delete asset from Cloudinary:",
                cloudinaryError.message,
              );
              // We catch this separately so that if Cloudinary fails, the message still deletes in chat
            }
          }

          message.isDeleted = true;
          message.content = "[Deleted]";
          message.fileUrl = "";
          message.filePublicId = "";
          message.fileName = "";
          message.fileType = "";
          await message.save();

          broadcastToRoom(roomId, {
            type: "messageDeleted",
            messageId: message._id.toString(),
          });
        } catch (error) {
          console.error("deleteMessage error:", error.message);
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Failed to delete message",
            }),
          );
        }
        return;
      }

      if (parsed.type !== "message") return;

      const content = (parsed.content || "").trim();
      if (!content) return;

      try {
        const savedMessage = await Message.create({
          roomId,
          sender: user._id,
          content,
        });

        broadcastToRoom(roomId, {
          type: "newMessage",
          message: {
            _id: savedMessage._id.toString(),
            roomId,
            sender: {
              _id: user._id,
              userName: user.userName,
              avatarUrl: user.avatarUrl || "",
            },
            content: savedMessage.content,
            createdAt: savedMessage.createdAt,
            isEdited: false,
            isDeleted: false,
          },
        });

        recordMessage(roomId);
        maybeAnalyzeRoomMood(roomId);
      } catch (error) {
        console.error("persistentChat message save error:", error.message);
        ws.send(
          JSON.stringify({ type: "error", message: "Failed to send message" }),
        );
      }
    });

    ws.on("close", () => {
      roomClients.delete(client);
      if (roomClients.size === 0) {
        rooms.delete(roomId);
      }

      broadcastToRoom(roomId, {
        type: "userOffline",
        userId: user._id.toString(),
        userName: user.userName,
      });
    });
  });
  console.log("Persistent-chat Websocket Ready");
  return wss;
}
