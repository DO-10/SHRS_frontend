<template>
  <div>
    <div class="admin-container">
      <!-- 侧边导航 -->
      <div class="sidebar">
        <div class="logo">
          <h2><i class="fas fa-home"></i> <span>租房系统管理</span></h2>
        </div>
        <ul class="nav-links">
          <li><a href="#" class="active"><i class="fas fa-chart-line"></i> <span>数据概览</span></a></li>
          <li><a href="#"><i class="fas fa-house-user"></i> <span>房源管理</span></a></li>
          <li><a href="#"><i class="fas fa-users"></i> <span>租客管理</span></a></li>
          <li><a href="#"><i class="fas fa-file-invoice-dollar"></i> <span>订单管理</span></a></li>
          <li><a href="#"><i class="fas fa-cog"></i> <span>系统设置</span></a></li>
        </ul>
      </div>

      <!-- 主内容区 -->
      <div class="main-content">
        <!-- 顶部搜索栏 -->
        <div class="header">
          <div class="search-bar">
            <input
                type="text"
                placeholder="搜索用户..."
                v-model="searchQuery"
                @keyup.enter="searchUser"
            >
            <button @click="searchUser">
              <i class="fas fa-search"></i>
            </button>
          </div>
          <div class="user-info">
            <div class="avatar">A</div>
            <div>
              <div>管理员</div>
              <small>admin@rental.com</small>
            </div>
          </div>
        </div>

        <!-- 数据统计卡片 -->
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon icon-1">
              <i class="fas fa-home"></i>
            </div>
            <div class="stat-info">
              <h3>1,248</h3>
              <p>总房源数</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-2">
              <i class="fas fa-file-contract"></i>
            </div>
            <div class="stat-info">
              <h3>362</h3>
              <p>本月成交量</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-3">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
              <h3>2,184</h3>
              <p>注册用户数</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-4">
              <i class="fas fa-money-bill-wave"></i>
            </div>
            <div class="stat-info">
              <h3>¥1,842K</h3>
              <p>本月总收入</p>
            </div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="charts-container">
          <!-- 户型销量扇形图 -->
          <div class="chart-card">
            <div class="chart-header">
              <h3>户型销量分布</h3>
              <div class="time-filter">
                <select v-model="selectedPeriod">
                  <option value="month">本月</option>
                  <option value="quarter">本季度</option>
                  <option value="year">本年度</option>
                </select>
              </div>
            </div>
            <div class="chart-container" ref="pieChart"></div>
          </div>

          <!-- 地区销量折线图 -->
          <div class="chart-card">
            <div class="chart-header">
              <h3>地区销量趋势 (每半个月)</h3>
              <div class="time-filter">
                <select v-model="selectedRegion">
                  <option value="all">全部地区</option>
                  <option value="beijing">北京</option>
                  <option value="shanghai">上海</option>
                  <option value="guangzhou">广州</option>
                  <option value="shenzhen">深圳</option>
                </select>
              </div>
            </div>
            <div class="chart-container" ref="lineChart"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户权限管理弹窗 -->
    <div class="modal-overlay" v-if="showUserModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>用户权限管理</h3>
          <button class="close-btn" @click="closeUserModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="user-details">
            <div class="user-avatar">{{ selectedUser.name.charAt(0) }}</div>
            <div class="user-info">
              <h4>{{ selectedUser.name }}</h4>
              <p>{{ selectedUser.email }} | 注册时间: {{ selectedUser.registerDate }}</p>
            </div>
          </div>

          <div class="permission-section">
            <h4>权限设置</h4>
            <div class="permission-grid">
              <div class="permission-item">
                <input
                    type="checkbox"
                    id="permission1"
                    v-model="selectedUser.permissions.admin"
                >
                <label for="permission1">管理员权限</label>
              </div>
              <div class="permission-item">
                <input
                    type="checkbox"
                    id="permission2"
                    v-model="selectedUser.permissions.edit"
                >
                <label for="permission2">房源编辑权限</label>
              </div>
              <div class="permission-item">
                <input
                    type="checkbox"
                    id="permission3"
                    v-model="selectedUser.permissions.verify"
                >
                <label for="permission3">房源审核权限</label>
              </div>
              <div class="permission-item">
                <input
                    type="checkbox"
                    id="permission4"
                    v-model="selectedUser.permissions.finance"
                >
                <label for="permission4">财务权限</label>
              </div>
              <div class="permission-item">
                <input
                    type="checkbox"
                    id="permission5"
                    v-model="selectedUser.permissions.report"
                >
                <label for="permission5">报表查看权限</label>
              </div>
              <div class="permission-item">
                <input
                    type="checkbox"
                    id="permission6"
                    v-model="selectedUser.permissions.message"
                >
                <label for="permission6">消息管理权限</label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeUserModal">取消</button>
          <button class="btn btn-primary" @click="savePermissions">保存更改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      showUserModal: false,
      selectedUser: {
        name: '张三',
        email: 'zhangsan@example.com',
        registerDate: '2023-01-15',
        permissions: {
          admin: false,
          edit: true,
          verify: false,
          finance: false,
          report: true,
          message: false,
        },
      },
      selectedPeriod: 'month',
      selectedRegion: 'all',
    };
  },
  methods: {
    searchUser() {
      alert(`搜索关键词：${this.searchQuery}`);
      // 这里可以添加搜索逻辑
    },
    closeUserModal() {
      this.showUserModal = false;
    },
    savePermissions() {
      alert('权限已保存！');
      this.closeUserModal();
    },
    initPieChart() {
      // 使用ECharts或其他图表库初始化扇形图
      // 这里只是示意
      // 你需要引入图表库并初始化
    },
    initLineChart() {
      // 使用ECharts或其他图表库初始化折线图
    },
  },
  mounted() {
    // 这里可以初始化图表
    this.initPieChart();
    this.initLineChart();
  },
  // methods: {
  //   searchUser() {
  //     alert(`搜索关键词：${this.searchQuery}`);
  //   },
  //   closeUserModal() {
  //     this.showUserModal = false;
  //   },
  //   savePermissions() {
  //     alert('权限已保存！');
  //     this.closeUserModal();
  //   },
  //
  // },
};
</script>

