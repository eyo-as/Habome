import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ph_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("ph_session");
      localStorage.removeItem("ph_token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const propertyAPI = {
  getAll: (params?: Record<string, string | number>) =>
    api.get("/properties", { params }),
  getById: (id: string) => api.get(`/properties/${id}`),
  getMyListings: () => api.get("/properties/my/listings"),
  create: (data: Record<string, unknown>) => api.post("/properties", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/properties/${id}`, data),
  publish: (id: string) => api.patch(`/properties/${id}/publish`),
  archive: (id: string) => api.patch(`/properties/${id}/archive`),
  delete: (id: string) => api.delete(`/properties/${id}`),
};

export const favoriteAPI = {
  getAll: () => api.get("/favorites"),
  add: (propertyId: string) => api.post(`/favorites/${propertyId}`),
  remove: (propertyId: string) => api.delete(`/favorites/${propertyId}`),
};

export const adminAPI = {
  getAllProperties: (params?: Record<string, number>) =>
    api.get("/admin/properties", { params }),
  getAllUsers: (params?: Record<string, number>) =>
    api.get("/admin/users", { params }),
  disableProperty: (id: string) => api.patch(`/admin/properties/${id}/disable`),
  getMetrics: () => api.get("/admin/metrics"),
};

export const contactAPI = {
  send: (propertyId: string, message: string) =>
    api.post(`/contact/${propertyId}`, { message }),
  getInbox: () => api.get("/contact/inbox"),
};

export const uploadAPI = {
  uploadImages: (formData: FormData) =>
    api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default api;
