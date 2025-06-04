import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue' // 根组件

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(ElementPlus)

// 挂载应用
app.mount('#app')