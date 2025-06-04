<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>后端驱动的3D全景看房系统</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css">
  <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --primary: #4361ee;
      --primary-dark: #3a0ca3;
      --secondary: #ff9e00;
      --secondary-dark: #ff5400;
      --success: #2ecc71;
      --light-bg: rgba(255, 255, 255, 0.9);
      --card-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    }

    body {
      background: linear-gradient(135deg, #1d2b64, #1e3c72, #2a5298);
      color: #f5f5f7;
      min-height: 100vh;
      padding: 20px;
      line-height: 1.6;
    }

    .app-container {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
    }

    /* 头部样式 */
    .app-header {
      text-align: center;
      padding: 40px 0 50px;
      position: relative;
      z-index: 2;
    }

    .app-title {
      font-size: 3rem;
      margin-bottom: 15px;
      font-weight: 800;
      background: linear-gradient(to right, #ff9a9e, #fad0c4);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
      letter-spacing: 0.5px;
    }

    .app-subtitle {
      font-size: 1.3rem;
      max-width: 700px;
      margin: 0 auto;
      opacity: 0.9;
      color: rgba(255, 255, 255, 0.85);
    }

    .api-status {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(10px);
      padding: 12px 25px;
      border-radius: 30px;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 500;
    }

    .api-status.connected {
      background: rgba(46, 204, 113, 0.2);
    }

    .api-status.error {
      background: rgba(231, 76, 60, 0.2);
    }

    /* 主内容区 */
    .main-content {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 30px;
      margin-bottom: 40px;
    }

    /* 全景容器 */
    .panorama-container {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--card-shadow);
      background: #000;
      height: 70vh;
    }

    #panorama {
      width: 100%;
      height: 100%;
    }

    /* 加载状态 */
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
      border-radius: 20px;
      z-index: 10;
      backdrop-filter: blur(4px);
    }

    .loading-spinner {
      width: 60px;
      height: 60px;
      border: 5px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: var(--primary);
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* 热点指示器 */
    .hotspot-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 13px 25px;
      border-radius: 30px;
      z-index: 10;
      font-size: 1.1rem;
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .hotspot-indicator::before {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #ff6b6b;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }

    /* 房间选择器 */
    .rooms-selector {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 15px;
      margin: 25px 0;
    }

    .room-card {
      background: var(--light-bg);
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      aspect-ratio: 1.3/1;
    }

    .room-card:hover {
      transform: translateY(-7px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
    }

    .room-card.active {
      box-shadow: 0 0 0 3px var(--primary), 0 15px 30px rgba(0, 0, 0, 0.15);
      transform: scale(1.03);
    }

    .room-card .thumbnail {
      width: 100%;
      height: 70%;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .room-card .info {
      padding: 15px;
    }

    .room-card .title {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--primary-dark);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .room-card .size {
      font-size: 0.9rem;
      color: #666;
      margin-top: 3px;
    }

    /* 信息面板 */
    .info-panel {
      background: var(--light-bg);
      border-radius: 20px;
      padding: 30px;
      box-shadow: var(--card-shadow);
      height: 70vh;
      display: flex;
      flex-direction: column;
    }

    .info-header {
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 2px solid rgba(0, 0, 0, 0.08);
    }

    .room-title {
      font-size: 2.4rem;
      color: var(--primary-dark);
      margin-bottom: 5px;
      font-weight: 700;
    }

    .room-subtitle {
      font-size: 1.2rem;
      color: var(--primary);
      font-weight: 500;
    }

    /* 信息网格 */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 25px;
    }

    .info-card {
      background: rgba(67, 97, 238, 0.07);
      border-radius: 15px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .info-card:hover {
      transform: translateY(-5px);
      background: rgba(67, 97, 238, 0.1);
    }

    .info-card h3 {
      font-size: 1.2rem;
      color: var(--primary-dark);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .info-card p {
      color: #333;
      font-size: 1.15rem;
      line-height: 1.5;
      padding-left: 34px;
    }

    .info-card i {
      font-size: 1.6rem;
      color: var(--primary);
      min-width: 30px;
    }

    .feature-list {
      flex: 1;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 15px;
      padding: 25px;
      overflow-y: auto;
    }

    .feature-list h3 {
      font-size: 1.4rem;
      color: var(--primary-dark);
      margin-bottom: 18px;
      padding-bottom: 15px;
      border-bottom: 2px solid rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .feature-list ul {
      list-style: none;
    }

    .feature-list li {
      padding: 14px 18px;
      margin-bottom: 10px;
      background: rgba(67, 97, 238, 0.08);
      border-radius: 10px;
      color: #333;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.3s ease;
    }

    .feature-list li:hover {
      background: rgba(67, 97, 238, 0.13);
      transform: translateX(7px);
    }

    .feature-list li::before {
      content: '✓';
      background: var(--primary);
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: bold;
    }

    /* 底部样式 */
    .app-footer {
      text-align: center;
      padding: 30px 0 20px;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
    }

    .footer-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      margin-bottom: 15px;
      font-weight: bold;
      color: white;
    }

    .logo i {
      color: var(--secondary);
    }

    .api-endpoint {
      background: rgba(0, 0, 0, 0.2);
      padding: 8px 15px;
      border-radius: 20px;
      margin: 10px auto;
      display: inline-block;
      font-family: monospace;
    }

    .social-links {
      display: flex;
      gap: 25px;
      justify-content: center;
      margin-top: 20px;
    }

    .social-links i {
      font-size: 1.8rem;
      opacity: 0.7;
      transition: all 0.3s ease;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.12);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .social-links i:hover {
      opacity: 1;
      transform: translateY(-7px);
      background: rgba(255, 255, 255, 0.2);
    }

    /* 响应式设计 */
    @media (max-width: 1200px) {
      .main-content {
        grid-template-columns: 1fr;
      }

      .info-panel {
        height: auto;
      }

      .panorama-container {
        height: 60vh;
      }
    }

    @media (max-width: 768px) {
      .app-title {
        font-size: 2.5rem;
      }

      .app-subtitle {
        font-size: 1.1rem;
        padding: 0 20px;
      }

      .rooms-selector {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }

      .panorama-container {
        height: 50vh;
      }

      .room-title {
        font-size: 2rem;
      }
    }
  </style>
</head>
<body>
<div id="app">
  <div class="app-container">
    <div :class="['api-status', apiStatus]" v-if="apiStatus">
      <i :class="apiStatus === 'connected' ? 'fas fa-plug' : 'fas fa-exclamation-triangle'"></i>
      {{ apiMessage }}
    </div>

    <header class="app-header">
      <h1 class="app-title">后端驱动的3D全景看房系统</h1>
      <p class="app-subtitle">通过API动态获取房间数据，实时展示3D全景效果</p>
    </header>

    <!-- 数据加载状态 -->
    <div v-if="loadingInitial" class="loading" style="position: static; height: 40vh; margin-bottom: 30px;">
      <div class="loading-spinner"></div>
      <p>正在从后端加载房间数据...</p>
    </div>

    <!-- 主内容区 -->
    <template v-else>
      <div class="main-content">
        <div>
          <!-- 全景展示区 -->
          <div class="panorama-container">
            <div id="panorama"></div>
            <div v-if="loadingPanorama" class="loading">
              <div class="loading-spinner"></div>
              <p>加载 {{ currentRoom?.name }} 全景图中...</p>
            </div>
            <div class="hotspot-indicator">
              <i class="fas fa-location-dot"></i>
              <span>点击热点切换房间</span>
            </div>
          </div>

          <!-- 房间选择器 -->
          <div class="rooms-selector">
            <div
                v-for="(room, index) in rooms"
                :key="room.id"
                :class="['room-card', { active: currentRoomIndex === index }]"
                @click="changeRoom(index)"
            >
              <div class="thumbnail" :style="{ backgroundImage: `url(${room.image})` }"></div>
              <div class="info">
                <div class="title">{{ room.name }}</div>
                <div class="size">{{ room.info?.size || '未提供面积' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 信息面板 -->
        <div class="info-panel" v-if="currentRoom">
          <div class="info-header">
            <h2 class="room-title">{{ currentRoom.name }}</h2>
            <p class="room-subtitle">{{ currentRoom.description || '精心设计的空间布局' }}</p>
          </div>

          <div class="info-grid">
            <div class="info-card">
              <h3><i class="fas fa-ruler-combined"></i> 面积</h3>
              <p>{{ currentRoom.info?.size || '未提供' }}</p>
            </div>

            <div class="info-card">
              <h3><i class="fas fa-door-open"></i> 门窗</h3>
              <p>{{ currentRoom.info?.windows || '未提供' }}</p>
            </div>

            <div class="info-card">
              <h3><i class="fas fa-lightbulb"></i> 照明</h3>
              <p>{{ currentRoom.info?.lighting || '未提供' }}</p>
            </div>

            <div class="info-card">
              <h3><i class="fas fa-paint-roller"></i> 装修</h3>
              <p>{{ currentRoom.info?.decoration || '未提供' }}</p>
            </div>
          </div>

          <div class="feature-list">
            <h3><i class="fas fa-star"></i> 房间特色</h3>
            <ul>
              <li v-for="(feature, idx) in currentRoom.features" :key="idx">{{ feature }}</li>
            </ul>
          </div>
        </div>
      </div>
    </template>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="logo">
          <i class="fas fa-home"></i>
          <span>智慧房产展示平台</span>
        </div>

        <p>
          <span class="api-endpoint">GET {{ apiUrl }}/property/rooms</span>
        </p>

        <p>© 2023 3D全景看房系统 | 后端数据驱动的交互体验</p>

        <div class="social-links">
          <i class="fab fa-weixin"></i>
          <i class="fab fa-qq"></i>
          <i class="fab fa-weibo"></i>
          <i class="fas fa-envelope"></i>
        </div>
      </div>
    </footer>
  </div>
</div>

<script>
  const { createApp, ref, onMounted, watch } = Vue;

  createApp({
    setup() {
      // 应用状态
      const rooms = ref([]);
      const currentRoomIndex = ref(0);
      const loadingInitial = ref(true);
      const loadingPanorama = ref(true);
      const viewer = ref(null);
      const apiStatus = ref(null);
      const apiMessage = ref('');
      const apiUrl = 'https://api.example.com';

      // 当前房间计算属性
      const currentRoom = ref(null);

      // 初始化全景查看器
      const initViewer = (room) => {
        if (viewer.value) {
          viewer.value.destroy();
        }

        loadingPanorama.value = true;

        try {
          viewer.value = pannellum.viewer('panorama', {
            "type": "equirectangular",
            "panorama": room.image,
            "autoLoad": true,
            "autoRotate": -1,
            "showZoomCtrl": true,
            "showFullscreenCtrl": true,
            "showControls": true,
            "hotSpots": room.hotspots,
            "sceneFadeDuration": 1000
          });

          // 全景图加载完成
          viewer.value.on('load', () => {
            setTimeout(() => {
              loadingPanorama.value = false;
            }, 500);
          });

          // 场景切换
          viewer.value.on('scenechange', (newSceneId) => {
            const index = rooms.value.findIndex(r => r.id === newSceneId);
            if (index !== -1) {
              currentRoomIndex.value = index;
            }
          });
        } catch (e) {
          console.error("全景查看器初始化失败:", e);
          setTimeout(() => {
            loadingPanorama.value = false;
          }, 1500);
        }
      };

      // 从后端API获取房间数据
      const fetchRoomsData = () => {
        loadingInitial.value = true;
        apiStatus.value = 'loading';
        apiMessage.value = "连接后端服务中...";

        // 模拟API请求 - 实际项目中替换为axios或fetch调用
        axios.get(apiUrl + '/property/rooms')
            .then(response => {
              // 成功获取数据
              rooms.value = response.data.rooms || [];

              if (rooms.value.length > 0) {
                currentRoomIndex.value = 0;
                apiStatus.value = 'connected';
                apiMessage.value = "成功获取房间数据";
              } else {
                apiStatus.value = null;
              }

              loadingInitial.value = false;
            })
            .catch(error => {
              // 获取数据失败时使用模拟数据
              console.error("API请求失败，使用模拟数据:", error);
              apiStatus.value = 'error';
              apiMessage.value = "API错误 - 使用模拟数据";

              rooms.value = [
                {
                  id: "living-room",
                  name: "客厅",
                  description: "宽敞明亮的家庭共享空间",
                  image: "https://pannellum.org/images/alma.jpg",
                  hotspots: [
                    { pitch: -10.2, yaw: 100.0, sceneId: "dining-room", text: "前往餐厅" },
                    { pitch: 5.0, yaw: 210.0, sceneId: "balcony", text: "前往阳台" }
                  ],
                  info: {
                    size: "28平方米",
                    windows: "南向落地窗",
                    lighting: "LED主灯+氛围灯",
                    decoration: "现代简约风"
                  },
                  features: ["270度全景窗", "智能灯光系统", "高级音响设备", "大理石地面"]
                },
                {
                  id: "bedroom",
                  name: "主卧室",
                  description: "舒适静谧的主人空间",
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
                  },
                  features: ["步入式衣帽间", "智能窗帘系统", "地暖系统", "独立卫浴"]
                },
                {
                  id: "dining-room",
                  name: "餐厅",
                  description: "家庭聚餐的理想空间",
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
                  },
                  features: ["10人座实木餐桌", "恒温酒柜", "艺术展示墙", "智能灯带"]
                },
                {
                  id: "bathroom",
                  name: "主浴室",
                  description: "豪华舒适的浴室空间",
                  image: "https://pannellum.org/images/cerro-toco-0.jpg",
                  hotspots: [
                    { pitch: -5.6, yaw: 110.0, sceneId: "bedroom", text: "返回卧室" }
                  ],
                  info: {
                    size: "8平方米",
                    windows: "南向通风窗",
                    lighting: "防水吸顶灯",
                    decoration: "防滑瓷砖"
                  },
                  features: ["智能恒温卫浴", "蒸汽淋浴房", "防雾镜面系统", "双人按摩浴缸"]
                }
              ];

              loadingInitial.value = false;
            });
      };

      // 切换房间
      const changeRoom = (index) => {
        if (index !== currentRoomIndex.value && index < rooms.value.length) {
          currentRoomIndex.value = index;
        }
      };

      // 计算当前房间
      watch(currentRoomIndex, (newIndex) => {
        if (rooms.value[newIndex]) {
          currentRoom.value = rooms.value[newIndex];
          initViewer(rooms.value[newIndex]);
        }
      });

      // 监听rooms数据变化
      watch(rooms, (newRooms) => {
        if (newRooms.length > 0) {
          currentRoomIndex.value = 0;
        }
      });

      // 组件挂载时获取数据
      onMounted(() => {
        fetchRoomsData();
      });

      return {
        rooms,
        currentRoomIndex,
        currentRoom,
        loadingInitial,
        loadingPanorama,
        apiStatus,
        apiMessage,
        apiUrl,
        fetchRoomsData,
        changeRoom
      };
    }
  }).mount('#app');
</script>
</body>
</html>