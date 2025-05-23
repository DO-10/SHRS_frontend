import { createRouter, createWebHistory } from 'vue-router'
import Login from './App.vue'  // 登录组件路径

const routes = [
    { path: '/', component: Login }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
