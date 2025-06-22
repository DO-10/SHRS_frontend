<template>
  <div class="house-list-container">
    <!-- 筛选栏 -->
    <div class="filters">
      <!-- 价格筛选 -->
      <div class="filter-group">
        <label>价格：</label>
        <select v-model="filters.price">
          <option value="">不限</option>
          <option value="0-2000">2000元以下</option>
          <option value="2000-4000">2000-4000元</option>
          <option value="4000-">4000元以上</option>
        </select>
      </div>

      <!-- 户型筛选 -->
      <div class="filter-group">
        <label>户型：</label>
        <select v-model="filters.type">
          <option value="">不限</option>
          <option v-for="t in uniqueTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <!-- 标签筛选 -->
      <div class="filter-group">
        <label>标签：</label>
        <select v-model="filters.tag">
          <option value="">不限</option>
          <option v-for="tag in uniqueTags" :key="tag" :value="tag">{{ tag }}</option>
        </select>
      </div>
    </div>

    <!-- 房屋列表 -->
    <div class="house-list">
      <div
          v-for="house in filteredHouses"
          :key="house.id"
          class="house-card"
          @click="goToHouseDetail"
      >
        <img :src="house.image" :alt="house.title" class="house-image" />
        <div class="house-info">
          <h3>{{ house.title }}</h3>
          <p class="price">{{ house.price }}</p>
          <p class="district">{{ house.district }}</p>
          <p class="details">{{ house.size }} | {{ house.type }}</p>
          <div class="tags">
            <span v-for="tag in house.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filters: {
        price: '',
        type: '',
        tag: ''
      },
      houses: [
        {
          id: 1,
          title: "梅溪湖 3室2厅 110㎡",
          price: "2500元/月",
          image:
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          district: "长沙市开福区",
          size: "110㎡",
          type: "3室2厅",
          tags: ["地铁房", "学区房","3D看房"]
        },
        {
          id: 2,
          title: "北辰三角洲 湖景豪宅 150㎡",
          price: "4500元/月",
          image:
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          district: "长沙市开福区",
          size: "150㎡",
          type: "4室2厅",
          tags: ["江景房", "豪华装修"]
        },
        {
          id: 3,
          title: "南门口 精装小复式 85㎡",
          price: "3000元/月",
          image:
              "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          district: "长沙市天心区",
          size: "85㎡",
          type: "2室1厅",
          tags: ["复式", "精装修"]
        },
        {
          id: 4,
          title: "五一广场 1室1厅 45㎡",
          price: "1800元/月",
          image:
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          district: "长沙市芙蓉区",
          size: "45㎡",
          type: "1室1厅",
          tags: ["市中心", "拎包入住"]
        },
        {
          id: 5,
          title: "岳麓山 4室2厅 160㎡",
          price: "5000元/月",
          image:
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          district: "长沙市岳麓区",
          size: "160㎡",
          type: "4室2厅",
          tags: ["山景房", "大阳台"]
        },
        {
          id: 6,
          title: "湘江世纪城 2室1厅 75㎡",
          price: "2800元/月",
          image:
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          district: "长沙市开福区",
          size: "75㎡",
          type: "2室1厅",
          tags: ["江景房", "精装修"]
        },
        {
          id: 7,
          title: "星沙 5室3厅 200㎡",
          price: "6000元/月",
          image:
              "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          district: "长沙县",
          size: "200㎡",
          type: "5室3厅",
          tags: ["别墅", "花园"]
        },
        {
          id: 8,
          title: "万家丽 3室1厅 95㎡",
          price: "3200元/月",
          image:
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          district: "长沙市芙蓉区",
          size: "95㎡",
          type: "3室1厅",
          tags: ["地铁房", "生活便利"]
        },
        {
          id: 9,
          title: "洋湖湿地 2室2厅 80㎡",
          price:
              "2600元/月",
          image:
              "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          district: "长沙市岳麓区",
          size: "80㎡",
          type: "2室2厅",
          tags: ["公园房", "安静"]
        },
        {
          id: 10,
          title: "高铁南站 1室0厅 35㎡",
          price:
              "1500元/月",
          image:
              "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          district: "长沙市雨花区",
          size: "35㎡",
          type: "1室0厅",
          tags: ["单间", "交通便利"]
        }
      ]
    };
  },
  computed: {
    // 获取所有不重复的户型
    uniqueTypes() {
      return [...new Set(this.houses.map(house => house.type))];
    },
    // 获取所有不重复的标签
    uniqueTags() {
      const allTags = this.houses.flatMap(house => house.tags);
      return [...new Set(allTags)];
    },
    // 筛选后的房屋列表
    filteredHouses() {
      return this.houses.filter(house => {
        // 价格筛选
        if (this.filters.price) {
          const [minStr, maxStr] = this.filters.price.split('-');
          const priceNum = parseInt(house.price);

          // 处理价格字符串，提取数字
          const housePrice = parseInt(house.price.replace('元/月', ''));

          const min = minStr ? parseInt(minStr) : null;
          const max = maxStr ? parseInt(maxStr) : null;

          if (min !== null && housePrice < min) return false;
          if (max !== null && housePrice > max) return false;
        }

        // 户型筛选
        if (this.filters.type && house.type !== this.filters.type) {
          return false;
        }

        // 标签筛选
        if (this.filters.tag && !house.tags.includes(this.filters.tag)) {
          return false;
        }

        return true;
      });
    }
  },
  methods: {
    goToHouseDetail() {
      // 跳转到房屋详情页面
      window.location.href = 'housedetail.html';
    }
  }
};
</script>

<style scoped>
.house-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-group {
  display: flex;
  align-items: center;
}

.filter-group label {
  margin-right: 10px;
  font-weight: bold;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.house-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.house-card {
  display: flex;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  cursor: pointer;
}

.house-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.house-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.house-info {
  flex: 1;
  padding: 15px;
}

.house-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.price {
  color: #ff6000;
  font-weight: bold;
  font-size: 20px;
  margin: 5px 0;
}

.district, .details {
  color: #666;
  margin: 5px 0;
  font-size: 14px;
}

.tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
