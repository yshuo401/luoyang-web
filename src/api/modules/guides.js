// 攻略管理 API

import http from '../http'

export const guideApi = {
  // 管理端分页列表
  list: (params) => http.get('/admin/guides', { params }),

  // 详情（含每日行程）
  detail: (id) => http.get('/admin/guides/' + id),

  // 创建
  create: (data) => http.post('/admin/guides', data),

  // 更新
  update: (id, data) => http.put('/admin/guides/' + id, data),

  // 删除
  remove: (id) => http.delete('/admin/guides/' + id),

  // 发布
  publish: (id) => http.post('/admin/guides/' + id + '/publish'),

  // 下架
  offline: (id) => http.post('/admin/guides/' + id + '/offline')
}
