import api from './axios'

export const projectsApi = {
  getAll: (scope = 'client') => api.get(`/${scope}/projects`),
  getOne: (scope, id) => api.get(`/${scope}/projects/${id}`),
  updateStage: (id, data) => api.put(`/engineer/projects/${id}/stage`, data),
  uploadDocument: (id, data) => api.post(`/engineer/projects/${id}/documents`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateDocumentState: (id, documentId, data) => api.put(`/engineer/projects/${id}/documents/${documentId}/state`, data),
  downloadDocument: (id, documentId) => api.get(`/engineer/projects/${id}/documents/${documentId}/download`, {
    responseType: 'blob',
  }),
}
