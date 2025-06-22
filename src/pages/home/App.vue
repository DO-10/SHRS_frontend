
<script setup>
import NavBar from '@/components/NavBar.vue'
import Searchsession from '@/components/Searchsession.vue'
import FeaturedProperties from './components/FeaturedProperties.vue'
</script>

<template>
  <div id="app">
    <NavBar />
    <Searchsession />
    <FeaturedProperties />

    <div class="footer">
      <div class="footer-links">
        <a href="#">关于我们</a>
        <a href="#">用户协议</a>
        <a href="#">隐私政策</a>
        <a href="#">帮助中心</a>
        <a href="#">联系方式</a>
      </div>
      <div class="copyright">© 2023 PC租房 All Rights Reserved</div>
    </div>
  </div>
</template>

<style>
#app {
  max-width: 1600px;
  margin: 0 auto;
}

.footer {
  background: #304156;
  color: rgba(255, 255, 255, 0.7);
  padding: 40px 0;
  text-align: center;
  font-size: 14px;
  margin-top: 40px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-bottom: 20px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

.copyright {
  margin-top: 10px;
}
</style>