// 管理员认证状态管理
// 对应后端 POST /api/v1/admin/auth/login 响应：
//   { token, admin: { id, username, displayName, roleCode } }

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { adminAuthApi } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('luoyang_admin_token') || '')
  const profile = ref(JSON.parse(localStorage.getItem('luoyang_admin_profile') || 'null'))
  const isAuthenticated = computed(() => Boolean(token.value))

  // 登录 — 调用后端接口
  async function login(username, password) {
    const data = await adminAuthApi.login(username, password)
    token.value = data.token
    profile.value = data.admin
    if (!token.value) throw new Error('登录响应缺少令牌')
    localStorage.setItem('luoyang_admin_token', token.value)
    localStorage.setItem('luoyang_admin_profile', JSON.stringify(profile.value))
  }

  // 获取当前管理员信息（用于恢复登录态校验）
  async function fetchMe() {
    try {
      const admin = await adminAuthApi.me()
      profile.value = admin
      localStorage.setItem('luoyang_admin_profile', JSON.stringify(admin))
    } catch {
      logout()
    }
  }

  // 登出 — 调用后端接口后清除本地状态
  async function logout(quiet) {
    try { await adminAuthApi.logout() } catch { /* 即使后端登出失败也清除本地 */ }
    token.value = ''
    profile.value = null
    localStorage.removeItem('luoyang_admin_token')
    localStorage.removeItem('luoyang_admin_profile')
  }

  return { token, profile, isAuthenticated, login, logout, fetchMe }
})
