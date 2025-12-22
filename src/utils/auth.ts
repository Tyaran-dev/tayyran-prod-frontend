import api from "./axios";

export const getUserData = async () => {
  if (typeof window !== 'undefined') {
    console.log("Fetching user data...");
    try {
      const user = await api.get('/auth/me');
      if (user.data.user.emailVerified === true) return user.data.user;
      else return null;

    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return null;
    }

  }
}