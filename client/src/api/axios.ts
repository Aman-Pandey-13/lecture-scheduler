import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const api = axios.create({ baseURL:"https://lecture-scheduler-fj8o.onrender.com" });

/** Attach the JWT from the auth store to every request. */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** On an expired/invalid session, clear auth and bounce to login. */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      const { token, logout } = useAuthStore.getState();
      // Only force a redirect if we thought we were logged in — avoids
      // hijacking the login form's own 401 (bad credentials).
      if (token) {
        logout();
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }
    }
    return Promise.reject(error);
  },
);

/** Pull a human-readable message out of an Axios error, falling back sensibly. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

/** Build an absolute URL for an uploaded course image (server stores a relative path). */
export function resolveImageUrl(image?: string | null): string | null {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;
  const normalized = image.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${baseURL}/${normalized}`;
}
