// 美食管理 API

import http from '../http'

export const foodApi = {
  // 管理端分页列表
  list: (params) => http.get('/admin/foods', { params }),

  // 详情
  detail: (id) => http.get('/admin/foods/' + id),

  // 创建
  create: (data) => http.post('/admin/foods', data),

  // 更新
  update: (id, data) => http.put('/admin/foods/' + id, data),

  // 删除
  remove: (id) => http.delete('/admin/foods/' + id),

  // 发布
  publish: (id) => http.post('/admin/foods/' + id + '/publish'),

  // 下架
  offline: (id) => http.post('/admin/foods/' + id + '/offline')
}
