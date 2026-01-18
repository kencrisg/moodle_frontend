// src/api/api.js (Actualización)
import axios from "axios";

// RECUERDA: Cambia esto por tu IP local
const API_URL = "http://192.168.0.9:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  // Registro para admin o estudiante
  register: (userData) => api.post("/auth/register", userData),
};

export const coursesApi = {
  getAll: () => api.get("/courses"),
  create: (courseData) => api.post("/courses", courseData),
  // El controller espera { body: { studentId, courseId } }
  enroll: (enrollData) => api.post("/courses/enroll", enrollData),
  unenroll: (enrollData) => api.delete("/courses/enroll", { data: enrollData }),
};

export default api;
