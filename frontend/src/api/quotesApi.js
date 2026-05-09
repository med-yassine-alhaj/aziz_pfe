import api from './axios'

export const quotesApi = {
  // Client
  clientGetAll: (params) => api.get('/client/quotes', { params }),
  clientGetOne: (id)     => api.get(`/client/quotes/${id}`),
  clientAccept: (id)     => api.post(`/client/quotes/${id}/accept`),
  clientRefuse: (id)     => api.post(`/client/quotes/${id}/refuse`),
  clientDownload: (id)   => api.get(`/client/quotes/${id}/download`, { responseType: 'blob' }),

  // Admin
  adminGetAll:       (params) => api.get('/admin/quotes', { params }),
  adminGetOne:       (id)     => api.get(`/admin/quotes/${id}`),
  adminCreate:       (data)   => api.post('/admin/quotes', data),
  adminUpdate:       (id, data) => api.put(`/admin/quotes/${id}`, data),
  adminSend:         (id)     => api.post(`/admin/quotes/${id}/send`),
  adminConvert:      (id)     => api.post(`/admin/quotes/${id}/convert-to-invoice`),
  adminDownload:     (id)     => api.get(`/admin/quotes/${id}/download`, { responseType: 'blob' }),
}
