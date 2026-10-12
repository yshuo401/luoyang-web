// 路由配置
// 所有管理端页面默认需要登录；public meta 标记公开页面

import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import CategoryIndex from '../views/category/CategoryIndex.vue'
import ScenicIndex from '../views/scenic/ScenicIndex.vue'
import ScenicEdit from '../views/scenic/ScenicEdit.vue'
import GuideIndex from '../views/guide/GuideIndex.vue'
import GuideEdit from '../views/guide/GuideEdit.vue'
import FoodIndex from '../views/food/FoodIndex.vue'
import FoodEdit from '../views/food/FoodEdit.vue'
import BannerIndex from '../views/banner/BannerIndex.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true, title: '登录' }
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { title: '工作台' }
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoryIndex,
      meta: { title: '景点分类' }
    },
    {
      path: '/scenic-spots',
      name: 'scenic-spots',
      component: ScenicIndex,
      meta: { title: '景点管理' }
    },
    {
      path: '/scenic-spots/create',
      name: 'scenic-create',
      component: ScenicEdit,
      meta: { title: '新增景点' }
    },
    {
      path: '/scenic-spots/:id/edit',
      name: 'scenic-edit',
      component: ScenicEdit,
      meta: { title: '编辑景点' }
    },
    {
      path: '/guides',
      name: 'guides',
      component: GuideIndex,
      meta: { title: '攻略管理' }
    },
    {
      path: '/guides/create',
      name: 'guide-create',
      component: GuideEdit,
      meta: { title: '新增攻略' }
    },
    {
      path: '/guides/:id/edit',
      name: 'guide-edit',
      component: GuideEdit,
      meta: { title: '编辑攻略' }
    },
    {
      path: '/foods',
      name: 'foods',
      component: FoodIndex,
      meta: { title: '美食管理' }
    },
    {
      path: '/foods/create',
      name: 'food-create',
      component: FoodEdit,
      meta: { title: '新增美食' }
    },
    {
      path: '/foods/:id/edit',
      name: 'food-edit',
      component: FoodEdit,
      meta: { title: '编辑美食' }
    },
    {
      path: '/banners',
      name: 'banners',
      component: BannerIndex,
      meta: { title: '首页轮播' }
    }
  ]
})

// 路由守卫：未登录跳转登录页
router.beforeEach((to) => {
  const token = localStorage.getItem('luoyang_admin_token')
  if (!to.meta.public && !token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && token) {
    return { name: 'dashboard' }
  }
})

export default router
