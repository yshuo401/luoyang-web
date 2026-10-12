<!-- 内容状态标签：DRAFT / PUBLISHED / OFFLINE -->
<template>
  <el-tag :type="tagType" size="small">{{ label }}</el-tag>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 支持字符串状态 DRAFT/PUBLISHED/OFFLINE 或数字状态 1/0
  status: { type: [String, Number], default: 'DRAFT' }
})

const STATUS_MAP = {
  'DRAFT':    { label: '草稿', type: 'info' },
  'PUBLISHED':{ label: '已发布', type: 'success' },
  'OFFLINE':  { label: '已下架', type: 'warning' },
  '1':        { label: '启用', type: 'success' },
  '0':        { label: '禁用', type: 'info' },
  'ACTIVE':   { label: '正常', type: 'success' }
}

const tagType = computed(() => (STATUS_MAP[props.status] || STATUS_MAP['DRAFT']).type)
const label = computed(() => (STATUS_MAP[props.status] || STATUS_MAP['DRAFT']).label)
</script>
