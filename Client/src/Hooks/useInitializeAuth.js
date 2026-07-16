import { useEffect } from "react";
import { getCurrentUser } from "../services/authService.js";
import useAuthStore from "../store/authStore.js";

export default function useIntializeAuth() {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch {
        clearUser();
      }
    };

    initialize();
  }, [setUser, clearUser]);
}
