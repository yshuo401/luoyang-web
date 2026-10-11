import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ScenicView from '../views/ScenicView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/scenic-spots', name: 'scenic-spots', component: ScenicView }
  ]
})

router.beforeEach((to) => {
  const token = localStorage.getItem('luoyang_admin_token')
  if (!to.meta.public && !token) return { name: 'login' }
  if (to.name === 'login' && token) return { name: 'dashboard' }
})

export default router
