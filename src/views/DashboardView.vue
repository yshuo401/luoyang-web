<!-- 工作台首页 -->
<template>
  <AdminLayout>
    <el-page-header content="工作台" />

    <el-row :gutter="16" class="stat-row">
      <el-col :xs="24" :sm="8" v-for="card in statCards" :key="card.name">
        <el-card shadow="hover">
          <div class="stat-label">{{ card.label }}</div>
          <strong class="stat-number">{{ card.count }}</strong>
          <p class="muted">{{ card.desc }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="welcome-card">
      <h2>欢迎使用洛阳旅游信息管理系统</h2>
      <p>本系统用于管理洛阳旅游景点、攻略、美食和首页轮播等内容数据。左侧菜单可进入各管理模块。</p>
      <el-divider />
      <el-descriptions :column="2" border size="small" title="快速导航">
        <el-descriptions-item label="景点管理">
          <el-button link type="primary" @click="$router.push('/scenic-spots')">管理景点 →</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="攻略管理">
          <el-button link type="primary" @click="$router.push('/guides')">管理攻略 →</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="美食管理">
          <el-button link type="primary" @click="$router.push('/foods')">管理美食 →</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="分类管理">
          <el-button link type="primary" @click="$router.push('/categories')">管理分类 →</el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'

// 统计数据占位 — 后续接入后端统计接口
const statCards = ref([
  { name: 'scenic', label: '景点内容', count: '--', desc: '通过后端 API 统计' },
  { name: 'guide', label: '攻略内容', count: '--', desc: '通过后端 API 统计' },
  { name: 'food', label: '美食内容', count: '--', desc: '通过后端 API 统计' }
])
</script>

<style scoped>
.stat-row { margin-top: 20px; }
.stat-label { color: #64748b; margin-bottom: 8px; }
.stat-number { font-size: 28px; font-weight: 600; }
.muted { color: #94a3b8; font-size: 13px; margin-top: 4px; }
.welcome-card { margin-top: 20px; }
.welcome-card h2 { margin: 0 0 8px; }
</style>
