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
import MyRent from './App.vue'


const routes = [
    {
        path: '/',
        goto: '/myrent',
    },
    {
        path: '/myrent',
        component: MyRent,
        name: 'MyRent',
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router