import api from "./api.js"

//create a new persistent room
export const createPersistentRoom = async (name,description) => {
    const res = await api.post("/rooms",{name,description});
    return res.data;//{room}
}

//get rooms the logged in user belongs to
export const getPersistentRooms = async () => {
    const res = await api.get("/rooms",{ params: { mine: true }});
    return res.data;//{rooms}
}

//join a room by id 
export const joinPersistentRoom = async (roomCode) => {
    const res = await api.post(`/rooms/join`,{roomCode});
    return res.data;//{room}
}

//get message history for a room
export const getRoomMessages = async (roomId,before=null) => {
    const res = await api.get(`/rooms/${roomId}/messages`,{
        params:before ? {before}:{},
    });
    return res.data;//{messages}
}

export const getRoomByCode = async (roomCode) => {
  const res = await api.get(`/rooms/code/${roomCode}`);
  return res.data;
};

export const getRoomById = async (roomId) => {
  const res = await api.get(`/rooms/${roomId}`);
  return res.data; // {room}
};

// add to existing file
export const leaveRoom = async (roomId) => {
  const res = await api.post(`/rooms/${roomId}/leave`);
  return res.data;
};

export const deleteRoom = async (roomId) => {
  const res = await api.delete(`/rooms/${roomId}`);
  return res.data;
};

export const promoteMember = async (roomId, targetUserId) => {
  const res = await api.post(`/rooms/${roomId}/promote`, { targetUserId });
  return res.data;
};

export const kickMember = async (roomId, targetUserId, targetUserName) => {
  const res = await api.post(`/rooms/${roomId}/kick`, { targetUserId, targetUserName });
  return res.data;
};

export const blockMember = async (roomId, targetUserId, targetUserName) => {
  const res = await api.post(`/rooms/${roomId}/block`, { targetUserId, targetUserName });
  return res.data;
};

export const uploadRoomFile = async (roomId, file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);        
  formData.append("fileName", file.name); 

  const res = await api.post(`/rooms/${roomId}/image`, formData, { 
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (!onProgress) return;
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percent);
    },
  });

  return res.data;
};

