// APIConfiguration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    register: `${API_URL}/api/auth/register`,
    me: `${API_URL}/api/auth/me`,
  },
  admin: {
    stats: `${API_URL}/admin/stats`,
    users: `${API_URL}/admin/users`,
    workers: `${API_URL}/admin/workers`,
    services: `${API_URL}/admin/services`,
    feedbacks: `${API_URL}/admin/feedbacks`,
  },
  workers: {
    list: `${API_URL}/workers`,
    byId: (id: string) => `${API_URL}/workers/${id}`,
    feedback: (id: string) => `${API_URL}/workers/${id}/feedback`,
  },
  category: `${API_URL}/category`,
};

export default API_URL;
