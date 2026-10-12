<!-- 攻略新增/编辑页 — 包含每日行程管理 -->
<template>
  <AdminLayout>
    <el-page-header :content="isEdit ? '编辑攻略' : '新增攻略'" @back="$router.push('/guides')" />

    <el-card class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" style="max-width:900px">
        <el-divider content-position="left">基本信息</el-divider>

        <el-form-item label="攻略标题" prop="title">
          <el-input v-model="form.title" maxlength="150" placeholder="请输入攻略标题" />
        </el-form-item>

        <el-form-item label="简短描述">
          <el-input v-model="form.shortDescription" type="textarea" :rows="2" maxlength="500" show-word-limit placeholder="用于列表卡片展示" />
        </el-form-item>

        <el-form-item label="封面图片">
          <ImageUpload v-model="form.coverFileId" />
        </el-form-item>

        <el-form-item label="建议游玩天数">
          <el-input-number v-model="form.suggestedDays" :min="1" :max="10" controls-position="right" style="width:150px" />
          <span class="unit">天</span>
        </el-form-item>

        <el-divider content-position="left">
          <span>每日行程安排</span>
          <el-button size="small" style="margin-left:12px" @click="addDay">+ 添加一天</el-button>
        </el-divider>

        <div v-if="form.days.length === 0" class="empty-hint">暂无行程安排，请点击"添加一天"开始编排</div>

        <el-card v-for="(day, di) in form.days" :key="di" class="day-card" shadow="hover">
          <template #header>
            <div class="day-header">
              <span class="day-title">第 {{ day.dayNumber || (di + 1) }} 天</span>
              <div>
                <el-button size="small" @click="addSpot(di)">+ 添加景点</el-button>
                <el-button size="small" type="danger" @click="removeDay(di)">删除当日</el-button>
              </div>
            </div>
          </template>

          <el-form-item label="当日标题" style="margin-bottom:12px">
            <el-input v-model="day.title" placeholder="如：龙门石窟一日游" />
          </el-form-item>

          <el-form-item label="当日描述">
            <el-input v-model="day.description" type="textarea" :rows="2" placeholder="当日的行程描述" />
          </el-form-item>

          <el-table :data="day.spots" size="small" class="spot-table">
            <el-table-column label="序号" width="60">
              <template #default="{ $index }">{{ $index + 1 }}</template>
            </el-table-column>
            <el-table-column label="景点 ID" width="100">
              <template #default="{ row: spot }">
                <el-input-number v-model="spot.scenicSpotId" :min="1" size="small" controls-position="right" style="width:90px" />
              </template>
            </el-table-column>
            <el-table-column label="景点名称（提示）" min-width="160">
              <template #default="{ row: spot }">{{ spot.scenicSpotName || '（输入景点ID后自动显示）' }}</template>
            </el-table-column>
            <el-table-column label="时段建议" min-width="160">
              <template #default="{ row: spot }">
                <el-input v-model="spot.timeSuggestion" size="small" placeholder="如：上午 8:00-11:00" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template #default="{ $index }">
                <el-button link type="danger" size="small" @click="removeSpot(di, $index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-divider content-position="left">展示设置</el-divider>

        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" controls-position="right" />
        </el-form-item>

        <el-form-item style="margin-top:24px">
          <el-button @click="$router.push('/guides')">取消</el-button>
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
import { guideApi } from '../../api'

const route = useRoute()
const router = useRouter()
const isEdit = ref(Boolean(route.params.id))
const editingId = ref(route.params.id || null)
const formRef = ref(null)
const saving = ref(false)

const form = reactive({
  title: '',
  shortDescription: '',
  coverFileId: null,
  suggestedDays: 1,
  sortOrder: 0,
  days: []
})

const rules = {
  title: [{ required: true, message: '请输入攻略标题', trigger: 'blur' }]
}

function createEmptyDay(dayNum) {
  return {
    dayNumber: dayNum,
    title: '',
    description: '',
    spots: []
  }
}

function addDay() {
  form.days.push(createEmptyDay(form.days.length + 1))
}

function removeDay(index) {
  form.days.splice(index, 1)
  form.days.forEach((d, i) => { d.dayNumber = i + 1 })
}

function addSpot(dayIndex) {
  form.days[dayIndex].spots.push({
    scenicSpotId: null,
    scenicSpotName: '',
    timeSuggestion: ''
  })
}

function removeSpot(dayIndex, spotIndex) {
  form.days[dayIndex].spots.splice(spotIndex, 1)
}

async function loadDetail() {
  if (!isEdit.value || !editingId.value) return
  try {
    const data = await guideApi.detail(editingId.value)
    form.title = data.title || ''
    form.shortDescription = data.shortDescription || ''
    form.coverFileId = data.coverFileId || null
    form.suggestedDays = data.suggestedDays || 1
    form.sortOrder = data.sortOrder || 0
    form.days = (data.days || []).map(day => ({
      dayNumber: day.dayNumber,
      title: day.title || '',
      description: day.description || '',
      spots: (day.spots || []).map(spot => ({
        scenicSpotId: spot.scenicSpotId,
        scenicSpotName: spot.scenicSpotName || '',
        timeSuggestion: spot.timeSuggestion || ''
      }))
    }))
  } catch (err) {
    ElMessage.error(err.message || '加载攻略详情失败')
    router.push('/guides')
  }
}

async function submit(publishAfter) {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    const payload = {
      title: form.title,
      shortDescription: form.shortDescription,
      coverFileId: form.coverFileId,
      suggestedDays: form.suggestedDays,
      sortOrder: form.sortOrder,
      days: form.days.map(d => ({
        dayNumber: d.dayNumber,
        title: d.title,
        description: d.description,
        spots: d.spots.map(s => ({
          scenicSpotId: s.scenicSpotId,
          timeSuggestion: s.timeSuggestion
        }))
      }))
    }

    if (isEdit.value) {
      await guideApi.update(editingId.value, payload)
      ElMessage.success('攻略已更新')
      if (publishAfter) {
        await guideApi.publish(editingId.value)
        ElMessage.success('攻略已发布')
      }
    } else {
      await guideApi.create(payload)
      ElMessage.success('攻略已创建')
    }
    router.push('/guides')
  } catch (err) {
    ElMessage.error(err.message || '保存失败')
  } finally {
    saving.value = false
  }
}

function submitAndPublish() { submit(true) }

onMounted(loadDetail)
</script>

<style scoped>
.form-card { margin-top: 20px; }
.unit { margin-left: 8px; color: #94a3b8; font-size: 13px; }
.empty-hint { text-align: center; color: #94a3b8; padding: 24px 0; }
.day-card { margin-bottom: 16px; }
.day-header { display: flex; justify-content: space-between; align-items: center; }
.day-title { font-weight: 600; font-size: 15px; }
.spot-table { margin-top: 12px; }
</style>
