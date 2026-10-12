// 管理员认证 API

import http from '../http'

export const adminAuthApi = {
  // 登录，返回 { token, admin: { id, username, displayName, roleCode } }
  login: (username, password) => http.post('/admin/auth/login', { username, password }),

  // 登出
  logout: () => http.post('/admin/auth/logout'),

  // 获取当前管理员信息
  me: () => http.get('/admin/auth/me')
}
