import { WebSocketServer } from "ws";
import TempRoom from "../Models/tempRoomModel.js";

//rooms map lives in server memory
//room id -> set of ws connections currently in that room
const rooms = new Map();
const roomMessages = new Map(); //roomId->array of messages

//sends a JSON message to one specific ws connection
function sendTo(ws, data) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

//sends message to everyOne in that room
//exclude self = true means the sender won't receive their own message back
function broadcastToRoom(roomId, data, excludeWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.forEach((ws) => {
    if (ws !== excludeWs) {
      sendTo(ws, data);
    }
  });
}

export function broadcastRoomExtended(roomId, expiresAt) {
  broadcastToRoom(roomId, {
    type: "roomExtended",
    expiresAt,
  });
}

function getUsernames(roomId) {
  const room = rooms.get(roomId);
  if (!room) return [];
  return [...room].map((ws) => ws.userName); //get all usernames from ws connection
}

export function getParticipants(roomId) {
  return getUsernames(roomId);
}

export const setupTempChatWS = (server) => {
  const wss = new WebSocketServer({ noServer : true });

  // 💡 FIX 2: Manually listen for upgrades and filter by pathname
  server.on("upgrade", (request, socket, head) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);

    // Only handle upgrades meant for temp chat
    if (!pathname.startsWith("/ws/temp-room")) return;

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws) => {
    //when a new connection is made we dont know who they are yet
    //we wait for them to send the "join" message first
    ws.roomId = null;
    ws.userName = null;

    ws.on("message", async (raw) => {
      let data;

      try {
        data = JSON.parse(raw);
      } catch (error) {
        return sendTo(ws, {
          type: "error",
          message: "Invalid message format",
        });
      }

      //JOIN
      if (data.type === "join") {
        const { roomId, userName } = data;

        //check if room exists and hasn't expired in mongoDB
        const room = await TempRoom.findOne({ roomId });
        if (!room) {
          return sendTo(ws, {
            type: "error",
            message: "Room not found or expired",
          });
        }

        const existingUsernames = getUsernames(roomId);
        if (existingUsernames.includes(userName)) {
          return sendTo(ws, {
            type: "error",
            message:
              "Username already taken in this room. Please choose another.",
          });
        }

        //check if room is full
        const currentCount = rooms.get(roomId)?.size || 0;
        if (currentCount >= room.maxParticipants) {
          return sendTo(ws, { type: "error", message: "Room is Full" });
        }

        //attach roomid and userName to this ws connection

        ws.roomId = roomId;
        ws.userName = userName;

        //add this ws connection to this room's set
        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }

        rooms.get(roomId).add(ws);

        //tell this user they joined successfully + send room info
        sendTo(ws, {
          type: "joined",
          roomId: room.roomId,
          topic: room.topic,
          expiresAt: room.expiresAt,
          creatorName: room.creatorName,
          isExtended: room.isExtended,
          participants: getUsernames(roomId),
          history: roomMessages.get(roomId) || [], //send message history
        });

        //tell everyone else in the room that someone joined
        broadcastToRoom(
          roomId,
          {
            type: "userJoined",
            userName,
            participantsCount: rooms.get(roomId).size,
          },
          ws,
        ); //excludeWs = ws so the joiner dosen't get this
      }

      //MESSAGE
      else if (data.type === "message") {
        const { text } = data;
        //ignore if they somehow send a message before joining
        if (!ws.roomId || !ws.userName) {
          return sendTo(ws, {
            type: "error",
            message: "You have not joined a room yet",
          });
        }

        //check room still exists in DB
        const room = await TempRoom.findOne({ roomId: ws.roomId });
        if (!room) {
          sendTo(ws, { type: "roomExpired" });
          return ws.close();
        }

        const message = {
          type: "newMessage",
          userName: ws.userName,
          text,
          sentAt: new Date(),
        };

        //save to history
        if (!roomMessages.has(ws.roomId)) {
          roomMessages.set(ws.roomId, []);
        }
        roomMessages.get(ws.roomId).push(message);

        //broadcast message to everyone in the room including sender
        broadcastToRoom(ws.roomId, message);
      }
    });

    //DISCONNECT
    ws.on("close", () => {
      const { roomId, userName } = ws;
      if (!roomId) return; //they left even before joining the room

      //remove this ws from the room's set
      const room = rooms.get(roomId);
      if (room) {
        room.delete(ws);

        //if room is empty ,clean it up from memory
        if (room.size === 0) {
          rooms.delete(roomId);
          roomMessages.delete(roomId);
        } else {
          //tell everyone that the user left
          broadcastToRoom(roomId, {
            type: "userLeft",
            userName,
            participantsCount: room.size,
          });
        }
      }
    });
  });
  console.log("Temp-chat WebSocket server ready");
};
