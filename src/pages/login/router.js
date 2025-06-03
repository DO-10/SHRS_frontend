// import { createRouter, createWebHistory } from 'vue-router'
// import Login from './App.vue'  // 登录组件路径
// import Register from './register.vue'
//
// const routes = [
//     { path: '/', component: Login },
//     { path: '/register', component: Register }
// ]
//
// const router = createRouter({
//     history: createWebHistory(),
//     routes
// })
//
// export default router
import { createRouter, createWebHistory } from 'vue-router'
import Login from './App.vue'  // 登录组件
import Register from './Register.vue' // 注册组件

const routes = [
    {
        path: '/',
        component: Login,
        name: 'Login'
    },
    {
        path: '/register',
        component: Register,
        name: 'Register'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
