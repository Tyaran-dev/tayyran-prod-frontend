import axios from 'axios';
import { getAccessToken, setAccessToken, removeAccessToken } from './token';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("=== AXIOS ERROR INTERCEPTOR ===");
    console.log("Status:", error?.response?.status);
    console.log("Error URL:", error?.config?.url);

    const originalRequest = error.config;

    // Early returns for cases we can't handle
    if (!originalRequest) {
      console.log("⛔ No originalRequest — refresh can't run");
      return Promise.reject(error);
    }

    if (!error.response) {
      console.log("⛔ No error.response — network error or timeout");
      return Promise.reject(error);
    }

    // Only handle 401 errors for refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("🔄 Attempting refresh token...");
      originalRequest._retry = true;

      try {
        // Use axios directly, not the api instance (to avoid infinite loops)
        const refreshResponse = await axios.post(
          `${baseUrl}/auth/refreshToken`,
          {},
          { withCredentials: true }
        );

        console.log("🌟 Refresh success:", refreshResponse.data);

        const { accessToken } = refreshResponse.data;
        setAccessToken(accessToken);

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.log("❌ Refresh failed:", refreshError);
        removeAccessToken();
        
        // Only redirect if we're in the browser
        if (typeof window !== 'undefined') {
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default api;