// src/api/api.js
import axios from "axios";

// Tu IP local
const API_URL = "http://192.168.0.9:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  createUser: (userData) => api.post("/auth/register", userData),
  getUsers: () => api.get("/courses/users"),
};

export const coursesApi = {
  getAll: () => api.get("/courses"),
  create: (courseData) => api.post("/courses", courseData),
  enroll: (enrollData) => api.post("/courses/enroll", enrollData),
  unenroll: (enrollData) => api.delete("/courses/enroll", { data: enrollData }),
  delete: (id) => api.delete(`/courses/${id}`),
  getEnrolledStudents: (courseId) => api.get(`/courses/${courseId}/students`),
  updateStatus: (id, isActive) =>
    api.patch(`/courses/${id}/status`, { isActive }),
  getMyCourses: (studentId) => api.get(`/courses/my-courses/${studentId}`),
};

export default api;
