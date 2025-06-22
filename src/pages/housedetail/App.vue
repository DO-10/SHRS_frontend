<template>
  <div>
    <!--    &lt;!&ndash; 头部导航 &ndash;&gt;-->
    <!--    <header class="header">-->
    <!--      <div class="nav-container">-->
    <!--        <a href="#" class="logo">-->
    <!--          <i class="fas fa-home"></i>-->
    <!--          <span>优租客</span>-->
    <!--        </a>-->
    <!--        <div class="nav-links">-->
    <!--          <a href="#" class="active">首页</a>-->
    <!--          <a href="#">找房</a>-->
    <!--          <a href="#">租房指南</a>-->
    <!--          <a href="#">房东服务</a>-->
    <!--          <a href="#">关于我们</a>-->
    <!--        </div>-->
    <!--        <div class="user-actions">-->
    <!--          <el-button type="primary" plain>-->
    <!--            <i class="fas fa-user"></i> 登录/注册-->
    <!--          </el-button>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </header>-->

    <!-- 房屋详情内容 -->
    <div class="container">
      <div class="house-detail-container">
        <!-- 左侧房屋图片 -->
        <div class="house-images">
          <div class="main-image">
            <img :src="currentImage" alt="房屋主图" />
          </div>
          <div class="thumbnail-container">
            <div
                v-for="(img, index) in house.images"
                :key="index"
                class="thumbnail"
                :class="{ active: currentImageIndex === index }"
                @click="selectImage(index)"
            >
              <img :src="img" :alt="'房屋图片' + (index + 1)" />
            </div>
          </div>
        </div>

        <!-- 右侧房屋信息和租赁面板 -->
        <div class="house-info">
          <div class="house-header">
            <h1 class="house-title">{{ house.title }}</h1>
            <div class="house-address">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ house.address }}</span>
            </div>
            <div class="house-tags">
              <el-tag type="danger">优质房源</el-tag>
              <el-tag>{{ house.type }}</el-tag>
              <el-tag>{{ house.decoration }}装修</el-tag>
              <el-tag>{{ house.orientation }}</el-tag>
              <el-tag>电梯房</el-tag>
            </div>
            <div class="price-section">
              <div class="price">¥{{ house.price }}</div>
              <div class="price-unit">元/月</div>
              <div>（押{{ house.deposit }}付{{ house.payment }}）</div>
            </div>
          </div>

          <!-- 房屋基本信息 -->
          <div class="info-grid">
            <div class="info-card">
              <h3><i class="fas fa-home"></i> 房屋信息</h3>
              <div class="info-item">
                <span class="info-label">户型：</span>
                <span class="info-value">{{ house.type }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">面积：</span>
                <span class="info-value">{{ house.area }}㎡</span>
              </div>
              <div class="info-item">
                <span class="info-label">楼层：</span>
                <span class="info-value">{{ house.floor }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">朝向：</span>
                <span class="info-value">{{ house.orientation }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">装修：</span>
                <span class="info-value">{{ house.decoration }}装修</span>
              </div>
              <div class="info-item">
                <span class="info-label">电梯：</span>
                <span class="info-value">有电梯</span>
              </div>
            </div>

            <div class="info-card">
              <h3><i class="fas fa-calendar-alt"></i> 租赁信息</h3>
              <div class="info-item">
                <span class="info-label">付款方式：</span>
                <span class="info-value">押{{ house.deposit }}付{{ house.payment }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">最短租期：</span>
                <span class="info-value">{{ house.minLease }}个月</span>
              </div>
              <div class="info-item">
                <span class="info-label">入住时间：</span>
                <span class="info-value">随时入住</span>
              </div>
              <div class="info-item">
                <span class="info-label">看房方式：</span>
                <span class="info-value">提前预约</span>
              </div>
              <div class="info-item">
                <span class="info-label">发布时间：</span>
                <span class="info-value">2023-08-15</span>
              </div>
              <div class="info-item">
                <span class="info-label">房源编号：</span>
                <span class="info-value">HZ202308151234</span>
              </div>
            </div>
          </div>

          <!-- 房屋描述 -->
          <div class="description">
            <h3>房源描述</h3>
            <div class="description-content">
              {{ house.description }}
              <p style="margin-top: 15px;">靠近中南大学，小区环境优美，绿化率高，物业管理完善。周边配套设施齐全，步行5分钟可达地铁站，10分钟可达大型购物中心。房屋采光极佳，视野开阔，精装修，家具家电齐全，拎包即可入住。</p>
            </div>
            <!-- 添加前往3D看房按钮 -->
            <div style="margin-top: 20px; text-align: center;">
              <el-button type="primary" @click="goTo3DView">
                前往3D看房
              </el-button>
            </div>
          </div>

          <!-- 租赁操作面板 -->
          <div class="rent-panel">
            <h3 class="rent-title">立即租房</h3>
            <div class="date-picker">
              <div class="date-item">
                <label>租赁开始日期</label>
                <el-date-picker
                    v-model="rentalData.startDate"
                    type="date"
                    placeholder="选择开始日期"
                    size="large"
                    style="width: 100%;"
                />
              </div>
              <div class="date-item">
                <label>租赁结束日期</label>
                <el-date-picker
                    v-model="rentalData.endDate"
                    type="date"
                    placeholder="选择结束日期"
                    size="large"
                    :disabled-date="disabledEndDate"
                    style="width: 100%;"
                />
              </div>
              <div class="date-item">
                <label>租赁时长</label>
                <el-input
                    :value="calculateLeaseDuration() + '个月'"
                    readonly
                    size="large"
                >
                  <template #prefix>
                    <i class="fas fa-calendar-alt"></i>
                  </template>
                </el-input>
              </div>
            </div>
            <div class="rent-summary">
              <div class="summary-item">
                <span>月租金：</span>
                <span>¥{{ house.price }}</span>
              </div>
              <div class="summary-item">
                <span>租赁时长：</span>
                <span>{{ calculateLeaseDuration() }}个月</span>
              </div>
              <div class="summary-item">
                <span>押金：</span>
                <span>¥{{ house.price * house.deposit }}</span>
              </div>
              <div class="summary-item total">
                <span>需支付总额：</span>
                <span>¥{{ calculateTotalPayment() }}</span>
              </div>
            </div>
            <div class="action-buttons">
              <el-button type="primary" class="btn-large" @click="rentHouse">
                <i class="fas fa-file-contract"></i> 立即签约租房
              </el-button>
              <el-button type="success" class="btn-large btn-contact">
                <i class="fas fa-phone-alt"></i> 联系房东
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    &lt;!&ndash; 相似房源推荐 &ndash;&gt;-->
    <!--    <div class="similar-houses">-->
    <!--      <h2 class="section-title">相似房源推荐</h2>-->
    <!--      <div class="similar-list">-->
    <!--        <div v-for="house in similarHouses" :key="house.id" class="similar-card">-->
    <!--          <div class="similar-image">-->
    <!--            <img :src="house.image" :alt="house.title" />-->
    <!--          </div>-->
    <!--          <div class="similar-info">-->
    <!--            <h3 class="similar-title">{{ house.title }}</h3>-->
    <!--            <div class="similar-price">¥{{ house.price }}元/月</div>-->
    <!--            <div class="similar-details">-->
    <!--              <span>{{ house.district }}</span>-->
    <!--              <span>{{ house.size }} | {{ house.type }}</span>-->
    <!--            </div>-->
    <!--            <div class="similar-tags">-->
    <!--              <span class="similar-tag" v-for="tag in house.tags" :key="tag">{{ tag }}</span>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <!-- 页脚 -->
    <!--    <footer>-->
    <!--      <div class="footer-container">-->
    <!--        <div class="footer-section">-->
    <!--          <h3>关于优租客</h3>-->
    <!--          <div class="footer-links">-->
    <!--            <a href="#">公司简介</a>-->
    <!--            <a href="#">团队介绍</a>-->
    <!--            <a href="#">加入我们</a>-->
    <!--            <a href="#">服务条款</a>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div class="footer-section">-->
    <!--          <h3>帮助中心</h3>-->
    <!--          <div class="footer-links">-->
    <!--            <a href="#">租房指南</a>-->
    <!--            <a href="#">常见问题</a>-->
    <!--            <a href="#">用户协议</a>-->
    <!--            <a href="#">隐私政策</a>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div class="footer-section">-->
    <!--          <h3>联系我们</h3>-->
    <!--          <div class="footer-links">-->
    <!--            <a href="#"><i class="fas fa-phone-alt"></i> 400-888-8888</a>-->
    <!--            <a href="#"><i class="fas fa-envelope"></i> contact@youzuke.com</a>-->
    <!--            <a href="#"><i class="fas fa-map-marker-alt"></i> 北京市朝阳区科技园区88号</a>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="footer-bottom">-->
    <!--        <p>© 2023 优租客 youzuke.com 版权所有 | 京ICP备12345678号</p>-->
    <!--      </div>-->
    <!--    </footer>-->
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'HouseDetailPage',
  setup() {
    // 房屋基本信息数据
    const house = ref({
      title: '3居室地铁房',
      address: '梅溪湖特色小区3栋403',
      type: '三室两厅',
      decoration: '学区房，地铁房',
      orientation: '南北通透',
      area: 110,
      floor: '第5层/共12层',
      price: 2500,
      deposit: 1,
      payment: 1,
      minLease: 6,
      description: '梅溪湖的好房子',
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        // 其他图片可以添加
      ],
    });

    // 当前显示的图片索引
    const currentImageIndex = ref(0);
    const currentImage = computed(() => house.value.images[currentImageIndex.value]);

    // 选择图片
    const selectImage = (index) => {
      currentImageIndex.value = index;
    };

    // 租赁日期
    const rentalData = ref({
      startDate: null,
      endDate: null,
    });

    // 计算租赁时长（以月为单位）
    const calculateLeaseDuration = () => {
      if (rentalData.value.startDate && rentalData.value.endDate) {
        const start = new Date(rentalData.value.startDate);
        const end = new Date(rentalData.value.endDate);
        const months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth()) +
            1; // 包含起止月
        return months > 0 ? months : 0;
      }
      return 0;
    };

    // 禁用结束日期（必须晚于开始日期）
    const disabledEndDate = (date) => {
      if (rentalData.value.startDate) {
        const start = new Date(rentalData.value.startDate);
        return date < start;
      }
      return false;
    };

    // 计算总支付金额
    const calculateTotalPayment = () => {
      const months = calculateLeaseDuration();
      if (months > 0) {
        return house.value.price * months + house.value.price * house.value.deposit;
      }
      return 0;
    };

    // 租房操作
    const rentHouse = () => {
      alert(
          `已成功租赁${calculateLeaseDuration()}个月，总支付¥${calculateTotalPayment()}`
      );
    };

    // 前往3D看房
    const goTo3DView = () => {
      window.location.href = '3Dview.html';
    };

    // 相似房源数据
    const similarHouses = ref([
      {
        id: 1,
        image: 'https://via.placeholder.com/300x200?text=房源1',
        title: '温馨一居室',
        price: 3200,
        district: '朝阳区',
        size: 50,
        type: '一室一厅',
        tags: ['近地铁', '拎包入住'],
      },
      {
        id: 2,
        image: 'https://via.placeholder.com/300x200?text=房源2',
        title: '舒适三居室',
        price: 5000,
        district: '海淀区',
        size: 120,
        type: '三室一厅',
        tags: ['学区房', '南向'],
      },
      {
        id: 3,
        image: 'https://via.placeholder.com/300x200?text=房源3',
        title: '精装修两居室',
        price: 4000,
        district: '丰台区',
        size: 75,
        type: '两室一厅',
        tags: ['电梯房', '交通便利'],
      },
    ]);

    return {
      house,
      currentImage,
      currentImageIndex,
      selectImage,
      rentalData,
      calculateLeaseDuration,
      disabledEndDate,
      calculateTotalPayment,
      rentHouse,
      goTo3DView,
      similarHouses,
    };
  },
};
</script>

<style scoped>
/* 基本样式 */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

/* 头部导航样式 */
.header {
  background-color: #fff;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}
.logo i {
  margin-right: 8px;
}
.nav-links a {
  margin: 0 15px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}
.nav-links a.active {
  color: #1890ff;
}
.user-actions {
  /* 你可以添加样式 */
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 20px auto;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

/* 房屋详情布局 */
.house-detail-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

/* 左侧图片 */
.house-images {
  flex: 1;
  min-width: 300px;
}
.main-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}
.thumbnail-container {
  display: flex;
  margin-top: 10px;
  gap: 10px;
}
.thumbnail {
  border: 2px solid transparent;
  padding: 2px;
  cursor: pointer;
  border-radius: 4px;
}
.thumbnail.active {
  border-color: #1890ff;
}
.thumbnail img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 2px;
}

/* 右侧信息 */
.house-info {
  flex: 2;
  min-width: 300px;
}
.house-header {
  margin-bottom: 20px;
}
.house-title {
  margin: 0 0 10px 0;
}
.house-address {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
}
.house-address i {
  margin-right: 8px;
}
.house-tags {
  margin-top: 10px;
}
.price-section {
  margin-top: 15px;
  display: flex;
  align-items: baseline;
}
.price {
  font-size: 24px;
  font-weight: bold;
  color: #e94e3f;
  margin-right: 10px;
}
.price-unit {
  font-size: 14px;
  color: #999;
}
.info-grid {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}
.info-card {
  flex: 1;
  min-width: 200px;
  background: #fafafa;
  padding: 15px;
  border-radius: 4px;
}
.info-card h3 {
  margin-top: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
}
.info-card h3 i {
  margin-right: 8px;
}
.info-item {
  margin-top: 10px;
  display: flex;
}
.info-label {
  width: 80px;
  font-weight: bold;
}
.info-value {
  flex: 1;
}
.description {
  margin-top: 20px;
}
.description h3 {
  margin-bottom: 10px;
}
.rent-panel {
  margin-top: 30px;
  padding: 20px;
  background: #fafafa;
  border-radius: 4px;
}
.rent-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}
.date-picker {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.date-item {
  flex: 1;
  min-width: 200px;
}
.rent-summary {
  margin-top: 20px;
  background: #fff;
  padding: 15px;
  border-radius: 4px;
}
.summary-item {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.summary-item.total {
  font-weight: bold;
}
.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}
.btn-large {
  padding: 12px 24px;
  font-size: 16px;
}
.btn-contact {
  background-color: #52c41a;
  border-color: #52c41a;
  color: #fff;
}

/* 相似房源 */
.similar-houses {
  margin: 40px 0;
}
.section-title {
  font-size: 22px;
  margin-bottom: 20px;
}
.similar-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.similar-card {
  background: #fff;
  width: 300px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.similar-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.similar-info {
  padding: 10px;
}
.similar-title {
  margin: 0 0 10px 0;
  font-size: 16px;
}
.similar-price {
  color: #e94e3f;
  font-weight: bold;
  margin-bottom: 10px;
}
.similar-details {
  font-size: 14px;
  color: #555;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.similar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.similar-tag {
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* 页脚 */
footer {
  background-color: #333;
  color: #fff;
  padding: 30px 0;
  margin-top: 40px;
}
.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}
.footer-section {
  flex: 1;
  min-width: 200px;
}
.footer-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
}
.footer-links {
  display: flex;
  flex-direction: column;
}
.footer-links a {
  color: #ccc;
  text-decoration: none;
  margin-bottom: 8px;
  font-size: 14px;
}
.footer-links a:hover {
  color: #fff;
}
.footer-bottom {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #999;
}
</style>
