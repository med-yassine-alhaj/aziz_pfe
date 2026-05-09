import api from './axios'

export const reportsApi = {
  revenue:        (params) => api.get('/accountant/reports/revenue', { params }),
  taxes:          (params) => api.get('/accountant/reports/taxes', { params }),
  unpaidInvoices: ()       => api.get('/accountant/reports/unpaid-invoices'),
  serviceRevenue: ()       => api.get('/accountant/reports/service-revenue'),
  clientRevenue:  ()       => api.get('/accountant/reports/client-revenue'),
}
