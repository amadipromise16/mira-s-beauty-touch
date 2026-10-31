// Client API Service for Mira's Beauty Touch

const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('mbt_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    me: () => request('/auth/me'),
    forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
    updateProfile: (profile) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  },

  // Services
  services: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/services${q ? `?${q}` : ''}`);
    },
    getCategories: () => request('/services/categories'),
    getById: (id) => request(`/services/${id}`),
    create: (serviceData) => request('/services', { method: 'POST', body: JSON.stringify(serviceData) }),
    update: (id, serviceData) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(serviceData) }),
    delete: (id) => request(`/services/${id}`, { method: 'DELETE' }),
  },

  // Perfumes
  perfumes: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/perfumes${q ? `?${q}` : ''}`);
    },
    getBrands: () => request('/perfumes/brands'),
    getById: (id) => request(`/perfumes/${id}`),
    create: (data) => request('/perfumes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/perfumes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/perfumes/${id}`, { method: 'DELETE' }),
  },

  // Gallery
  gallery: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/gallery${q ? `?${q}` : ''}`);
    },
    toggleLike: (id) => request(`/gallery/${id}/like`, { method: 'POST' }),
    create: (data) => request('/gallery', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),
  },

  // Appointments
  appointments: {
    create: (data) => request('/appointments', { method: 'POST', body: JSON.stringify(data) }),
    getMyBookings: () => request('/appointments/my-bookings'),
    cancel: (id) => request(`/appointments/${id}/cancel`, { method: 'POST' }),
    getAvailability: (date) => request(`/appointments/availability?date=${date}`),
  },

  // Notifications
  notifications: {
    getAll: () => request('/notifications'),
    markAsRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllAsRead: () => request('/notifications/read-all', { method: 'PUT' }),
  },

  // Admin
  admin: {
    getStats: () => request('/admin/stats'),
    getAppointments: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/admin/appointments${q ? `?${q}` : ''}`);
    },
    approveAppointment: (id, payload) => request(`/admin/appointments/${id}/approve`, { method: 'PUT', body: JSON.stringify(payload || {}) }),
    rejectAppointment: (id, payload) => request(`/admin/appointments/${id}/reject`, { method: 'PUT', body: JSON.stringify(payload || {}) }),
    rescheduleAppointment: (id, payload) => request(`/admin/appointments/${id}/reschedule`, { method: 'PUT', body: JSON.stringify(payload) }),
    completeAppointment: (id) => request(`/admin/appointments/${id}/complete`, { method: 'PUT' }),
    deleteAppointment: (id) => request(`/admin/appointments/${id}`, { method: 'DELETE' }),
    getUsers: () => request('/admin/users'),
    getSettings: () => request('/admin/settings'),
    updateSettings: (settings) => request('/admin/settings', { method: 'PUT', body: JSON.stringify({ settings }) }),
  }
};

