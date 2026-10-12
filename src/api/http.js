// Axios 实例 — 管理端统一 HTTP 客户端
// 自动附加 Bearer token，统一解包 ApiResponse 信封

import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// ========== 请求拦截器：附加 token ==========
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('luoyang_admin_token')
  if (token) config.headers.Authorization = Bearer  + token
  return config
})

// ========== 响应拦截器：解包 ApiResponse 信封 ==========
http.interceptors.response.use(
  (response) => {
    const body = response.data
    // 兼容两种格式：标准信封 {"code":0,...} 以及裸数据
    if (body && typeof body.code === 'number') {
      if (body.code !== 0) {
        const err = new Error(body.message || '请求失败')
        err.code = body.code
        err.requestId = body.requestId
        return Promise.reject(err)
      }
      return body.data !== undefined ? body.data : body
    }
    return body
  },
  (error) => {
    // 从 error.response.data 中提取业务错误信息
    if (error.response?.data) {
      const body = error.response.data
      if (body && typeof body.code === 'number') {
        error.code = body.code
        error.message = body.message || error.message
        error.requestId = body.requestId
      }
    }
    // 401 统一跳转登录页
    if (error.response?.status === 401) {
      localStorage.removeItem('luoyang_admin_token')
      localStorage.removeItem('luoyang_admin_profile')
      window.location.assign('/login')
    }
    return Promise.reject(error)
  }
)

export default http
