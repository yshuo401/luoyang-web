// 景点分类管理 API

import http from '../http'

export const categoryApi = {
  // 管理端列表（不分页，返回全部分类）
  list: () => http.get('/admin/categories'),

  // 创建分类
  create: (data) => http.post('/admin/categories', data),

  // 更新分类
  update: (id, data) => http.put('/admin/categories/' + id, data),

  // 删除分类（校验无景点引用）
  remove: (id) => http.delete('/admin/categories/' + id)
}
