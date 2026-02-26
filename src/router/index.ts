import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/ProductsView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    // 后台管理
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      children: [
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/views/admin/CategoryManage.vue')
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/views/admin/ProductManage.vue')
        }
      ]
    }
  ]
})

export default router
