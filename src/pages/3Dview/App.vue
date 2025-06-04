<template>
  <div class="virtual-tour-container">
    <div class="container">
      <header>
        <h1>全景3D看房体验</h1>
        <p>使用最新Web技术打造的沉浸式房屋体验，360°自由查看每个房间的细节</p>
      </header>

      <div class="panorama-container">
        <div ref="panoramaElement" id="panorama"></div>
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>加载全景图中...</p>
        </div>
        <div class="hotspot-indicator">
          <i class="fas fa-info-circle"></i>
          <span>点击热点查看其他房间</span>
        </div>
      </div>

      <div class="controls">
        <button
            v-for="(room, index) in rooms"
            :key="index"
            @click="changeRoom(index)"
            :class="['room-btn', { active: currentRoomIndex === index }]"
        >
          <i :class="getRoomIcon(room.title)"></i>
          {{ room.title }}
        </button>
      </div>

      <div class="room-info">
        <div class="info-card">
          <h3>{{ currentRoom.title }}信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <i class="fas fa-ruler-combined"></i>
              <span><strong>面积:</strong> {{ currentRoomInfo.size }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-door-open"></i>
              <span><strong>窗户:</strong> {{ currentRoomInfo.windows }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-lightbulb"></i>
              <span><strong>照明:</strong> {{ currentRoomInfo.lighting }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-paint-roller"></i>
              <span><strong>装修:</strong> {{ currentRoomInfo.decoration }}</span>
            </div>
          </div>
        </div>
        <div class="info-card">
          <h3>房屋特色</h3>
          <ul class="feature-list">
            <li v-for="(feature, idx) in roomFeatures" :key="idx">
              <i class="fas fa-check-circle"></i> {{ feature }}
            </li>
          </ul>
        </div>
      </div>

      <footer>
        <div class="footer-content">
          <div class="logo">
            <i class="fas fa-home"></i>
            <span>智慧看房</span>
          </div>
          <p>© 2023 Vue 3D看房应用 - 使用Pannellum技术实现</p>
          <div class="social-links">
            <i class="fab fa-weixin"></i>
            <i class="fab fa-qq"></i>
            <i class="fab fa-weibo"></i>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import 'pannellum'
import 'pannellum/build/pannellum.css'

export default {
  name: 'PanoramaViewer',
  data() {
    return {

      rooms: [
        {
          title: "客厅",
          id: "living-room",
          image: "src/Model/Picture/54387302729_54a96401f0_k.jpg",
          hotspots: [
            { pitch: -10.2, yaw: 100.0, sceneId: "dining-room", text: "前往餐厅" },
            { pitch: 5.0, yaw: 210.0, sceneId: "balcony", text: "前往阳台" }
          ],
          info: {
            size: "28平方米",
            windows: "南向落地窗",
            lighting: "LED主灯+氛围灯",
            decoration: "现代简约风"
          }
        },
        {
          title: "主卧室",
          id: "bedroom",
          image: "https://pannellum.org/images/bma-1.jpg",
          hotspots: [
            { pitch: -2.6, yaw: 210.0, sceneId: "living-room", text: "前往客厅" },
            { pitch: -0.6, yaw: 70.0, sceneId: "bathroom", text: "前往浴室" }
          ],
          info: {
            size: "20平方米",
            windows: "东西各一窗",
            lighting: "主灯+床头阅读灯",
            decoration: "温馨暖色调"
          }
        },
        {
          title: "餐厅",
          id: "dining-room",
          image: "https://pannellum.org/images/tunnel.jpg",
          hotspots: [
            { pitch: -8.0, yaw: 290.0, sceneId: "living-room", text: "前往客厅" },
            { pitch: 0.0, yaw: 10.0, sceneId: "kitchen", text: "前往厨房" }
          ],
          info: {
            size: "15平方米",
            windows: "北向飘窗",
            lighting: "吊灯+壁灯",
            decoration: "北欧风格"
          }
        },
        {
          title: "浴室",
          id: "bathroom",
          image: "https://pannellum.org/images/cerro-toco-0.jpg",
          hotspots: [
            { pitch: -5.6, yaw: 110.0, sceneId: "bedroom", text: "返回卧室" }
          ],
          info: {
            size: "8平方米",
            windows: "南向通风窗",
            lighting: "防水吸顶灯",
            decoration: "防滑瓷砖"
          }
        }
      ],
      currentRoomIndex: 0,
      loading: true,
      viewer: null,
      roomFeatures: [
        "全屋智能家居系统",
        "德国品牌厨卫设备",
        "三层中空隔音玻璃",
        "地暖+中央空调",
        "24小时安保系统"
      ]
    }
  },
  computed: {
    currentRoom() {
      return this.rooms[this.currentRoomIndex]
    },
    currentRoomInfo() {
      return this.currentRoom.info || {}
    }
  },
  methods: {
    initViewer() {
      if (this.viewer) {
        this.viewer.destroy();
      }

      this.loading = true;

      this.viewer = window.pannellum.viewer(this.$refs.panoramaElement, {
        "type": "equirectangular",
        "panorama": this.currentRoom.image,
        "autoLoad": true,
        "showControls": true,
        "hotSpots": this.currentRoom.hotspots.map(hotspot => ({
          ...hotspot,
          "type": "scene",
          "sceneId": hotspot.sceneId,
          "text": hotspot.text
        })),
        "sceneFadeDuration": 1000
      });

      // 当全景图加载完成
      this.viewer.on('load', () => {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });

      // 场景切换时
      this.viewer.on('scenechange', (newSceneId) => {
        const index = this.rooms.findIndex(r => r.id === newSceneId);
        if (index !== -1) {
          this.currentRoomIndex = index;
        }
      });
    },
    changeRoom(index) {
      if (index !== this.currentRoomIndex) {
        this.currentRoomIndex = index;
      }
    },
    getRoomIcon(title) {
      const icons = {
        '客厅': 'fas fa-couch',
        '主卧室': 'fas fa-bed',
        '餐厅': 'fas fa-utensils',
        '浴室': 'fas fa-shower',
        '厨房': 'fas fa-fire',
        '阳台': 'fas fa-sun'
      };
      return icons[title] || 'fas fa-door-open';
    }
  },
  watch: {
    currentRoomIndex() {
      this.initViewer();
    }
  },
  mounted() {
    this.initViewer();
    // 模拟数据加载
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  },
  beforeUnmount() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.virtual-tour-container {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  background: linear-gradient(135deg, #1d2b64, #1e3c72, #2a5298);
  color: #333;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

header {
  text-align: center;
  padding: 25px 0;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  margin-bottom: 15px;
}

header h1 {
  font-size: 2.8rem;
  margin-bottom: 10px;
  letter-spacing: 1px;
  font-weight: 700;
}

header p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.panorama-container {
  position: relative;
  width: 100%;
  height: 65vh;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  margin: 10px 0 25px;
  transition: all 0.4s ease;
}

#panorama {
  width: 100%;
  height: 100%;
  background: #000;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.room-btn {
  background: linear-gradient(to bottom, #3498db, #1a5276);
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.room-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  background: linear-gradient(to bottom, #3cb0fd, #1a75bc);
}

.room-btn.active {
  background: linear-gradient(to bottom, #e67e22, #d35400);
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(230, 126, 34, 0.4);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin: 30px 0;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-card h3 {
  color: #3498db;
  margin-bottom: 15px;
  font-size: 1.5rem;
  position: relative;
  z-index: 2;
}

.feature-card p {
  color: #555;
  line-height: 1.7;
  position: relative;
  z-index: 2;
}

.icon-container {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.icon-container i {
  font-size: 3rem;
  color: rgba(52, 152, 219, 0.15);
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  border-radius: 15px;
  z-index: 10;
  transition: opacity 0.3s ease;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.hotspot-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 12px 20px;
  border-radius: 30px;
  z-index: 10;
  font-size: 1rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hotspot-indicator::before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e74c3c;
  margin-right: 8px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); }
  50% { transform: scale(1.1); }
  100% { transform: scale(0.95); }
}

.room-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  margin: 25px 0 40px;
}

.info-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.info-card h3 {
  color: #e67e22;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  font-size: 1.4rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  color: #444;
}

.info-item i {
  color: #3498db;
  font-size: 1.3rem;
}

.feature-list {
  list-style: none;
  padding-left: 0;
}

.feature-list li {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 10px;
}

.feature-list li i {
  color: #2ecc71;
}

footer {
  text-align: center;
  padding: 25px 0;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 500px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: bold;
  color: white;
}

.social-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 15px;
}

.social-links i {
  font-size: 1.8rem;
  opacity: 0.8;
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-links i:hover {
  opacity: 1;
  transform: translateY(-3px);
}

@media (max-width: 992px) {
  .panorama-container {
    height: 55vh;
  }
}

@media (max-width: 768px) {
  header h1 {
    font-size: 2.2rem;
  }

  header p {
    font-size: 1.1rem;
    padding: 0 15px;
  }

  .panorama-container {
    height: 50vh;
  }

  .room-btn {
    padding: 10px 20px;
    font-size: 1rem;
  }

  .room-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .panorama-container {
    height: 45vh;
  }

  .controls {
    gap: 8px;
  }

  .room-btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }

  .feature-card {
    padding: 20px;
  }
}
</style>