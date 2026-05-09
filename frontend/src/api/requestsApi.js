import api from './axios'

export const requestsApi = {
  // Client
  clientGetAll:  (params) => api.get('/client/requests', { params }),
  clientGetOne:  (id)     => api.get(`/client/requests/${id}`),
  clientCreate:  (data)   => api.post('/client/requests', data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // Admin
  adminGetAll:       (params) => api.get('/admin/requests', { params }),
  adminGetOne:       (id)     => api.get(`/admin/requests/${id}`),
  adminUpdateStatus: (id, data) => api.put(`/admin/requests/${id}/status`, data),
  adminAssign:       (id, data) => api.put(`/admin/requests/${id}/assign`, data),
  adminOpenConv:     (id)       => api.post(`/admin/requests/${id}/open-conversation`),
}
