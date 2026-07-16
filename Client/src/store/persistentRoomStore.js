import { create } from "zustand";
import {
  getPersistentRooms,
  createPersistentRoom,
  joinPersistentRoom,
  getRoomMessages,
  getRoomByCode,
  getRoomById,
} from "../services/persistentRoomService.js";

const usePersistentRoomStore = create((set, get) => ({
  //dashboard state
  rooms: [],
  isLoadingRooms: false,

  //active chat room state
  activeRoom: null,
  messages: [],
  isLoadingMessages: false,
  typingUsers: [],
  onlineUserIds: [],
  roomMood : null,

  //dashboard actions
  fetchRooms: async () => {
    set({ isLoadingRooms: true });
    try {
      const { rooms } = await getPersistentRooms();
      set({ rooms, isLoadingRooms: false });
    } catch (error) {
      set({ isLoadingRooms: false });
      throw error;
    }
  },

  fetchRoomByCode: async (roomCode) => {
    const { room } = await getRoomByCode(roomCode);
    set({ activeRoom: room });
    return room;
  },

  fetchRoomById: async (roomId) => {
    const { room } = await getRoomById(roomId);
    set({ activeRoom: room, roomMood: room.mood?.label ? room.mood : null });
    return room;
  },

  setRoomMood: (mood) => set({ roomMood: mood }),

  createRoom: async (name, description) => {
    const { room } = await createPersistentRoom(name, description);
    set({ rooms: [room, ...get().rooms] });
    return room;
  },

  joinRoom: async (roomId) => {
    const { room } = await joinPersistentRoom(roomId);
    return room;
  },

  //active chat room actions
  setActiveRoom: (room) => set({ activeRoom: room }),

  setOnlineUsers: (ids) => set({ onlineUserIds: ids }),

  addOnlineUser: (userId) =>
    set((state) => ({
      onlineUserIds: state.onlineUserIds.includes(userId)
        ? state.onlineUserIds
        : [...state.onlineUserIds, userId],
    })),

  removeOnlineUser: (userId) =>
    set((state) => ({
      onlineUserIds: state.onlineUserIds.filter((id) => id !== userId),
    })),

  addTypingUser: (userId, userName) =>
    set((state) => ({
      typingUsers: state.typingUsers.some((t) => t.userId === userId)
        ? state.typingUsers
        : [...state.typingUsers, { userId, userName }],
    })),

  removeTypingUser: (userId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((t) => t.userId !== userId),
    })),

  loadMessages: async (roomId) => {
    set({ isLoadingMessages: true });
    try {
      const { messages } = await getRoomMessages(roomId);
      // normalize backend shape { sender, content, createdAt } -> { userName, text, sentAt }
      const normalized = messages.map((m) => ({
        _id: m._id,
        userName: m.sender?.userName,
        avatarUrl: m.sender?.avatarUrl || "",
        text: m.isDeleted ? "" : m.content,
        fileUrl: m.isDeleted ? "" : m.fileUrl || "",
        fileName: m.isDeleted ? "" : m.fileName || "",
        fileType: m.isDeleted ? "" : m.fileType || "",
        sentAt: m.createdAt,
        isEdited: m.isEdited,
        isDeleted: m.isDeleted,
      }));
      set({ messages: normalized, isLoadingMessages: false });
    } catch (error) {
      set({ isLoadingMessages: false });
      throw error;
    }
  },

  editMessageInStore: (messageId, newContent) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        String(m._id) === String(messageId)
          ? { ...m, text: newContent, isEdited: true }
          : m,
      ),
    })),

  removeMessageFromStore: (messageId) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        String(m._id) === String(messageId)
          ? { ...m, isDeleted: true, text: "" }
          : m,
      ),
    })),

  // persistentRoomStore.js — add these two actions
  addParticipant: (userId, userName) =>
    set((state) => {
      if (!state.activeRoom) return {};
      const alreadyIn = state.activeRoom.members.some((m) => m._id === userId);
      if (alreadyIn) return {};
      return {
        activeRoom: {
          ...state.activeRoom,
          members: [...state.activeRoom.members, { _id: userId, userName }],
        },
      };
    }),

  promoteToAdmin: (userId) =>
    set((state) => {
      if (!state.activeRoom) return state;

      // Check if they are already in the array to prevent duplicates
      const isAlreadyAdmin = state.activeRoom.admins.some(
        (a) => (a._id || a) === userId,
      );

      if (isAlreadyAdmin) return state;

      return {
        activeRoom: {
          ...state.activeRoom,
          admins: [...state.activeRoom.admins, userId],
        },
      };
    }),

  removeParticipant: (userId) =>
    set((state) => {
      if (!state.activeRoom) return {};
      return {
        activeRoom: {
          ...state.activeRoom,
          members: state.activeRoom.members.filter((m) => m._id !== userId),
          // 💡 FIX: Clear their ghost ID from the local admins array too!
          admins: state.activeRoom.admins.filter(
            (a) => String(a._id || a) !== String(userId)
          ),
        },
      };
    }),

  //called when a new message arrives over websocket
  addMessage: (message) =>
    set((state) => {
      // If it's a real message (has an _id), check if we already rendered it
      if (message._id) {
        const isDuplicate = state.messages.some((m) => m._id === message._id);
        if (isDuplicate) return state; // Ignore it!
      }

      // Otherwise, add it safely
      return { messages: [...state.messages, message] };
    }),

  clearActiveRoom: () =>
  set({ activeRoom: null, messages: [], typingUsers: [], onlineUserIds: [], roomMood: null }),
}));

export default usePersistentRoomStore;
