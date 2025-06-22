<template>
  <NavBar />
  <div class="my-rentals-container">
    <div class="header">
      <h1>我的租房记录</h1>
      <div class="header-actions">
        <el-button type="primary" icon="el-icon-refresh" @click="refreshData">刷新数据</el-button>
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-row">
        <el-input v-model="searchQuery" placeholder="搜索地址或小区..." clearable style="width: 300px;">
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="statusFilter" placeholder="租赁状态" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="在租中" value="active"></el-option>
          <el-option label="已结束" value="completed"></el-option>
        </el-select>
        <el-select v-model="sortOption" placeholder="排序方式">
          <el-option label="最新租约优先" value="newest"></el-option>
          <el-option label="最早租约优先" value="oldest"></el-option>
          <el-option label="租金从高到低" value="price_high"></el-option>
          <el-option label="租金从低到高" value="price_low"></el-option>
        </el-select>
      </div>
    </div>

    <!-- 租房记录列表 -->
    <div v-if="filteredRentals.length > 0">
      <div v-for="rental in paginatedRentals" :key="rental.id" class="rental-card">
        <div class="card-header">
          <div class="property-title">{{ rental.propertyName }}</div>
          <div>
            <el-tag :type="rental.status === 'active' ? 'success' : 'info'" class="status-tag">
              {{ rental.status === 'active' ? '在租中' : '已结束' }}
            </el-tag>
          </div>
        </div>

        <div class="card-content">
          <img :src="rental.image" class="property-image" alt="房源图片" />
          <div class="property-details">
            <div class="detail-row">
              <div class="detail-label">地址：</div>
              <div class="detail-value">{{ rental.address }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">租期：</div>
              <div class="detail-value">{{ rental.startDate }} 至 {{ rental.endDate }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">月租金：</div>
              <div class="detail-value">
                <span style="color: #f56c6c; font-weight: 500;">¥{{ rental.monthlyRent.toLocaleString() }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-label">房东：</div>
              <div class="detail-value">{{ rental.landlord }} ({{ rental.landlordPhone }})</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">备注：</div>
              <div class="detail-value">{{ rental.notes || '无' }}</div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="action-buttons">
            <el-button type="warning" icon="el-icon-warning" @click="openComplaintDialog(rental)">投诉</el-button>
            <el-button type="primary" icon="el-icon-tools" @click="openRepairDialog(rental)">维修</el-button>
            <el-button type="info" icon="el-icon-document" @click="viewContract(rental)">查看合同</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <el-icon><house /></el-icon>
      </div>
      <div class="empty-text">暂无租房记录</div>
      <el-button type="primary" icon="el-icon-search" @click="goToRent">去租房</el-button>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredRentals.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
      >
      </el-pagination>
    </div>

    <!-- 投诉对话框 -->
    <el-dialog title="提交投诉" v-model="complaintDialogVisible" width="600px">
      <div class="complaint-form">
        <el-form :model="complaintForm" label-width="80px">
          <el-form-item label="房源信息">
            <div>{{ currentRental.propertyName }} - {{ currentRental.address }}</div>
          </el-form-item>
          <el-form-item label="投诉类型" required>
            <el-select v-model="complaintForm.type" placeholder="请选择投诉类型">
              <el-option label="房东问题" value="landlord"></el-option>
              <el-option label="房屋问题" value="property"></el-option>
              <el-option label="费用纠纷" value="payment"></el-option>
              <el-option label="其他问题" value="other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投诉内容" required>
            <el-input
                type="textarea"
                v-model="complaintForm.content"
                placeholder="请详细描述您的问题"
                :rows="4"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传凭证">
            <el-upload
                action="#"
                list-type="picture-card"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :auto-upload="false"
                multiple
            >
              <el-icon><plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="complaintDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitComplaint">提交投诉</el-button>
      </template>
    </el-dialog>

    <!-- 维修对话框 -->
    <el-dialog title="提交维修申请" v-model="repairDialogVisible" width="600px">
      <div class="repair-form">
        <el-form :model="repairForm" label-width="80px">
          <el-form-item label="房源信息">
            <div>{{ currentRental.propertyName }} - {{ currentRental.address }}</div>
          </el-form-item>
          <el-form-item label="维修类型" required>
            <el-select v-model="repairForm.type" placeholder="请选择维修类型">
              <el-option label="水电维修" value="plumbing"></el-option>
              <el-option label="家电维修" value="appliance"></el-option>
              <el-option label="家具维修" value="furniture"></el-option>
              <el-option label="房屋结构" value="structure"></el-option>
              <el-option label="其他维修" value="other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题描述" required>
            <el-input
                type="textarea"
                v-model="repairForm.description"
                placeholder="请详细描述需要维修的问题"
                :rows="4"
            ></el-input>
          </el-form-item>
          <el-form-item label="紧急程度">
            <el-radio-group v-model="repairForm.urgency">
              <el-radio label="low">不紧急</el-radio>
              <el-radio label="medium">一般</el-radio>
              <el-radio label="high">紧急</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="预约时间">
            <el-date-picker
                v-model="repairForm.preferredTime"
                type="datetime"
                placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="repairDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRepair">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'MyRent',
  components: {NavBar},
  setup() {
    // 模拟租房数据
    const rentals = ref([
      {
        id: 1,
        propertyName: '三室两厅',
        address: '梅溪湖特色小区3栋403',
        startDate: '2023-06-22',
        endDate: '2024-08-22',
        monthlyRent: 2500,
        landlord: '张先生',
        landlordPhone: '13800138000',
        status: 'active',
        notes: '押一付一',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 2,
        propertyName: '现代城 精装公寓',
        address: '海淀区中关村大街18号现代城B座1208',
        startDate: '2022-08-01',
        endDate: '2023-07-31',
        monthlyRent: 7800,
        landlord: '李女士',
        landlordPhone: '13900139000',
        status: 'completed',
        notes: '已退租，押金已返还',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 3,
        propertyName: '温馨家园 2室1厅',
        address: '西城区金融街甲23号温馨家园5号楼401',
        startDate: '2023-01-10',
        endDate: '2024-01-09',
        monthlyRent: 5500,
        landlord: '王先生',
        landlordPhone: '13700137000',
        status: 'completed',
        notes: '押一付三，水电自付',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
      }
    ])

    // 搜索和筛选
    const searchQuery = ref('')
    const statusFilter = ref('')
    const sortOption = ref('newest')

    // 分页
    const currentPage = ref(1)
    const pageSize = 5

    // 当前操作的租房记录
    const currentRental = ref({})

    // 投诉表单
    const complaintDialogVisible = ref(false)
    const complaintForm = reactive({
      type: '',
      content: '',
      attachments: []
    })

    // 维修表单
    const repairDialogVisible = ref(false)
    const repairForm = reactive({
      type: '',
      description: '',
      urgency: 'medium',
      preferredTime: ''
    })

    // 过滤和排序后的租房记录
    const filteredRentals = computed(() => {
      let result = [...rentals.value]

      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(r =>
            r.propertyName.toLowerCase().includes(query) ||
            r.address.toLowerCase().includes(query)
        )
      }

      // 状态过滤
      if (statusFilter.value) {
        result = result.filter(r => r.status === statusFilter.value)
      }

      // 排序
      if (sortOption.value === 'newest') {
        result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      } else if (sortOption.value === 'oldest') {
        result.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      } else if (sortOption.value === 'price_high') {
        result.sort((a, b) => b.monthlyRent - a.monthlyRent)
      } else if (sortOption.value === 'price_low') {
        result.sort((a, b) => a.monthlyRent - b.monthlyRent)
      }

      return result
    })

    // 计算分页
    const paginatedRentals = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      const end = start + pageSize
      return filteredRentals.value.slice(start, end)
    })

    // 打开投诉对话框
    const openComplaintDialog = (rental) => {
      currentRental.value = rental
      Object.assign(complaintForm, {
        type: '',
        content: '',
        attachments: []
      })
      complaintDialogVisible.value = true
    }

    // 打开维修对话框
    const openRepairDialog = (rental) => {
      currentRental.value = rental
      Object.assign(repairForm, {
        type: '',
        description: '',
        urgency: 'medium',
        preferredTime: ''
      })
      repairDialogVisible.value = true
    }

    // 提交投诉
    const submitComplaint = () => {
      if (!complaintForm.type || !complaintForm.content) {
        ElMessage.warning('请填写投诉类型和内容')
        return
      }
      ElMessage.success('投诉已提交，客服人员将在24小时内联系您')
      complaintDialogVisible.value = false
    }

    // 提交维修
    const submitRepair = () => {
      if (!repairForm.type || !repairForm.description) {
        ElMessage.warning('请填写维修类型和问题描述')
        return
      }
      ElMessage.success('维修申请已提交，我们将尽快安排维修人员')
      repairDialogVisible.value = false
    }

    // 查看合同
    const viewContract = (rental) => {
      ElMessageBox.alert(`查看 ${rental.propertyName} 的租赁合同`, '租赁合同', {
        confirmButtonText: '确定'
      })
    }

    // 刷新数据
    const refreshData = () => {
      ElMessage.info('数据已刷新')
    }

    // 去租房
    const goToRent = () => {
      ElMessage.info('跳转到租房页面')
    }

    // 预览图片
    const handlePreview = (file) => {
      console.log('预览图片', file)
    }
    const handleRemove = (file) => {
      console.log('移除图片', file)
    }

    return {
      rentals,
      searchQuery,
      statusFilter,
      sortOption,
      currentPage,
      pageSize,
      filteredRentals,
      paginatedRentals,
      complaintDialogVisible,
      complaintForm,
      repairDialogVisible,
      repairForm,
      currentRental,
      openComplaintDialog,
      openRepairDialog,
      submitComplaint,
      submitRepair,
      viewContract,
      refreshData,
      goToRent,
      handlePreview,
      handleRemove
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
  background-color: #f5f7fa;
  color: #333;
  padding: 20px;
}

.my-rentals-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 其他CSS保持不变，直接复制全部样式 */

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.header h1 {
  font-size: 24px;
  color: #303133;
  font-weight: 600;
}

.filter-bar {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.filter-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.rental-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid #409eff;
}

.rental-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.property-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.card-content {
  padding: 20px;
  display: flex;
}

.property-image {
  width: 200px;
  height: 150px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 20px;
}

.property-details {
  flex: 1;
}

.detail-row {
  display: flex;
  margin-bottom: 12px;
}

.detail-label {
  width: 100px;
  color: #909399;
  font-size: 14px;
}

.detail-value {
  flex: 1;
  color: #606266;
  font-size: 14px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
  background: #fafbfc;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 60px;
  color: #c0c4cc;
  margin-bottom: 20px;
}

.empty-text {
  color: #909399;
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.complaint-form,
.repair-form {
  padding: 20px;
}

.form-row {
  margin-bottom: 20px;
}
</style>
