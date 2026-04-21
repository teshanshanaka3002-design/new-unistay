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
  getById: (id: string) => api.get(`/bookings/${id}`),
  getByOwner: (ownerId: string) => api.get(`/bookings/owner/${ownerId}`),
  getByStudent: (studentId: string) => api.get(`/bookings/student/${studentId}`),
  updateStatus: (id: string, status: string, notes?: string) => api.put(`/bookings/${id}/status`, { status, notes }),
  uploadPaymentProof: (id: string, paymentProof: string) => api.put(`/bookings/${id}/proof`, { paymentProof }),
  addMonthlyPayment: (id: string, data: { amount: number, proof: string }) => api.post(`/bookings/${id}/payments`, data),
  delete: (id: string) => api.delete(`/bookings/${id}`),
};

export const restaurantService = {
  // Canteen / Cafe
  getAllCanteens: () => api.get('/restaurants'),
  getCanteensByOwner: (ownerId: string) => api.get(`/restaurants/owner/${ownerId}`),
  createCanteen: (data: any) => api.post('/restaurants', data),
  updateCanteen: (id: string, data: any) => api.put(`/restaurants/${id}`, data),
  deleteCanteen: (id: string) => api.delete(`/restaurants/${id}`),

  // Menu Items
  getMenu: (canteenId: string) => api.get(`/restaurants/${canteenId}/menu`),
  createMenuItem: (canteenId: string, data: any) => api.post(`/restaurants/${canteenId}/menu`, data),
  updateMenuItem: (id: string, data: any) => api.put(`/restaurants/menu/${id}`, data),
  deleteMenuItem: (id: string) => api.delete(`/restaurants/menu/${id}`),

  // Orders
  placeOrder: (orderData: any) => api.post('/orders', orderData),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
  getOrdersByOwner: (ownerId: string) => api.get(`/orders/owner/${ownerId}`),
  getOrdersByStudent: (studentId: string) => api.get(`/orders/student/${studentId}`),
  updateOrderStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getOwners: () => api.get('/admin/owners'),
  getOwnerListings: (id: string) => api.get(`/admin/owner/${id}/listings`),
  warnUser: (id: string, note?: string) => api.post(`/admin/warn/${id}`, { note }),
  banUser: (id: string) => api.delete(`/admin/ban/${id}`),
  getHeroContent: () => api.get('/admin/hero'),
  createHeroContent: (data: any) => api.post('/admin/hero', data),
  deleteHeroContent: (id: string) => api.delete(`/admin/hero/${id}`),
  getStudents: () => api.get('/admin/students'),
  deleteStudent: (id: string) => api.delete(`/admin/students/${id}`),
  // New Report related admin endpoints
  getAdminReports: () => api.get('/reports/admin/all'),
  replyToReport: (id: string, data: { message: string, status?: string }) => api.post(`/reports/${id}/reply`, data)
};

export const reportService = {
  submitReport: (data: any) => api.post('/reports/submit', data),
  getStudentReports: () => api.get('/reports/my-reports'),
};

export const reviewService = {
  submitReview: (data: { type: 'WEBSITE' | 'STAY' | 'MEAL', targetId?: string, rating: number, comment: string }) => 
    api.post('/reviews', data),
  getReviewsByTarget: (type: string, id?: string) => 
    api.get(`/reviews/target/${type}${id ? `/${id}` : ''}`),
  // Admin only
  getAllReviews: () => api.get('/reviews/admin/all'),
  replyToReview: (id: string, message: string) => 
    api.post(`/reviews/admin/reply/${id}`, { message }),
  deleteReview: (id: string) => api.delete(`/reviews/admin/${id}`),
};
