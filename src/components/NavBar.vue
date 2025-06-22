<template>
  <div class="navbar-container">
    <div class="navbar">
      <!-- Logo部分 -->
      <div class="logo">
        <i class="fas fa-home logo-icon"></i>
        PC租房
      </div>

      <!-- 导航链接 -->
      <div class="nav-links">
        <a
            v-for="link in links"
            :key="link.name"
            :href="link.url"
            :class="{ active: activeLink === link.name }"
        >
          {{ link.name }}
        </a>
      </div>

      <!-- 用户操作区 -->
      <div class="user-actions">
        <!-- 登录后显示头像和用户名 -->
        <template v-if="isLoggedIn">
          <div class="avatar-container" title="点击头像">
            <img
                v-if="tenant.avatar"
                :src="tenant.avatar"
                alt="用户头像"
                class="avatar"
            />
            <div v-else class="avatar-placeholder"></div>
          </div>
          <span class="username">{{ username }}</span>
          <el-button type="primary" size="small" @click="goToBecomeHost">成为房东</el-button>
        </template>
        <!-- 未登录显示"去登录"按钮 -->
        <template v-else>
          <el-button type="primary" size="small" @click="goToLogin">去登录</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { ElButton } from 'element-plus'
import request from "@/utils/request.js"

export default {
  components: {
    ElButton
  },
  data() {
    return {
      links: [
        { name: '个人主页', url: 'user.html' },
        { name: '我的租房', url: 'myrental.html' },
        { name:'主界面', url: 'home.html' },
        { name: 'PC社区', url: 'community.html' },
        { name: 'PC私聊', url: 'chat.html' },
        { name: 'PC客服', url: 'customer_service.html' }
      ],
      activeLink: '', // 可以在mounted中设置
      isLoggedIn: false,
      username: '',
      tenant: reactive({
        id: '1D2E',
        avatar: ''
      }),
      defaultAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
  },
  created() {
    // 在创建阶段同步检测登录状态
    this.checkLoginStatus()
  },
  mounted() {
    // 只有登录状态下才加载头像
    if (this.isLoggedIn) {
      this.loadAvatar()
    }
    // 设置activeLink示例（可以根据实际路由或逻辑设置）
    this.activeLink = '个人主页'
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const token = localStorage.getItem('jwt_token')
      if (token) {
        this.isLoggedIn = true
        this.username = localStorage.getItem('username') || '用户 刘润程'
      } else {
        this.isLoggedIn = false
        this.username = ''
      }
    },

    // 跳转登录页面
    goToLogin() {
      window.location.href = 'login.html'
    },

    // 跳转成为房东页面（示例）
    goToBecomeHost() {
      alert('跳转成为房东页面（示例）')
      // window.location.href = 'become_host.html'
    },

    // 加载头像
    async loadAvatar() {
      if (!this.isLoggedIn) {
        // 确保未登录时不设置任何头像
        return
      }
      try {
        const timestamp = Date.now()
        const response = await request.get(
            `/auth/getavatar/${this.tenant.id}?t=${timestamp}`,
            {
              responseType: 'arraybuffer',
              timeout: 10000
            }
        )
        let imageData
        if (response && response.data) {
          // axios响应格式
          imageData = response.data
        } else {
          // 直接是二进制
          imageData = response
        }
        if (!imageData || !(imageData instanceof ArrayBuffer)) {
          throw new Error('收到无效的响应数据')
        }
        this.handleAvatarData(imageData)
      } catch (error) {
        console.error('加载头像失败:', error)
        this.tenant.avatar = this.defaultAvatar
      }
    },

    // 解析头像数据
    handleAvatarData(arrayBuffer) {
      const detectedType = this.detectContentType(arrayBuffer)
      if (detectedType.startsWith('image/')) {
        const blob = new Blob([arrayBuffer], { type: detectedType })
        this.displayImageBlob(blob)
        return
      }
      try {
        const decoder = new TextDecoder('utf-8')
        const textResponse = decoder.decode(
            new Uint8Array(arrayBuffer, 0, Math.min(arrayBuffer.byteLength, 1024))
        )
        if (textResponse.includes('{') && textResponse.includes('}')) {
          const errorJson = JSON.parse(textResponse)
          throw new Error(errorJson.message || '服务器返回错误')
        } else if (textResponse.includes('<html>') || textResponse.includes('<body>')) {
          throw new Error('收到HTML响应，可能是服务器错误')
        } else if (textResponse.length > 0) {
          throw new Error(`服务器返回信息: ${textResponse.substring(0, 100)}`)
        } else {
          throw new Error('收到空响应')
        }
      } catch (parseError) {
        console.warn('解析错误信息失败:', parseError)
        throw new Error('无法显示头像，请检查服务器配置')
      }
    },

    // 显示头像Blob
    displayImageBlob(blob) {
      const reader = new FileReader()
      reader.onload = () => {
        this.tenant.avatar = reader.result
      }
      reader.onerror = (e) => {
        console.error('创建头像URL失败:', e)
        this.tenant.avatar = this.defaultAvatar
      }
      reader.readAsDataURL(blob)
    },

    // 识别内容类型
    detectContentType(arrayBuffer) {
      const header = new Uint8Array(arrayBuffer.slice(0, 12))
      if (header[0] === 0xff && header[1] === 0xd8) return 'image/jpeg'
      if (
          header[0] === 0x89 &&
          String.fromCharCode(...header.subarray(1, 4)) === 'PNG'
      )
        return 'image/png'
      if (
          String.fromCharCode(...header.subarray(0, 6)) === 'GIF87a' ||
          String.fromCharCode(...header.subarray(0, 6)) === 'GIF89a'
      )
        return 'image/gif'
      if (
          String.fromCharCode(...header.subarray(0, 4)) === 'RIFF' &&
          String.fromCharCode(...header.subarray(8, 12)) === 'WEBP'
      )
        return 'image/webp'
      return 'application/octet-stream'
    }
  }
}
</script>

<style scoped>
.navbar-container {
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: #409eff;
}

.logo-icon {
  font-size: 30px;
  margin-right: 8px;
  color: #67c23a;
}

.nav-links {
  display: flex;
  gap: 35px;
}

.nav-links a {
  text-decoration: none;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  color: #409eff;
}

.user-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.avatar-container {
  margin-right: 10px;
  cursor: pointer;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ecf0f1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.username {
  font-weight: bold;
  font-size: 14px;
  margin-right: 10px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .nav-links {
    gap: 20px;
  }
}
</style>