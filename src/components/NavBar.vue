<script setup>
import { ref } from 'vue'
import { ElButton } from 'element-plus'

const activeLink = ref('首页')
</script>

<template>
  <div class="navbar-container">
    <div class="navbar">
      <div class="logo">
        <i class="fas fa-home logo-icon"></i>
        PC租房
      </div>
      <div class="nav-links">
        <a
            v-for="link in ['个人主页', '我的租房', 'PC客服']"
            :key="link"
            href="#"
            :class="{ active: activeLink === link }"
            @click.prevent="activeLink = link"
        >
          {{ link }}
        </a>
      </div>
      <div class="user-actions">
        <ElButton type="info" plain size="small">登录</ElButton>
        <ElButton type="primary" size="small">成为房东</ElButton>
      </div>
    </div>
  </div>
</template>

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

@media (max-width: 992px) {
  .nav-links {
    gap: 20px;
  }
}
</style>