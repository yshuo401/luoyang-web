<template>
  <main class="login-page">
    <el-card class="login-card" shadow="always">
      <h1>洛阳旅游管理端</h1>
      <p class="muted">内容、攻略与知识库管理</p>
      <el-form :model="form" @submit.prevent="submit">
        <el-form-item label="账号"><el-input v-model="form.username" autocomplete="username" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="form.password" type="password" show-password autocomplete="current-password" /></el-form-item>
        <el-alert v-if="error" :title="error" type="error" :closable="false" class="form-alert" />
        <el-button type="primary" native-type="submit" :loading="loading" class="full-width">登录</el-button>
      </el-form>
    </el-card>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const form = reactive({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

async function submit() {
  if (!form.username || !form.password) { error.value = '请输入账号和密码'; return }
  loading.value = true
  error.value = ''
  try { await auth.login(form.username, form.password); router.replace('/dashboard') }
  catch (err) { error.value = err.response?.data?.message || err.message || '登录失败，请检查后端服务' }
  finally { loading.value = false }
}
</script>
