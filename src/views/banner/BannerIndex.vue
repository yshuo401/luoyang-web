<!-- 首页轮播管理 -->
<template>
  <AdminLayout>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>首页轮播</span>
          <el-button type="primary" @click="openCreate">新增轮播</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="rows" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="title" label="标题" min-width="140" />
        <el-table-column label="图片" width="90">
          <template #default="{ row }">
            <el-image v-if="row.imageFileId" :src="row.imageFileId" fit="cover" style="width:60px;height:40px;border-radius:4px" />
            <span v-else class="muted">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="subtitle" label="副标题" min-width="160" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="70" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><StatusTag :status="row.status" /></template>
        </el-table-column>
        <el-table-column label="有效期" width="200">
          <template #default="{ row }">
            {{ formatTime(row.startAt) }} ~ {{ formatTime(row.endAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link :type="row.status === 1 ? 'warning' : 'success'" @click="handleToggle(row)">{{ row.status === 1 ? '禁用' : '启用' }}</el-button>
            <el-popconfirm title="确定删除该轮播吗？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑轮播' : '新增轮播'" width="560px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="120" placeholder="轮播标题" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="form.subtitle" maxlength="255" placeholder="轮播副标题（可选）" />
        </el-form-item>
        <el-form-item label="图片" prop="imageFileId">
          <ImageUpload v-model="form.imageFileId" />
        </el-form-item>
        <el-form-item label="跳转类型">
          <el-select v-model="form.targetType" style="width:180px">
            <el-option label="无跳转" value="NONE" />
            <el-option label="景点详情" value="SCENIC_SPOT" />
            <el-option label="攻略详情" value="GUIDE" />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转目标ID" v-if="form.targetType !== 'NONE'">
          <el-input-number v-model="form.targetId" :min="1" controls-position="right" style="width:180px" placeholder="目标资源ID" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" controls-position="right" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="开始时间">
              <el-date-picker v-model="form.startAt" type="datetime" placeholder="选择开始时间" value-format="YYYY-MM-DDTHH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间">
              <el-date-picker v-model="form.endAt" type="datetime" placeholder="选择结束时间" value-format="YYYY-MM-DDTHH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </AdminLayout>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import AdminLayout from '../../layouts/AdminLayout.vue'
import StatusTag from '../../components/StatusTag.vue'
import ImageUpload from '../../components/ImageUpload.vue'
import { bannerApi } from '../../api'

const rows = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const editingId = ref(null)

const form = reactive({
  title: '',
  subtitle: '',
  imageFileId: null,
  targetType: 'NONE',
  targetId: null,
  sortOrder: 0,
  startAt: '',
  endAt: ''
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  imageFileId: [{ required: true, message: '请上传图片', trigger: 'change' }]
}

function resetForm() {
  form.title = ''
  form.subtitle = ''
  form.imageFileId = null
  form.targetType = 'NONE'
  form.targetId = null
  form.sortOrder = 0
  form.startAt = ''
  form.endAt = ''
  editingId.value = null
  formRef.value?.resetFields()
}

async function load() {
  loading.value = true
  try {
    rows.value = await bannerApi.list()
  } catch (err) {
    if (err.code !== 40101) ElMessage.error(err.message || '加载轮播列表失败')
  } finally { loading.value = false }
}

function openCreate() {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  isEdit.value = true
  editingId.value = row.id
  form.title = row.title
  form.subtitle = row.subtitle || ''
  form.imageFileId = row.imageFileId
  form.targetType = row.targetType || 'NONE'
  form.targetId = row.targetId
  form.sortOrder = row.sortOrder || 0
  form.startAt = row.startAt || ''
  form.endAt = row.endAt || ''
  dialogVisible.value = true
}

async function submit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    const payload = { ...form }
    if (payload.targetType === 'NONE') payload.targetId = null
    if (isEdit.value) {
      await bannerApi.update(editingId.value, payload)
      ElMessage.success('轮播已更新')
    } else {
      await bannerApi.create(payload)
      ElMessage.success('轮播已创建')
    }
    dialogVisible.value = false
    await load()
  } catch (err) {
    ElMessage.error(err.message || '保存失败')
  } finally { saving.value = false }
}

async function handleToggle(row) {
  try {
    await bannerApi.toggle(row.id)
    ElMessage.success(row.status === 1 ? '轮播已禁用' : '轮播已启用')
    load()
  } catch (err) {
    ElMessage.error(err.message || '操作失败')
  }
}

async function handleDelete(id) {
  try { await bannerApi.remove(id); ElMessage.success('轮播已删除'); load() }
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
.muted { color: #94a3b8; }
</style>
