import api from './axios'

export const messagesApi = {
  // Client
  clientGetChat:  (requestId) => api.get(`/client/requests/${requestId}/chat`),
  clientSend:     (requestId, data) => api.post(`/client/requests/${requestId}/chat`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // Admin
  adminGetChat: (requestId)        => api.get(`/admin/requests/${requestId}/chat`),
  adminSend:    (requestId, data)  => api.post(`/admin/requests/${requestId}/chat`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
}
