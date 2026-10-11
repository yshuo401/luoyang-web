import http from './http'

export const adminApi = {
  login: (payload) => http.post('/admin/auth/login', payload),
  logout: () => http.post('/admin/auth/logout'),
  scenicSpots: (params) => http.get('/public/scenic-spots', { params }),
  scenicCategories: () => http.get('/public/categories')
}
