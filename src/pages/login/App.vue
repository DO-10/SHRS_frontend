<!--<template>-->
<!--  <div>-->
<!--    <h2>用户登录</h2>-->
<!--    <form @submit.prevent="handleLogin">-->
<!--      <div>-->
<!--        <label>邮箱</label>-->
<!--        <input v-model="loginForm.username" type="text" required>-->
<!--      </div>-->
<!--      <div>-->
<!--        <label>密码</label>-->
<!--        <input v-model="loginForm.password" type="password" required>-->
<!--      </div>-->
<!--      <div>-->
<!--        <label>选择身份</label>-->
<!--        <select v-model="loginForm.role" required>-->
<!--          <option value="">请选择类型</option>-->
<!--          <option value="student">房客</option>-->
<!--          <option value="teacher">房东</option>-->
<!--          <option value="admin">管理员</option>-->
<!--        </select>-->
<!--      </div>-->
<!--      <button @click="register">注册</button>-->
<!--    </form>-->
<!--    <button @click="register">注册</button>-->
<!--  </div>-->
<!--</template>-->
<template>
  <router-view></router-view>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">欢迎登录</h2>
      <form class="login-form" @submit.prevent="handleLogin">
        <!-- 错误提示 -->
        <div v-if="loginError" class="error-message">
          <i class="icon icon-error"></i>
          {{ loginError }}
        </div>

        <!-- 表单内容 -->
        <div class="form-group">
          <label class="input-label">邮箱</label>
          <div class="input-wrapper">
            <i class="icon icon-user"></i>
            <input
                v-model="loginForm.username"
                type="email"
                placeholder="请输入邮箱"
                class="form-input"
                required
            >
          </div>
        </div>

        <div class="form-group">
          <label class="input-label">密码</label>
          <div class="input-wrapper">
            <i class="icon icon-lock"></i>
            <input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                class="form-input"
                required
            >
          </div>
        </div>

        <div class="form-group">
          <label class="input-label">身份选择</label>
          <div class="input-wrapper">
            <i class="icon icon-role"></i>
            <select
                v-model="loginForm.role"
                class="form-select"
                required
            >
              <option value="">请选择身份</option>
              <option value="tenant">房客</option>
              <option value="landlord">房东</option>
              <option value="admin">管理员</option>
            </select>
          </div>
        </div>

        <button
            type="submit"
            class="login-btn"
            :disabled="loading"
        >
          <span v-if="!loading">立即登录</span>
          <i v-else class="loading-icon"></i>
        </button>

        <div class="extra-actions">
          <span @click="register" class="register-link">没有账号？立即注册</span>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import router from "@/pages/login/router.js";


import {reactive, ref} from "vue";
import axios from 'axios'
import request from "@/utils/request.js"
const loginForm = reactive({
  role: 'tenant',  // 新增的下拉框绑定值
  username: '',
  password: ''
})
const loading = ref(false)
const loginError = ref('')
const register = () => {
  router.push("/register");
}
const handleLogin = async () => {
  loginError.value = ''
  loading.value = true
  try {
    // 明确设置请求头为 JSON 格式
    const response = await request.post('/auth/login',
        loginForm,  // 直接传递对象
        {
          headers: {
            'Content-Type': 'application/json' // 明确指定 JSON 格式
          }
        }
    );

    // 从响应中提取 token（根据后端响应结构）
    const token = response.access_token || response.token

    // 存储到 localStorage
    if (token) {
      localStorage.setItem('jwt_token', token)
    } else {
      console.warn("未在响应中找到 token")
    }

    // 登录成功后的操作（如跳转页面）
    // router.push('/dashboard')

  } catch (error) {
    // 更详细的错误处理
    console.error("完整登录错误:", error)

    if (error.response) {
      // 服务器返回了响应
      console.error("状态码:", error.response.status)
      console.error("响应数据:", error.response.data)

      // 根据后端错误结构获取消息
      loginError.value = error.response.data?.message ||
          error.response.data?.error ||
          `服务器错误 (${error.response.status})`
    } else if (error.request) {
      // 请求已发出但无响应
      loginError.value = "服务器无响应，请检查网络"
    } else {
      // 其他错误
      loginError.value = error.message || "请求配置错误"
    }
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
/* 基础重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 容器样式 */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

/* 卡片样式 */
.login-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

/* 标题样式 */
.login-title {
  text-align: center;
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 40px;
  font-weight: 600;
  position: relative;
}

.login-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #3498db;
  border-radius: 2px;
}

/* 表单组样式 */
.form-group {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

/* 输入框容器 */
.input-wrapper {
  position: relative;
}

/* 图标样式 */
.icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
}

.icon-role::before { content: '\e905'; }
.icon-user::before { content: '\e971'; }
.icon-lock::before { content: '\e98d'; }

/* 输入框样式 */
.form-input,
.form-select {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  outline: none;
}

/* 下拉框特殊样式 */
.form-select {
  appearance: none;
  background: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")
  no-repeat right 16px center/16px;
}

/* 登录按钮样式 */
.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 加载动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

/* 注册链接 */
.extra-actions {
  text-align: center;
  margin-top: 24px;
}

.register-link {
  color: #3498db;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* 错误提示 */
.error-message {
  color: #e74c3c;
  background: #fdeded;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-error::before {
  content: '⚠️';
  font-size: 18px;
}
</style>