import api from './axios'

export const packsApi = {
  getAll:      ()         => api.get('/packs'),
  getOne:      (id)       => api.get(`/packs/${id}`),

  // Admin
  adminGetAll: ()         => api.get('/admin/packs'),
  create:      (data)     => api.post('/admin/packs', data),
  update:      (id, data) => api.put(`/admin/packs/${id}`, data),
  delete:      (id)       => api.delete(`/admin/packs/${id}`),
  toggle:      (id)       => api.patch(`/admin/packs/${id}/toggle`),
}
