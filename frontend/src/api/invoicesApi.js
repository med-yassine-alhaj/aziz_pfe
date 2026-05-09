import api from './axios'

export const invoicesApi = {
  // Client
  clientGetAll:  (params) => api.get('/client/invoices', { params }),
  clientGetOne:  (id)     => api.get(`/client/invoices/${id}`),
  clientPay:     (id, data) => api.post(`/client/invoices/${id}/pay`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  clientDownload: (id)    => api.get(`/client/invoices/${id}/download`, { responseType: 'blob' }),

  // Admin
  adminGetAll:          (params) => api.get('/admin/invoices', { params }),
  adminGetOne:          (id)     => api.get(`/admin/invoices/${id}`),
  adminSendToAccountant: (id)    => api.post(`/admin/invoices/${id}/send-to-accountant`),
  adminCancel:          (id)     => api.post(`/admin/invoices/${id}/cancel`),
  adminDownload:        (id)     => api.get(`/admin/invoices/${id}/download`, { responseType: 'blob' }),

  // Accountant
  accountantGetAll:  (params) => api.get('/accountant/invoices', { params }),
  accountantGetOne:  (id)     => api.get(`/accountant/invoices/${id}`),
  accountantValidate: (id)    => api.post(`/accountant/invoices/${id}/validate`),
  accountantCancel:  (id)     => api.post(`/accountant/invoices/${id}/cancel`),
  accountantDownload: (id)    => api.get(`/accountant/invoices/${id}/download`, { responseType: 'blob' }),
  accountantExport:  ()       => api.get('/accountant/invoices/export/csv', { responseType: 'blob' }),
}
