<!-- 管理端外壳布局：侧边栏 + 顶栏 + 主内容区 -->
<template>
  <el-container class="admin-shell">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="admin-aside">
      <div class="brand">洛阳旅游管理</div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#132238"
        text-color="#c7d2e2"
        active-text-color="#fff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <span>工作台</span>
        </el-menu-item>

        <el-sub-menu index="content">
          <template #title>
            <el-icon><Collection /></el-icon>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/categories">景点分类</el-menu-item>
          <el-menu-item index="/scenic-spots">景点管理</el-menu-item>
          <el-menu-item index="/guides">攻略管理</el-menu-item>
          <el-menu-item index="/foods">美食管理</el-menu-item>
          <el-menu-item index="/banners">首页轮播</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧区域 -->
    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <span class="header-title">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <span class="header-user">{{ profile?.displayName || profile?.username || '管理员' }}</span>
          <el-button link type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>

      <el-main class="admin-main">
        <slot />
      </el-main>
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
const profile = computed(() => auth.profile)

// 当前激活的菜单项
const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/scenic-spots')) return '/scenic-spots'
  if (path.startsWith('/guides')) return '/guides'
  if (path.startsWith('/foods')) return '/foods'
  if (path.startsWith('/banners')) return '/banners'
  if (path.startsWith('/categories')) return '/categories'
  return path
})

// 面包屑标题从路由 meta.title 获取
const pageTitle = computed(() => route.meta.title || '工作台')

function handleLogout() {
  auth.logout()
  router.replace('/login')
}
</script>

<style scoped>
.admin-shell { min-height: 100vh; }
.admin-aside { background: #132238; overflow-y: auto; }
.brand { color: #fff; font-size: 18px; font-weight: 600; padding: 20px 18px; border-bottom: 1px solid rgba(255,255,255,.08); }
.admin-header { display: flex; align-items: center; justify-content: space-between; background: #fff; border-bottom: 1px solid #e5e7eb; padding: 0 24px; height: 56px; }
.header-left { display: flex; align-items: center; gap: 12px; }
.header-title { font-size: 16px; font-weight: 500; }
.header-right { display: flex; align-items: center; gap: 16px; }
.header-user { color: #64748b; font-size: 14px; }
.admin-main { padding: 24px; background: #f4f6f8; min-height: calc(100vh - 56px); }

/* 侧边栏子菜单缩进：二级菜单比一级菜单多缩进 24px，层级清晰 */
:deep(.el-sub-menu .el-menu-item) {
  padding-left: 56px !important;
}

/* 子菜单展开区域背景略深，区分层级 */
:deep(.el-menu--inline) {
  background-color: #0d1b2d !important;
}
</style>