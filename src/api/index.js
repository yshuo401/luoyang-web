// API 统一入口 — 按模块导出

import http from './http'

export { adminAuthApi } from './modules/adminAuth.js'
export { categoryApi } from './modules/categories.js'
export { scenicSpotApi } from './modules/scenicSpots.js'
export { guideApi } from './modules/guides.js'
export { foodApi } from './modules/foods.js'
export { bannerApi } from './modules/banners.js'
export { fileApi } from './modules/files.js'

// 兼容旧版引用（如需直接使用 http 实例）
export const adminApi = {
  login: (payload) => http.post('/admin/auth/login', payload),
  logout: () => http.post('/admin/auth/logout'),
  scenicSpots: (params) => http.get('/public/scenic-spots', { params }),
  scenicCategories: () => http.get('/public/categories')
}