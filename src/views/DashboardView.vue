<template>
  <AdminLayout>
    <el-page-header content="工作台" />
    <el-row :gutter="16" class="stat-row">
      <el-col :xs="24" :sm="8"><el-card><div class="stat-label">景点内容</div><strong>待接入</strong><p class="muted">通过后端 API 统计</p></el-card></el-col>
      <el-col :xs="24" :sm="8"><el-card><div class="stat-label">攻略内容</div><strong>待接入</strong><p class="muted">通过后端 API 统计</p></el-card></el-col>
      <el-col :xs="24" :sm="8"><el-card><div class="stat-label">知识文档</div><strong>待接入</strong><p class="muted">通过后端 API 统计</p></el-card></el-col>
    </el-row>
    <el-card class="welcome-card"><h2>欢迎使用洛阳旅游信息管理系统</h2><p>当前已完成管理端工程骨架，下一步可接入管理员认证、景点和攻略 CRUD。</p></el-card>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '../layouts/AdminLayout.vue'
</script>
