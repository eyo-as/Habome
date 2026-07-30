import { User } from "./types";
import { authAPI } from "@/services/api";

export const SESSION_STORAGE_KEY = "ph_session";
export const TOKEN_STORAGE_KEY = "ph_token";

export function saveSession(user: User, token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem(SESSION_STORAGE_KEY);
  return session ? JSON.parse(session) : null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export async function loginUser(email: string, password: string) {
  const response = await authAPI.login({ email, password });
  const { user, token } = response.data.data;
  saveSession(user, token);
  return { user, token };
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: "owner" | "user",
) {
  const response = await authAPI.register({ name, email, password, role });
  const { user, token } = response.data.data;
  saveSession(user, token);
  return { user, token };
}

export async function getCurrentUser() {
  const response = await authAPI.me();
  return response.data.data.user;
}

export function getDashboardRedirectPath(role: string): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "owner":
      return "/owner";
    case "user":
      return "/";
    default:
      return "/";
  }
}
