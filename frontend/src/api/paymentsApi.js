import api from './axios'

export const paymentsApi = {
  accountantGetAll:       (params) => api.get('/accountant/payments', { params }),
  accountantGetOne:       (id)     => api.get(`/accountant/payments/${id}`),
  accountantAccept:       (id, data) => api.post(`/accountant/payments/${id}/accept`, data),
  accountantReject:       (id, data) => api.post(`/accountant/payments/${id}/reject`, data),
  accountantGenReceipt:   (id)     => api.post(`/accountant/payments/${id}/generate-receipt`, {}, { responseType: 'blob' }),
}
