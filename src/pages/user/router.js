import { createRouter, createWebHistory } from 'vue-router'

// 您的路由定义
const routes = [
    // 您的路由配置
    {
        path: '/',
        component: () => import('./App.vue')
    },

]

// 创建路由器实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
