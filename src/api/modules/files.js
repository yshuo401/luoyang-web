// 文件上传 API — 服务端代理上传到 OSS

import http from '../http'

export const fileApi = {
  // 上传文件（表单 multipart/form-data）
  upload: (formData) =>
    http.post('/admin/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // 获取签名访问 URL（私有桶文件）
  signedUrl: (fileId) => http.get('/admin/files/' + fileId + '/signed-url')
}