<style scoped>
/* 基本样式，可根据需要调整 */

.admin-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* 侧边导航 */
.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: #fff;
  padding: 20px;
}

.logo h2 {
  display: flex;
  align-items: center;
  font-size: 20px;
}

.logo i {
  margin-right: 10px;
}

.nav-links {
  list-style: none;
  margin-top: 30px;
  padding: 0;
}

.nav-links li {
  margin-bottom: 15px;
}

.nav-links a {
  color: #bdc3c7;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  background-color: #34495e;
  color: #fff;
}

.nav-links i {
  margin-right: 10px;
}

/* 主内容 */
.main-content {
  flex: 1;
  padding: 20px;
  background-color: #ecf0f1;
  overflow-y: auto;
}

/* 顶部搜索栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
}

.search-bar input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
  width: 200px;
}

.search-bar button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-left: none;
  background-color: #3498db;
  color: #fff;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background 0.3s;
}

.search-bar button:hover {
  background-color: #2980b9;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #2980b9;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 10px;
}

/* 统计卡片 */
.stats-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.stat-card {
  background-color: #fff;
  flex: 1 1 200px;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 30px;
  margin-right: 15px;
  padding: 10px;
  border-radius: 50%;
  color: #fff;
}

.icon-1 {
  background-color: #e74c3c;
}
.icon-2 {
  background-color: #f39c12;
}
.icon-3 {
  background-color: #27ae60;
}
.icon-4 {
  background-color: #8e44ad;
}

.stat-info h3 {
  margin: 0;
  font-size: 24px;
}

.stat-info p {
  margin: 5px 0 0;
  color: #7f8c8d;
}

/* 图表区域 */
.charts-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.chart-card {
  background-color: #fff;
  flex: 1 1 45%;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-header h3 {
  margin: 0;
  font-size: 18px;
}

.time-filter select {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* 图表容器 */
.chart-container {
  height: 300px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #fff;
  width: 600px;
  max-width: 90%;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f1f1f1;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.user-details {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  background-color: #3498db;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  margin-right: 15px;
}

.user-info h4 {
  margin: 0 0 5px 0;
}

.permission-section {
  margin-top: 20px;
}

.permission-section h4 {
  margin-bottom: 10px;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.permission-item {
  display: flex;
  align-items: center;
}

.permission-item input {
  margin-right: 8px;
}

.modal-footer {
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background-color: #f1f1f1;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #3498db;
  color: #fff;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #ccc;
  color: #333;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-outline:hover {
  background-color: #f0f0f0;
}
</style>
