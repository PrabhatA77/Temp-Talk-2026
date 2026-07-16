import Message from "../Models/messageModel.js";
import PersistentRoom from "../Models/PersistentRoomModel.js";
import { filterNoise } from "./messageFilter.service.js";
import { analyzeMoodWithAI } from "./aiMood.service.js";
import { broadcastToRoom } from "../websocket/persistentChat.ws.js";

const MESSAGE_THRESHOLD = 5;      // analyze after every 10 new messages
const TIME_THRESHOLD_MS = 15_000;  // ...or every 45 seconds, whichever comes first
const MIN_MEANINGFUL_MESSAGES = 3; // below this, don't bother calling the AI at all

// in-memory per-room tracking — resets on server restart, which just means
// the first message after a restart may trigger an earlier-than-usual check
const roomTracking = new Map(); // roomId -> { count, lastAnalysisAt }

function getTracking(roomId) {
  if (!roomTracking.has(roomId)) {
    roomTracking.set(roomId, { count: 0, lastAnalysisAt: 0 });
  }
  return roomTracking.get(roomId);
}

// call this every time a new text message is saved in a room
export function recordMessage(roomId) {
  getTracking(roomId).count += 1;
}

function shouldAnalyze(roomId) {
  const tracking = getTracking(roomId);
  const timeSinceLast = Date.now() - tracking.lastAnalysisAt;
  return tracking.count >= MESSAGE_THRESHOLD || timeSinceLast >= TIME_THRESHOLD_MS;
}

// call this right after recordMessage — checks the threshold and, if hit,
// kicks off analysis WITHOUT blocking the calling code (fire-and-forget)
export function maybeAnalyzeRoomMood(roomId) {
  if (!shouldAnalyze(roomId)) return;

  const tracking = getTracking(roomId);
  tracking.count = 0;
  tracking.lastAnalysisAt = Date.now();

  analyzeRoomMood(roomId).catch((err) =>
    console.error("mood.service: analysis failed:", err.message)
  );
}

async function analyzeRoomMood(roomId) {
  const room = await PersistentRoom.findById(roomId).select("mood");
  if (!room) return;

  const recentMessages = await Message.find({ roomId, isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(30)
    .select("content");

  const meaningful = filterNoise(recentMessages.reverse()); // oldest-first for coherent context

  // not enough real signal — keep whatever mood already exists rather than
  // flipping to Neutral just because recent messages happened to be noise
  if (meaningful.length < MIN_MEANINGFUL_MESSAGES) {
    if (!room.mood?.label) {
      await setAndBroadcastMood(roomId, room, {
        label: "Neutral",
        emoji: "😐",
        confidence: 0.4,
        description: "Not enough meaningful conversation to determine the room mood.",
        updatedAt: new Date(),
      });
    }
    return; // otherwise: silently preserve the existing mood
  }

  const newMood = await analyzeMoodWithAI(meaningful);
  if (!newMood) return; // AI call failed — preserve previous mood, don't broadcast

  await setAndBroadcastMood(roomId, room, newMood);
}

async function setAndBroadcastMood(roomId, room, newMood) {
  const moodChanged = room.mood?.label !== newMood.label;

  room.mood = newMood;
  await room.save(); // safe partial save — only "mood" was selected/modified

  // only broadcast when the mood actually changes, so clients aren't
  // re-rendering their header on every analysis cycle for no visible change
  if (moodChanged) {
    broadcastToRoom(roomId, { type: "roomMoodUpdated", mood: newMood });
  }
}