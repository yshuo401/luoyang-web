// 景点管理 API

import http from '../http'

export const scenicSpotApi = {
  // 管理端分页列表
  list: (params) => http.get('/admin/scenic-spots', { params }),

  // 详情
  detail: (id) => http.get('/admin/scenic-spots/' + id),

  // 创建
  create: (data) => http.post('/admin/scenic-spots', data),

  // 更新
  update: (id, data) => http.put('/admin/scenic-spots/' + id, data),

  // 删除（逻辑删除）
  remove: (id) => http.delete('/admin/scenic-spots/' + id),

  // 发布
  publish: (id) => http.post('/admin/scenic-spots/' + id + '/publish'),

  // 下架
  offline: (id) => http.post('/admin/scenic-spots/' + id + '/offline')
}
