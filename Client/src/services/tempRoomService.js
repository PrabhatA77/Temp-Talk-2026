import api from "./api";

export const createTempRoom = async(data) =>{
    const res = await api.post("/temp-room",data);
    return res.data;
}

export const joinTempRoom = async({roomId})=>{
    const res = await api.get(`/temp-room/${roomId}`);
    return res.data;
}

export const getTempRoomParticipants = async (roomId) => {
  const res = await api.get(`/temp-room/${roomId}/participants`);
  return res.data;
};

export const extendTempRoom = async ({ roomId, extraMinutes, userName }) => {
  const res = await api.patch(`/temp-room/${roomId}/extend`, {
    extraMinutes,
    userName,
  });
  return res.data;
};