# luoyang-web

洛阳旅游信息管理与智能问答系统的 Vue 3 管理端，严格使用 JavaScript（不含 TypeScript）。

## 技术栈

Vue 3、Vite、Element Plus、Vue Router、Pinia、Axios。

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址为 `http://localhost:5173`。`/api` 在开发环境代理到 `http://localhost:8080`；可复制 `.env.example` 为 `.env.local` 修改 `VITE_API_BASE_URL`。

当前骨架包含管理员登录、工作台和景点查询占位页，登录接口预期为 `POST /api/v1/admin/auth/login`，后续按 API 规范接入真实 CRUD。
