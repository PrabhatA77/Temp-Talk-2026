import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth:true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isCheckingAuth:false,
    }),

  updateUser: (partialUser) =>
    set((state) => ({ user: { ...state.user, ...partialUser } })),


  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isCheckingAuth:false,
    }),
}));

export default useAuthStore;