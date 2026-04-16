import axios from "axios";
import { getDefaultStore } from "jotai";
import { authAtom, INITIAL_AUTHENTICATION_VALUE } from "../hooks/useAuth.tsx";
import { toast } from "../hooks/use-toast.ts";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Helper to get current access token from store
async function getAccessToken() {
  const store = getDefaultStore();
  return (await store.get(authAtom))?.accessToken;
}

// Help er to set auth state after login/signup
async function handleAuthSuccess(authPayload: any) {
  const store = getDefaultStore();
  if (authPayload && authPayload.token) {
    store.set(authAtom, {
      // isAuthenticated: true,
      user: authPayload.user,
      accessToken: authPayload.token,
      refreshToken: authPayload.refreshToken,
    });
  } else {
    store.set(authAtom, INITIAL_AUTHENTICATION_VALUE);
  }
}

// Request interceptor: attach access token
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjlmZWU4Yzc5LTc1OGItNGU1MC1iZmJkLTk4YzFmNGQzNjU0OCIsImlhdCI6MTc3NjE3OTIzNSwiZXhwIjoxNzc2MjY1NjM1fQ.1ENPrVd73WR1WUcT04NtSkPEx9d9au-oTcD-wt9IYuA"
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle errors, logout on 401, show toast messages
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response: resp } = error;

    // Explicit 401: clear auth & notify
    if (resp && resp.status === 401) {
      const store = getDefaultStore();
      store.set(authAtom, INITIAL_AUTHENTICATION_VALUE);
      toast({
        title: "Unauthorized",
        description:
          resp?.data?.message || "Session expired. Please log in again.",
      });
      return Promise.reject(error);
    }

    // Handle validation and other backend error responses
    if (resp && resp.data && resp.data.message) {
      toast({
        title: "Error",
        description: resp.data.message,
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred.",
      });
    }
    return Promise.reject(error);
  },
);

/**
 * API Auth Methods (matching backend routes)
 */
export const AuthAPI = {
  async signup(data: { name: string; email: string; password: string }) {
    try {
      const res = await api.post("/auth/signup", data);
      if (res.data.success && res.data.data) {
        await handleAuthSuccess(res.data.data);
      }
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },
  async login(data: { email: string; password: string }) {
    try {
      const res = await api.post("/auth/login", data);
      if (res.data.success && res.data.data) {
        await handleAuthSuccess(res.data.data);
      }
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },
  async forgotPassword(email: string) {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },
  async resetPassword(token: string, password: string) {
    token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY5MzQwMGUyLTJkMTItNDEzYS1iN2ZkLTI1MWY4NWFlNWZmZiIsImlhdCI6MTc3NTQ3NjY2OSwiZXhwIjoxNzc1NTYzMDY5fQ.y4cispl10EKNtr89QmE4dNclnky7KdwMSHI4H9rH5Uk";
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },
  async getMe() {
    try {
      const res = await api.get("/auth/me");
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },
};

export default api;
