<!-- 景点新增/编辑页 -->
<template>
  <AdminLayout>
    <el-page-header :content="isEdit ? '编辑景点' : '新增景点'" @back="$router.push('/scenic-spots')" />

    <el-card class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" style="max-width:900px">
        <el-divider content-position="left">基本信息</el-divider>

        <el-form-item label="景点名称" prop="name">
          <el-input v-model="form.name" maxlength="120" placeholder="请输入景点名称" />
        </el-form-item>

        <el-form-item label="所属分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width:240px">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="简短描述" prop="shortDescription">
          <el-input v-model="form.shortDescription" type="textarea" :rows="2" maxlength="500" show-word-limit placeholder="用于列表卡片展示" />
        </el-form-item>

        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" maxlength="255" placeholder="如：河南省洛阳市洛龙区龙门中街13号" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="经度">
              <el-input-number v-model="form.longitude" :precision="6" :min="-180" :max="180" controls-position="right" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度">
              <el-input-number v-model="form.latitude" :precision="6" :min="-90" :max="90" controls-position="right" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="营业时间">
          <el-input v-model="form.openingHours" maxlength="255" placeholder="如：08:00-17:30（旺季）" />
        </el-form-item>

        <el-form-item label="门票信息">
          <el-input v-model="form.ticketInfo" maxlength="255" placeholder="如：全价票 90 元/人" />
        </el-form-item>

        <el-form-item label="联系电话">
          <el-input v-model="form.phone" maxlength="40" placeholder="如：0379-65980972" />
        </el-form-item>

        <el-form-item label="建议游览时长">
          <el-input-number v-model="form.suggestedVisitMinutes" :min="0" :step="30" controls-position="right" style="width:180px" />
          <span class="unit">分钟</span>
        </el-form-item>

        <el-divider content-position="left">详细介绍</el-divider>

        <el-form-item label="景点介绍">
          <el-input v-model="form.description" type="textarea" :rows="5" maxlength="5000" show-word-limit placeholder="景点详细介绍（支持多行文本）" />
        </el-form-item>

        <el-form-item label="历史文化">
          <el-input v-model="form.historyIntro" type="textarea" :rows="4" maxlength="5000" show-word-limit placeholder="景点历史文化背景介绍" />
        </el-form-item>

        <el-divider content-position="left">展示设置</el-divider>

        <el-form-item label="封面图片">
          <ImageUpload v-model="form.coverFileId" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="form.sortOrder" :min="0" :max="9999" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首页推荐">
              <el-switch v-model="form.isRecommended" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button @click="$router.push('/scenic-spots')">取消</el-button>
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
import { scenicSpotApi, categoryApi } from '../../api'

const route = useRoute()
const router = useRouter()
const isEdit = ref(Boolean(route.params.id))
const editingId = ref(route.params.id || null)
const formRef = ref(null)
const saving = ref(false)
const categories = ref([])

const form = reactive({
  name: '',
  categoryId: null,
  shortDescription: '',
  address: '',
  longitude: null,
  latitude: null,
  openingHours: '',
  ticketInfo: '',
  phone: '',
  suggestedVisitMinutes: null,
  description: '',
  historyIntro: '',
  coverFileId: null,
  sortOrder: 0,
  isRecommended: 0
})

const rules = {
  name: [{ required: true, message: '请输入景点名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

async function loadCategories() {
  try { categories.value = await categoryApi.list() } catch { /* ignore */ }
}

async function loadDetail() {
  if (!isEdit.value || !editingId.value) return
  try {
    const data = await scenicSpotApi.detail(editingId.value)
    Object.keys(form).forEach(key => {
      if (data[key] !== undefined) form[key] = data[key]
    })
  } catch (err) {
    ElMessage.error(err.message || '加载景点详情失败')
    router.push('/scenic-spots')
  }
}

async function submit(publishAfter) {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    const payload = { ...form }
    if (isEdit.value) {
      await scenicSpotApi.update(editingId.value, payload)
      ElMessage.success('景点已更新')
    } else {
      await scenicSpotApi.create(payload)
      ElMessage.success('景点已创建')
    }
    if (publishAfter && isEdit.value) {
      await scenicSpotApi.publish(editingId.value)
      ElMessage.success('景点已发布')
    }
    router.push('/scenic-spots')
  } catch (err) {
    ElMessage.error(err.message || '保存失败')
  } finally {
    saving.value = false
  }
}

function submitAndPublish() {
  submit(true)
}

onMounted(() => {
  loadCategories()
  loadDetail()
})
</script>

<style scoped>
.form-card { margin-top: 20px; }
.unit { margin-left: 8px; color: #94a3b8; font-size: 13px; }
</style>
