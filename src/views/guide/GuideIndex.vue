<!-- 攻略管理列表页 -->
<template>
  <AdminLayout>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>攻略管理</span>
          <el-button type="primary" @click="$router.push('/guides/create')">新增攻略</el-button>
        </div>
      </template>

      <el-form inline class="search-bar">
        <el-form-item label="关键词">
          <el-input v-model="params.keyword" placeholder="标题关键词" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="params.status" placeholder="全部状态" clearable style="width:120px">
            <el-option label="草稿" value="DRAFT" />
            <el-option label="已发布" value="PUBLISHED" />
            <el-option label="已下架" value="OFFLINE" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="rows" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="title" label="攻略标题" min-width="180" show-overflow-tooltip />
        <el-table-column label="封面" width="70">
          <template #default="{ row }">
            <el-image v-if="row.coverFileId" :src="row.coverFileId" fit="cover" style="width:40px;height:40px;border-radius:4px" />
            <span v-else class="muted">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="suggestedDays" label="建议天数" width="90" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><StatusTag :status="row.status" /></template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览" width="80" />
        <el-table-column label="更新时间" width="160">
          <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="$router.push('/guides/' + row.id + '/edit')">编辑</el-button>
            <el-button v-if="row.status === 'DRAFT' || row.status === 'OFFLINE'" link type="success" @click="handlePublish(row.id)">发布</el-button>
            <el-button v-if="row.status === 'PUBLISHED'" link type="warning" @click="handleOffline(row.id)">下架</el-button>
            <el-popconfirm title="确定删除该攻略吗？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="params.page"
          v-model:page-size="params.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="search"
          @current-change="search"
        />
      </div>
    </el-card>
  </AdminLayout>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import AdminLayout from '../../layouts/AdminLayout.vue'
import StatusTag from '../../components/StatusTag.vue'
import { guideApi } from '../../api'

const rows = ref([])
const total = ref(0)
const loading = ref(false)

const params = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: ''
})

async function load() {
  loading.value = true
  try {
    const query = {
      page: params.page,
      pageSize: params.pageSize
    }
    if (params.keyword) query.keyword = params.keyword
    if (params.status) query.status = params.status
    const result = await guideApi.list(query)
    rows.value = result.records || []
    total.value = result.total || 0
  } catch (err) {
    if (err.code !== 40101) ElMessage.error(err.message || '加载攻略列表失败')
  } finally {
    loading.value = false
  }
}

function search() { params.page = 1; load() }
function resetSearch() { params.keyword = ''; params.status = ''; search() }

async function handlePublish(id) {
  try { await guideApi.publish(id); ElMessage.success('攻略已发布'); load() }
  catch (err) { ElMessage.error(err.message || '发布失败') }
}

async function handleOffline(id) {
  try { await guideApi.offline(id); ElMessage.success('攻略已下架'); load() }
  catch (err) { ElMessage.error(err.message || '下架失败') }
}

async function handleDelete(id) {
  try { await guideApi.remove(id); ElMessage.success('攻略已删除'); load() }
  catch (err) { ElMessage.error(err.message || '删除失败') }
}

function formatTime(str) {
  if (!str) return '--'
  return str.replace('T', ' ').substring(0, 19)
}

onMounted(load)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.search-bar { margin-bottom: 16px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
.muted { color: #94a3b8; }
</style>
