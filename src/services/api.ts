import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Example service functions
export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
};

export const accommodationService = {
  getAll: (filters: any) => api.get('/accommodations', { params: filters }),
  getById: (id: string) => api.get(`/accommodations/${id}`),
  getByOwner: (ownerId: string) => api.get(`/accommodations/owner/${ownerId}`),
  create: (data: any) => api.post('/accommodations', data),
  update: (id: string, data: any) => api.put(`/accommodations/${id}`, data),
  delete: (id: string) => api.delete(`/accommodations/${id}`),
};

export const bookingService = {
  create: (data: any) => api.post('/bookings', data),
  getByOwner: (ownerId: string) => api.get(`/bookings/owner/${ownerId}`),
  updateStatus: (id: string, status: string) => api.put(`/bookings/${id}/status`, { status }),
};

export const restaurantService = {
  getMenu: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/menu`),
  placeOrder: (orderData: any) => api.post('/orders', orderData),
};
