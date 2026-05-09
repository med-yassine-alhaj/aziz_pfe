import api from './axios'

export const servicesApi = {
  getAll:  ()       => api.get('/services'),
  getOne:  (id)     => api.get(`/services/${id}`),

  // Admin
  adminGetAll: ()        => api.get('/admin/services'),
  create:      (data)    => api.post('/admin/services', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:      (id, data) => api.put(`/admin/services/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:      (id)      => api.delete(`/admin/services/${id}`),
  toggle:      (id)      => api.patch(`/admin/services/${id}/toggle`),
}
