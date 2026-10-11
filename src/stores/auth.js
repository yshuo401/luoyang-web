import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { adminApi } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('luoyang_admin_token') || '')
  const profile = ref(JSON.parse(localStorage.getItem('luoyang_admin_profile') || 'null'))
  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(username, password) {
    const result = await adminApi.login({ username, password })
    const data = result?.data || result
    token.value = data?.token || data?.accessToken || ''
    profile.value = data?.admin || data?.profile || { username }
    if (!token.value) throw new Error('登录响应缺少令牌')
    localStorage.setItem('luoyang_admin_token', token.value)
    localStorage.setItem('luoyang_admin_profile', JSON.stringify(profile.value))
  }

  function logout() {
    token.value = ''
    profile.value = null
    localStorage.removeItem('luoyang_admin_token')
    localStorage.removeItem('luoyang_admin_profile')
  }

  return { token, profile, isAuthenticated, login, logout }
})
