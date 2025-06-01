// import { createApp } from 'vue'
// import router from './router.js'
// import PrimeVue from 'primevue/config'
// // 这里引入Element Plus
//
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
//
// import App from './App.vue'
// import Register from './Register.vue'
//
//
//
// // 其他引入
// import VueAxios from 'vue-axios'
// import axios from 'axios'
//
// // 创建应用
// const app = createApp(App)
// const register=createApp(Register)
//
// // 使用Element Plus
// app.use(ElementPlus)
// //
// // // 使用PrimeVue（如果还要用的话）
// // app.use(PrimeVue, {
// //     theme: {
// //         preset: Aura
// //     },
// //     ripple: true
// // })
//
// // 使用路由和axios
// app.use(router)
// app.use(VueAxios, axios)
//
// // 挂载
// app.mount('#app')
import { createApp } from 'vue'
import router from './router.js' // 确保路径正确
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue' // 根组件

// 创建单一应用实例
const app = createApp(App)

// 使用插件
app.use(ElementPlus)
app.use(router)

// 挂载到 #app
app.mount('#app')
