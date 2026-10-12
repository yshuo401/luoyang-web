<!-- 图片上传组件 — 通过服务端代理上传到 OSS -->
<template>
  <div class="image-upload">
    <div v-if="modelValue" class="preview-box">
      <el-image :src="previewUrl" fit="cover" class="preview-img" />
      <div class="preview-actions">
        <el-button size="small" type="danger" @click="handleRemove">移除</el-button>
      </div>
    </div>
    <el-upload
      v-else
      :http-request="customUpload"
      :show-file-list="false"
      :accept="accept"
      :before-upload="beforeUpload"
      drag
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">拖拽或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">{{ tip }}</div>
      </template>
    </el-upload>
    <div v-if="uploading" class="upload-progress">
      <el-progress :percentage="100" :indeterminate="true" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { fileApi } from '../api'

const props = defineProps({
  modelValue: { type: [Number, String, Object], default: null },
  accept: { type: String, default: 'image/png,image/jpeg,image/webp,image/gif' },
  maxSizeMb: { type: Number, default: 5 },
  tip: { type: String, default: '支持 PNG / JPEG / WebP，单张不超过 5MB' }
})

const emit = defineEmits(['update:modelValue'])
const uploading = ref(false)

// 如果 modelValue 是 fileId（数字），则通过接口获取签名 URL 预览
const previewUrl = computed(() => {
  const val = props.modelValue
  if (!val) return ''
  if (typeof val === 'string') return val
  // 如果是对象，取 url 字段
  if (typeof val === 'object' && val.url) return val.url
  return ''
})

function beforeUpload(file) {
  const isImage = file.type.startsWith('image/')
  const isUnderLimit = file.size / 1024 / 1024 <= props.maxSizeMb
  if (!isImage) { ElMessage.error('只允许上传图片文件'); return false }
  if (!isUnderLimit) { ElMessage.error('文件大小不能超过 ' + props.maxSizeMb + 'MB'); return false }
  return true
}

async function customUpload({ file }) {
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const result = await fileApi.upload(formData)
    // 后端返回 { id, url } — fileId 用于存储，url 为签名访问地址
    emit('update:modelValue', result.id || result.fileId || result)
    ElMessage.success('上传成功')
  } catch (err) {
    ElMessage.error(err.message || '上传失败')
  } finally {
    uploading.value = false
  }
}

function handleRemove() {
  emit('update:modelValue', null)
}
</script>

<style scoped>
.image-upload { width: 100%; }
.preview-box { position: relative; width: 220px; border-radius: 6px; overflow: hidden; border: 1px solid #e5e7eb; }
.preview-img { width: 100%; height: 160px; display: block; }
.preview-actions { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,.45); display: flex; justify-content: center; padding: 6px; }
.upload-progress { margin-top: 10px; }
</style>
