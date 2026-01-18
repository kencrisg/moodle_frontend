import axios from 'axios';

// CAMBIA ESTO POR LA IP DE TU PC. 
// Si tu backend corre en el puerto 3000:
const API_URL = 'http://192.168.0.9:3000'; 

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    // Basado en tu AuthController
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
};

export const coursesApi = {
    // Basado en tu CourseController
    getAll: () => api.get('/courses'),
    create: (courseData) => api.post('/courses', courseData),
    enroll: (enrollData) => api.post('/courses/enroll', { body: enrollData }), // Ojo: tu controller espera { body: ... }
    unenroll: (enrollData) => api.delete('/courses/enroll', { data: enrollData }),
};

export default api;