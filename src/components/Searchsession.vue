<script setup>
import { ref } from 'vue'

// 当前选中的标签（二手房/新房/租房）
const tab = ref('二手房')

// 地区选择相关状态
const currentRegion = ref(null)
const selectedProvince = ref(null)
const selectedCity = ref(null)
const selectedPriceRange = ref(null)

// 价格区间选项
const priceRanges = ['60万以下', '60-70万', '70-80万', '80-100万', '100-110万', '110-130万', '130-150万', '150-200万', '200-350万', '350万以上']
const newPriceRanges = ['500-800  ', '800-1500  ', '1500-2000  ', '2000-2500  ', '2500-3000', '3000-4000','4000-5000',]

// 全国区域数据
const regions = [
  {
    name: '华北地区',
    provinces: [
      {
        name: '北京市',
        cities: ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区']
      },
      {
        name: '天津市',
        cities: ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '滨海新区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区', '宁河区', '静海区', '蓟州区']
      },
      {
        name: '河北省',
        cities: ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水']
      },
      {
        name: '山西省',
        cities: ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁']
      }
    ]
  },
  {
    name: '华东地区',
    provinces: [
      {
        name: '上海市',
        cities: ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
      },
      {
        name: '江苏省',
        cities: ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁']
      },
      {
        name: '浙江省',
        cities: ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水']
      },
      {
        name: '安徽省',
        cities: ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城']
      },
      {
        name: '福建省',
        cities: ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德']
      },
      {
        name: '山东省',
        cities: ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽']
      }
    ]
  },
  {
    name: '华南地区',
    provinces: [
      {
        name: '广东省',
        cities: ['广州', '深圳', '珠海', '汕头', '佛山', '韶关', '河源', '梅州', '惠州', '汕尾', '东莞', '中山', '江门', '阳江', '湛江', '茂名', '肇庆', '清远', '潮州', '揭阳', '云浮']
      },
      {
        name: '广西省',
        cities: ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左']
      },
      {
        name: '海南省',
        cities: ['海口', '三亚', '三沙', '儋州', '琼海', '文昌', '万宁', '东方', '定安', '屯昌', '澄迈', '临高', '白沙', '昌江', '乐东', '陵水', '保亭', '琼中']
      }
    ]
  },
  {
    name: '华中地区',
    provinces: [
      {
        name: '河南省',
        cities: ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店']
      },
      {
        name: '湖北省',
        cities: ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施']
      },
      {
        name: '湖南省',
        cities: ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底']
      }
    ]
  },
  {
    name: '东北地区',
    provinces: [
      {
        name: '辽宁省',
        cities: ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛']
      },
      {
        name: '吉林省',
        cities: ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城']
      },
      {
        name: '黑龙江省',
        cities: ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化']
      }
    ]
  },
  {
    name: '西北地区',
    provinces: [
      {
        name: '陕西省',
        cities: ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛']
      },
      {
        name: '甘肃省',
        cities: ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南']
      },
      {
        name: '青海省',
        cities: ['西宁', '海东', '海北', '黄南', '海南', '果洛', '玉树', '海西']
      },
      {
        name: '宁夏省',
        cities: ['银川', '石嘴山', '吴忠', '固原', '中卫']
      },
      {
        name: '新疆省',
        cities: ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏柯尔克孜', '喀什', '和田', '伊犁哈萨克', '塔城', '阿勒泰']
      }
    ]
  },
  {
    name: '西南地区',
    provinces: [
      {
        name: '四川省',
        cities: ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳']
      },
      {
        name: '贵州省',
        cities: ['贵阳', '六盘水', '遵义', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南']
      },
      {
        name: '云南省',
        cities: ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆']
      },
      {
        name: '重庆市',
        cities: ['渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '綦江区', '大足区', '渝北区', '巴南区', '黔江区', '长寿区', '江津区', '合川区', '永川区', '南川区']
      }
    ]
  }
]
</script>

<template>
  <div class="search-section">
    <div class="search-container">
      <h2 class="search-title">轻松找到您理想的房源</h2>

      <div class="search-box">
        <input type="text" class="search-input" placeholder="请输入小区名称、地址">
        <button class="search-btn">搜索房源</button>
      </div>

      <div class="search-tabs">


        <button
            class="tab-btn"
            :class="{active: tab === '租房'}"
            @click="tab = '租房'"
        >
          租房
        </button>
        <button
            class="tab-btn"
            :class="{active: tab === '二手房'}"
            @click="tab = '二手房'"
        >
          二手房
        </button>
      </div>

      <div class="filters-section">
        <!-- 地区选择部分 -->
        <div class="filter-group">
          <div class="filter-title">选择地区：</div>

          <!-- 大区选择 -->
          <div class="filter-tags">
            <div
                class="filter-tag"
                v-for="region in regions"
                :key="region.name"
                @click="currentRegion = region; selectedProvince = null; selectedCity = null"
                :class="{active: currentRegion?.name === region.name}"
            >
              {{ region.name }}
            </div>
          </div>

          <!-- 省份选择 -->
          <div v-if="currentRegion" class="filter-tags" style="margin-top: 15px">
            <div
                class="filter-tag"
                v-for="province in currentRegion.provinces"
                :key="province.name"
                @click="selectedProvince = province; selectedCity = null"
                :class="{active: selectedProvince?.name === province.name}"
            >
              {{ province.name }}
            </div>
          </div>

          <!-- 城市选择 -->
          <div v-if="selectedProvince" class="filter-tags" style="margin-top: 15px">
            <div
                class="filter-tag"
                v-for="city in selectedProvince.cities"
                :key="city"
                @click="selectedCity = city"
                :class="{active: selectedCity === city}"
            >
              {{ city }}
            </div>
          </div>

          <!-- 显示当前选择 -->
          <div class="selected-region" v-if="currentRegion || selectedProvince || selectedCity">
            <span v-if="selectedCity">已选：{{ selectedProvince.name }} - {{ selectedCity }} - {{selectedPriceRange}}</span>
            <span v-else-if="selectedProvince">已选省份：{{ selectedProvince.name }} - {{selectedPriceRange}}</span>
            <span v-else-if="currentRegion">已选地区：{{ currentRegion.name }} - {{selectedPriceRange}}</span>

          </div>
        </div>
        <!-- 价格选择部分 -->
        <div class="filter-group">
          <div class="filter-title">价格区间：</div>
          <div class="filter-tags">
            <div
                class="filter-tag"
                v-for="price in (tab === '二手房' ? priceRanges : newPriceRanges)"
                :key="price"
                @click="selectedPriceRange = price"
                :class="{active: selectedPriceRange ===price}"

            >
              {{price}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-section {
  background: linear-gradient(135deg, #42b983 0%, #3498db 100%);
  padding: 40px 0;
  margin-bottom: 30px;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-title {
  text-align: center;
  margin-bottom: 30px;
  color: white;
  font-size: 28px;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
}

.search-input {
  flex: 1;
  padding: 18px 25px;
  border: none;
  font-size: 16px;
  outline: none;
  color: #303133;
}

.search-btn {
  padding: 16px 40px;
  background-color: #e6a23c;
  color: white;
  border: none;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.search-btn:hover {
  background-color: #e69129;
}

.search-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.tab-btn {
  padding: 14px 28px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
}

.filters-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 20px;
}

.filter-group {
  margin-bottom: 15px;
}

.filter-title {
  font-size: 15px;
  color: #303133;
  margin-bottom: 12px;
  font-weight: 500;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-tag {
  padding: 6px 18px;
  background: #f5f7fa;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tag:hover,
.filter-tag.active {
  background-color: #409eff;
  color: white;
}

.selected-region {
  margin-top: 12px;
  padding: 8px 12px;
  background: #e6f7ff;
  border-radius: 4px;
  color: #1890ff;
  font-size: 14px;
}

@media (max-width: 992px) {
  .search-box {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
    padding: 16px;
    border-radius: 0 0 4px 4px;
  }

  .filter-tags {
    justify-content: center;
  }
}
</style>