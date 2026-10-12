<!-- 美食新增/编辑页 -->
<template>
  <AdminLayout>
    <el-page-header :content="isEdit ? '编辑美食' : '新增美食'" @back="$router.push('/foods')" />

    <el-card class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" style="max-width:900px">
        <el-divider content-position="left">基本信息</el-divider>

        <el-form-item label="美食名称" prop="name">
          <el-input v-model="form.name" maxlength="120" placeholder="请输入美食名称" />
        </el-form-item>

        <el-form-item label="简短描述">
          <el-input v-model="form.shortDescription" type="textarea" :rows="2" maxlength="500" show-word-limit placeholder="用于列表卡片展示" />
        </el-form-item>

        <el-form-item label="详细地址">
          <el-input v-model="form.address" maxlength="255" placeholder="如：洛阳市老城区十字街" />
        </el-form-item>

        <el-form-item label="人均消费">
          <el-input v-model="form.avgPrice" maxlength="60" placeholder="如：30-50 元" style="width:240px" />
        </el-form-item>

        <el-form-item label="营业时间">
          <el-input v-model="form.openingHours" maxlength="255" placeholder="如：10:00-22:00" />
        </el-form-item>

        <el-form-item label="联系电话">
          <el-input v-model="form.phone" maxlength="40" />
        </el-form-item>

        <el-divider content-position="left">详细介绍</el-divider>

        <el-form-item label="美食介绍">
          <el-input v-model="form.description" type="textarea" :rows="5" maxlength="5000" show-word-limit placeholder="美食详细介绍" />
        </el-form-item>

        <el-divider content-position="left">展示设置</el-divider>

        <el-form-item label="封面图片">
          <ImageUpload v-model="form.coverFileId" />
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" controls-position="right" />
        </el-form-item>

        <el-form-item>
          <el-button @click="$router.push('/foods')">取消</el-button>
          <el-button type="primary" :loading="saving" @click="submit">保存</el-button>
          <el-button v-if="isEdit" type="success" :loading="saving" @click="submitAndPublish">保存并发布</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </AdminLayout>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AdminLayout from '../../layouts/AdminLayout.vue'
import ImageUpload from '../../components/ImageUpload.vue'
import { foodApi } from '../../api'

const route = useRoute()
const router = useRouter()
const isEdit = ref(Boolean(route.params.id))
const editingId = ref(route.params.id || null)
const formRef = ref(null)
const saving = ref(false)

const form = reactive({
  name: '',
  shortDescription: '',
  address: '',
  avgPrice: '',
  openingHours: '',
  phone: '',
  description: '',
  coverFileId: null,
  sortOrder: 0
})

const rules = {
  name: [{ required: true, message: '请输入美食名称', trigger: 'blur' }]
}

async function loadDetail() {
  if (!isEdit.value || !editingId.value) return
  try {
    const data = await foodApi.detail(editingId.value)
    Object.keys(form).forEach(key => {
      if (data[key] !== undefined) form[key] = data[key]
    })
  } catch (err) {
    ElMessage.error(err.message || '加载美食详情失败')
    router.push('/foods')
  }
}

async function submit(publishAfter) {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    const payload = { ...form }
    if (isEdit.value) {
      await foodApi.update(editingId.value, payload)
      ElMessage.success('美食已更新')
      if (publishAfter) { await foodApi.publish(editingId.value); ElMessage.success('美食已发布') }
    } else {
      await foodApi.create(payload)
      ElMessage.success('美食已创建')
    }
    router.push('/foods')
  } catch (err) {
    ElMessage.error(err.message || '保存失败')
  } finally { saving.value = false }
}

function submitAndPublish() { submit(true) }

onMounted(loadDetail)
</script>

<style scoped>
.form-card { margin-top: 20px; }
</style>
