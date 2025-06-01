<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">用户注册</h2>
      <form class="login-form" @submit.prevent="handleRegister">
        <!-- 错误提示 -->
        <div v-if="registerError" class="error-message">
          <i class="icon icon-error"></i>
          {{ registerError }}
        </div>

        <!-- 用户名 -->
        <div class="form-group">
          <label class="input-label">用户名</label>
          <div class="input-wrapper">
            <i class="icon icon-user"></i>
            <input
                v-model="registerForm.username"
                type="text"
                placeholder="4-20位字母数字组合"
                class="form-input"
                required
                pattern="[A-Za-z0-9]{4,20}"
            >
          </div>
        </div>

        <!-- 邮箱 -->
        <div class="form-group">
          <label class="input-label">电子邮箱</label>
          <div class="input-wrapper">
            <i class="icon icon-email"></i>
            <input
                v-model="registerForm.email"
                type="email"
                placeholder="example@domain.com"
                class="form-input"
                required
            >
          </div>
        </div>

        <!-- 密码 -->
        <div class="form-group">
          <label class="input-label">密码</label>
          <div class="input-wrapper">
            <i class="icon icon-lock"></i>
            <input
                v-model="registerForm.password"
                type="password"
                placeholder="至少8位，含字母和数字"
                class="form-input"
                required
                pattern="^(?=.*[A-Za-z])(?=.*\d).{8,}$"
            >
          </div>
        </div>

        <!-- 手机号 -->
        <div class="form-group">
          <label class="input-label">手机号</label>
          <div class="input-wrapper">
            <i class="icon icon-phone"></i>
            <input
                v-model="registerForm.phone"
                type="tel"
                placeholder="11位中国大陆手机号"
                class="form-input"
                required
                pattern="^1[3-9]\d{9}$"
            >
          </div>
        </div>

        <!-- 提交按钮 -->
        <button
            type="submit"
            class="login-btn"
            :disabled="loading"
        >
          <span v-if="!loading">立即注册</span>
          <i v-else class="loading-icon"></i>
        </button>

        <div class="extra-actions">
          <router-link to="/" class="login-link">已有账号？立即登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  phone: '',
  role: '房客'
})

const loading = ref(false)
const registerError = ref('')

const validateForm = () => {
  // 前端验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^1[3-9]\d{9}$/

  if (!emailRegex.test(registerForm.email)) {
    registerError.value = '邮箱格式不正确'
    return false
  }

  if (!phoneRegex.test(registerForm.phone)) {
    registerError.value = '手机号格式不正确'
    return false
  }

  return true
}

const handleRegister = async () => {
  registerError.value = ''
  if (!validateForm()) return

  loading.value = true

  try {
    const response = await request.post('/register', {
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      phone: registerForm.phone
    })

    await router.push({
      path: '/',
      query: {registered: 'success'}
    })
  } catch (error) {
    const message = error.response?.data?.message || '注册失败'
    registerError.value = handleErrorMessage(message)
  } finally {
    loading.value = false
  }
}

const handleErrorMessage = (message) => {
  const errorMap = {
    'email exists': '该邮箱已被注册',
    'username exists': '用户名已被占用',
    'phone exists': '手机号已被使用'
  }
  return errorMap[message] || message
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

<!-- 保持与登录页相同的样式 -->