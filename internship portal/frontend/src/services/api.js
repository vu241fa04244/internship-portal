import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401 unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or unauthorized, clear token
      const isAuthRoute = error.config.url?.includes('/auth/login') || error.config.url?.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('skillbridge_token');
        localStorage.removeItem('skillbridge_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (profileData) => api.put('/students/profile', profileData),
  uploadResume: (formData) =>
    api.post('/students/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const internshipAPI = {
  getAll: (params) => api.get('/internships', { params }),
  getById: (id) => api.get(`/internships/${id}`),
  create: (data) => api.post('/internships', data),
  update: (id, data) => api.put(`/internships/${id}`, data),
  delete: (id) => api.delete(`/internships/${id}`),
};

export const applicationAPI = {
  apply: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my'),
  withdraw: (id) => api.delete(`/applications/${id}`),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
};

export const aiAPI = {
  getRecommendations: (skills) => api.post('/ai/recommendations', { skills }),
  analyzeResume: (formDataOrText) => {
    if (formDataOrText instanceof FormData) {
      return api.post('/ai/analyze-resume', formDataOrText, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/ai/analyze-resume', formDataOrText);
  },
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getStudents: (params) => api.get('/admin/students', { params }),
  getApplications: (params) => api.get('/admin/applications', { params }),
};

export default api;
