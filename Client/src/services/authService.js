import api from "./api";

export const register = async (data)=>{
    const res = await api.post("/auth/register",data);
    return res.data;
}

export const login = async (data)=>{
    const res = await api.post("/auth/login",data);
    return res.data;
}

export const googleLogin = async (credential) => {
  const res = await api.post("/auth/google", { credential });
  return res.data;
};

export const verifyOtp = async (data)=>{
    const res = await api.post("/auth/verify-email",data);
    return res.data;
}

export const sendVerificationOtp = async (data)=>{
    const res = await api.post("/auth/send-verification-otp",data);
    return res.data;
}

export const sendResetOtp = async (data) => {
  const res = await api.post("/auth/send-reset-otp", data);
  return res.data;
};

export const forgotPassword = async (data)=>{
    const res = await api.post("/auth/forgot-password",data);
    return res.data;
}

export const verifyResetOtp = async (data)=>{
    const res = await api.post("/auth/verify-reset-otp",data);
    return res.data;
}

export const resetPassword = async (data)=>{
    const res = await api.post("/auth/reset-password",data);
    return res.data;
}

export const logout = async (data)=>{
    const res = await api.post("/auth/logout",data);
    return res.data;
}

export const getCurrentUser = async (data)=>{
    const res = await api.get("/auth/profile",data);
    return res.data;
}

// add to existing file
export const updateUsername = async (userName) => {
  const res = await api.patch("/auth/profile/username", { userName });
  return res.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const res = await api.patch("/auth/profile/password", { currentPassword, newPassword });
  return res.data;
};

export const updateAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await api.post("/auth/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteAccount = async (password) => {
  const res = await api.delete("/auth/profile", { data: { password } });
  return res.data;
};

export const sendFeedbackAPI = async (category, message) => {
  const response = await api.post("/auth/feedback", { category, message });
  return response.data;
};
