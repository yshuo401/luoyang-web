<template>
  <el-container class="admin-shell">
    <el-aside width="220px" class="admin-aside">
      <div class="brand">洛阳旅游管理</div>
      <el-menu :default-active="$route.path" router background-color="#132238" text-color="#c7d2e2" active-text-color="#fff">
        <el-menu-item index="/dashboard">工作台</el-menu-item>
        <el-menu-item index="/scenic-spots">景点管理</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <span>{{ title }}</span>
        <el-button link @click="handleLogout">退出登录</el-button>
      </el-header>
      <el-main class="admin-main"><slot /></el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const title = computed(() => route.meta.title || '工作台')
function handleLogout() {
  auth.logout()
  router.replace('/login')
}
</script>
