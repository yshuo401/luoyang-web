<template>
  <AdminLayout>
    <el-page-header content="景点管理" />
    <el-card class="toolbar-card">
      <el-form inline @submit.prevent="load">
        <el-form-item label="关键词"><el-input v-model="keyword" placeholder="名称或地址" clearable @keyup.enter="load" /></el-form-item>
        <el-button type="primary" :loading="loading" @click="load">查询</el-button>
      </el-form>
    </el-card>
    <el-card>
      <el-empty v-if="!loading && rows.length === 0" description="暂无数据，等待后端景点接口接入" />
      <el-table v-else v-loading="loading" :data="rows" stripe>
        <el-table-column prop="name" label="景点名称" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="status" label="状态" />
      </el-table>
    </el-card>
  </AdminLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AdminLayout from '../layouts/AdminLayout.vue'
import { adminApi } from '../api'

const keyword = ref('')
const rows = ref([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const result = await adminApi.scenicSpots({ keyword: keyword.value, page: 1, pageSize: 20 })
    rows.value = result?.data?.records || result?.records || result?.data || []
  } catch (err) {
    if (err.response?.status !== 401) ElMessage.info('景点接口尚未连接，已保留空列表')
    rows.value = []
  } finally { loading.value = false }
}
onMounted(load)
</script>
