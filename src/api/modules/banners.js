// 首页轮播管理 API

import http from '../http'

export const bannerApi = {
  // 管理端列表
  list: (params) => http.get('/admin/banners', { params }),

  // 创建
  create: (data) => http.post('/admin/banners', data),

  // 更新
  update: (id, data) => http.put('/admin/banners/' + id, data),

  // 删除
  remove: (id) => http.delete('/admin/banners/' + id),

  // 启用/禁用
  toggle: (id) => http.put('/admin/banners/' + id + '/toggle')
}
