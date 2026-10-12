<!-- 管理员登录页 -->
<template>
  <main class="login-page">
    <el-card class="login-card" shadow="always">
      <h1>洛阳旅游管理端</h1>
      <p class="muted">内容、攻略与知识库管理</p>
      <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="submit">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" autocomplete="username" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" autocomplete="current-password" size="large" />
        </el-form-item>
        <el-alert v-if="error" :title="error" type="error" :closable="false" class="form-alert" />
        <el-button type="primary" native-type="submit" :loading="loading" size="large" class="full-width">登 录</el-button>
      </el-form>

      <el-divider />
      <p class="muted hint-text">后端未就绪时，可进入演示模式体验所有管理页面</p>
      <el-button type="warning" size="large" class="full-width" @click="demoLogin">演示模式（跳过登录）</el-button>
    </el-card>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const formRef = ref(null)

const form = reactive({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function submit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  error.value = ''
  try {
    await auth.login(form.username, form.password)
    const redirect = route.query.redirect || '/dashboard'
    router.replace(redirect)
  } catch (err) {
    error.value = err.response?.data?.message || err.message || '登录失败，请检查后端服务'
  } finally {
    loading.value = false
  }
}

// 演示模式：注入 mock token，绕过登录直接进入管理端
function demoLogin() {
  const mockToken = 'demo-mock-token-for-development'
  const mockProfile = {
    id: 1,
    username: 'demo',
    displayName: '演示管理员',
    roleCode: 'SUPER_ADMIN'
  }
  localStorage.setItem('luoyang_admin_token', mockToken)
  localStorage.setItem('luoyang_admin_profile', JSON.stringify(mockProfile))
  // 直接写入 pinia store（绕过 API 调用）
  auth.token = mockToken
  auth.profile = mockProfile
  const redirect = route.query.redirect || '/dashboard'
  router.replace(redirect)
}
</script>

<style scoped>
.login-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: linear-gradient(135deg, #edf5ff, #f8fafc); }
.login-card { width: min(420px, 100%); }
.login-card h1 { margin: 0 0 8px; font-size: 24px; text-align: center; }
.muted { color: #64748b; text-align: center; margin-bottom: 24px; }
.hint-text { margin: 0 0 12px; font-size: 13px; }
.form-alert { margin-bottom: 16px; }
.full-width { width: 100%; }
</style>