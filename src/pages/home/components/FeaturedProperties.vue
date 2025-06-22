<script setup>
import {ref} from "vue";
// 11111

const properties = ref([
  {
    id: 1,
    title: "梅溪湖 3室2厅 110㎡",
    price: "2500元/月",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    district: "长沙市开福区",
    size: "110㎡",
    type: "3室2厅",
    tags: ["地铁房", "学区房"]
  },
  {
    id: 2,
    title: "北辰三角洲 湖景豪宅 150㎡",
    price: "4500元/月",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    district: "长沙市开福区",
    size: "150㎡",
    type: "4室2厅",
    tags: ["江景房", "豪华装修"]
  },
  {
    id: 3,
    title: "南门口 精装小复式 85㎡",
    price: "3000元/月",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    district: "长沙市天心区",
    size: "85㎡",
    type: "2室1厅",
    tags: ["复式", "精装修"]
  },

])
</script>

<template>
  <div class="featured-properties">
    <div class="section-header">
      <h2 class="section-title">精选房源推荐</h2>
      <a href="#" class="view-more">
        查看更多 <i class="fas fa-arrow-right"></i>
      </a>
    </div>

    <div class="properties-grid">
      <div
          class="property-card"
          v-for="property in properties"
          :key="property.id"
      >
        <img :src="property.image" alt="房源" class="property-image">
        <div class="property-content">
          <div class="property-price">{{property.price}}</div>
          <h3 class="property-title">{{property.title}}</h3>
          <div class="property-details">
            <span><i class="fas fa-map-marker-alt"></i> {{property.district}}</span>
            <span><i class="fas fa-expand-arrows-alt"></i> {{property.size}}</span>
            <span><i class="fas fa-building"></i> {{property.type}}</span>
          </div>
          <div>
            <span
                class="property-tag"
                v-for="(tag, index) in property.tags"
                :key="index"
            >
              {{tag}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.featured-properties {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  margin-bottom: 50px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 24px;
  color: #303133;
  font-weight: 700;
}

.view-more {
  color: #409eff;
  font-size: 15px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.view-more:hover {
  color: #f56c6c;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.property-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.property-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.property-content {
  padding: 20px;
}

.property-price {
  font-size: 22px;
  color: #e6a23c;
  font-weight: 700;
  margin-bottom: 10px;
}

.property-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 12px;
}

.property-details {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 14px;
}

.property-details span {
  color: #909399;
  display: flex;
  align-items: center;
  gap: 5px;
}

.property-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 4px;
  font-size: 13px;
  margin-right: 8px;
}
</style>