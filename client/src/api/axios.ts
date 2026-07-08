import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const baseURL =
  import.meta.env.VITE_API_URL || "https://YOUR-BACKEND-NAME.onrender.com/api";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      const { token, logout } = useAuthStore.getState();

      if (token) {
        logout();

        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) return error.message;

  return fallback;
}

export function resolveImageUrl(image?: string | null): string | null {
  if (!image) return null;

  if (/^https?:\/\//i.test(image)) return image;

  const normalized = image.replace(/\\/g, "/").replace(/^\/+/, "");

  return `${baseURL.replace("/api", "")}/${normalized}`;
}