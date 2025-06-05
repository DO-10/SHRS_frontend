<script setup>
import { ref, reactive } from 'vue'
import {
  ElButton, ElDialog, ElForm, ElFormItem, ElInput,
  ElRadioGroup, ElRadio, ElDatePicker, ElSelect,
  ElOption, ElSlider, ElProgress, ElUpload,
  ElMessage
} from 'element-plus'
import {
  User, OfficeBuilding, Coin, Document,
  Edit, View, Hide
} from '@element-plus/icons-vue'

// 租户数据
const tenant = reactive({
  id: 'T202307015',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  name: '张明',
  gender: 1,
  birth: '1985-07-23',
  email: 'zhangming@example.com',
  phone: '13800138000',
  idNumber: '110105198507230012',
  address: {
    province: '北京市',
    city: '北京市',
    district: '朝阳区'
  },
  occupation: '软件工程师',
  workUnit: '科技有限公司',
  income: 25000
})

// 头像上传状态
const uploadStatus = ref(null)
const uploadProgress = ref(0)
const uploadError = ref('')
const previewImage = ref(null)

// 编辑对话框状态
const editDialog = reactive({
  visible: false,
  title: '',
  field: '',
  value: null
})

// 性别映射
const genderMap = {
  1: '男',
  2: '女'
}

// 职业选项
const occupations = [
  '软件工程师', '产品经理', '设计师', '教师', '医生',
  '公务员', '销售', '自由职业', '学生', '其他'
]

// 省市区数据
const provinces = ['北京市', '上海市', '广东省', '江苏省', '浙江省']
const cities = {
  '北京市': ['北京市'],
  '上海市': ['上海市'],
  '广东省': ['广州市', '深圳市', '东莞市', '佛山市'],
  '江苏省': ['南京市', '苏州市', '无锡市', '常州市'],
  '浙江省': ['杭州市', '宁波市', '温州市', '绍兴市']
}
const districts = {
  '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区'],
  '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '浦东新区'],
  '广州市': ['天河区', '越秀区', '海珠区', '荔湾区'],
  '深圳市': ['福田区', '罗湖区', '南山区', '宝安区'],
  '南京市': ['玄武区', '秦淮区', '鼓楼区', '建邺区'],
  '杭州市': ['上城区', '下城区', '西湖区', '滨江区']
}

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const isImage = validTypes.includes(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('头像格式错误! 请上传 JPG/PNG/GIF/WEBP 格式的图片')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }

  // 预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)

  return true
}

// 处理头像上传
const handleAvatarUpload = ({ file }) => {
  uploadStatus.value = 'uploading'
  uploadProgress.value = 0
  uploadError.value = ''

  // 模拟上传进度
  const interval = setInterval(() => {
    uploadProgress.value += 10
    if (uploadProgress.value >= 100) {
      clearInterval(interval)

      // 模拟上传完成
      setTimeout(() => {
        tenant.avatar = previewImage.value
        uploadStatus.value = 'success'
        ElMessage.success('头像上传成功！')
      }, 800)
    }
  }, 200)
}

// 恢复默认头像
const resetAvatar = () => {
  tenant.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  previewImage.value = null
  uploadStatus.value = null
  ElMessage.info('已恢复默认头像')
}

// 下载头像
const downloadAvatar = () => {
  const link = document.createElement('a')
  link.href = tenant.avatar
  link.download = 'tenant-avatar.jpg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 打开编辑对话框
const editField = (field) => {
  editDialog.field = field
  editDialog.title = `编辑${getFieldName(field)}`

  // 根据字段类型设置初始值
  if (field === 'address') {
    editDialog.value = {...tenant.address}
  } else {
    editDialog.value = tenant[field]
  }

  editDialog.visible = true
}

// 获取字段中文名
const getFieldName = (field) => {
  const fieldNames = {
    name: '姓名',
    gender: '性别',
    birth: '出生日期',
    email: '电子邮箱',
    phone: '手机号码',
    idNumber: '身份证号',
    address: '联系地址',
    occupation: '职业',
    workUnit: '工作单位',
    income: '月收入'
  }
  return fieldNames[field] || field
}

// 保存编辑结果
const saveEdit = () => {
  if (editDialog.field === 'address') {
    Object.assign(tenant.address, editDialog.value)
  } else {
    tenant[editDialog.field] = editDialog.value
  }
  editDialog.visible = false
  ElMessage.success('信息更新成功')
}

// 格式化收入显示
const formatIncome = (value) => {
  return `¥${value.toLocaleString()}`
}

// 保存所有更改
const saveChanges = () => {
  ElMessage.success('所有更改已保存')
}

// 重置信息
const resetForm = () => {
  ElMessage.info('重置功能已触发')
}
</script>

<template>
  <div class="container">
    <header>
      <h1>
        <el-icon class="header-icon"><User /></el-icon> 租户信息管理系统
      </h1>
      <p>全面管理租户个人信息，支持安全上传头像和敏感信息加密存储</p>
    </header>

    <div class="tenant-card">
      <div class="card-header">
        <h2>
          <el-icon class="header-icon"><Document /></el-icon> 租户个人信息
        </h2>
        <div class="tenant-id">租户ID: {{ tenant.id }}</div>
      </div>

      <div class="card-content">
        <div class="avatar-section">
          <div class="avatar-container">
            <img :src="tenant.avatar" alt="租户头像" class="avatar">
            <div class="upload-progress">
              <el-progress
                  v-if="uploadStatus === 'uploading'"
                  :percentage="uploadProgress"
                  :stroke-width="16"
                  status="success"
                  striped
                  striped-flow
              ></el-progress>

              <div v-if="uploadStatus === 'uploading'" class="upload-status uploading">
                <el-icon class="status-icon"><View /></el-icon> 头像上传中... {{ uploadProgress }}%
              </div>
              <div v-if="uploadStatus === 'success'" class="upload-status success">
                <el-icon class="status-icon"><Coin /></el-icon> 头像上传成功！
              </div>
              <div v-if="uploadStatus === 'error'" class="upload-status error">
                <el-icon class="status-icon"><Hide /></el-icon> {{ uploadError }}
              </div>
            </div>
          </div>

          <el-upload
              class="avatar-upload"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleAvatarUpload"
              accept="image/*"
          >
            <el-button type="primary" class="upload-btn">
              <el-icon class="btn-icon"><Document /></el-icon> 上传新头像
            </el-button>
          </el-upload>

          <div class="avatar-actions">
            <el-button type="info" plain @click="resetAvatar">
              <el-icon class="btn-icon"><View /></el-icon> 恢复默认
            </el-button>
            <el-button type="warning" plain @click="downloadAvatar" :disabled="!tenant.avatar">
              <el-icon class="btn-icon"><Document /></el-icon> 下载头像
            </el-button>
          </div>

          <div class="avatar-preview" :style="{display: previewImage ? 'block' : 'none'}">
            <h3>
              <el-icon><Coin /></el-icon> 头像预览
            </h3>
            <img :src="previewImage" class="preview-image">
          </div>
        </div>

        <div class="info-section">
          <!-- 基本信息 -->
          <div class="info-group">
            <span class="info-label">
              <el-icon><User /></el-icon> 姓名
            </span>
            <div class="info-value">
              {{ tenant.name }}
              <el-icon class="edit-icon" @click="editField('name')"><Edit /></el-icon>
            </div>
          </div>

          <div class="info-group">
            <span class="info-label">
              <el-icon><User /></el-icon> 性别
            </span>
            <div class="info-value">
              {{ genderMap[tenant.gender] || '未设置' }}
              <el-icon class="edit-icon" @click="editField('gender')"><Edit /></el-icon>
            </div>
          </div>

          <div class="info-group">
            <span class="info-label">
              <el-icon><User /></el-icon> 出生日期
            </span>
            <div class="info-value">
              {{ tenant.birth || '未设置' }}
              <el-icon class="edit-icon" @click="editField('birth')"><Edit /></el-icon>
            </div>
          </div>

          <!-- 联系方式 -->
          <div class="info-group">
            <span class="info-label">
              <el-icon><User /></el-icon> 电子邮箱
            </span>
            <div class="info-value">
              {{ tenant.email }}
              <el-icon class="edit-icon" @click="editField('email')"><Edit /></el-icon>
            </div>
          </div>

          <div class="info-group">
            <span class="info-label">
              <el-icon><User /></el-icon> 手机号码
            </span>
            <div class="info-value">
              {{ tenant.phone }}
              <el-icon class="edit-icon" @click="editField('phone')"><Edit /></el-icon>
            </div>
          </div>

          <div class="info-group">
            <span class="info-label">
              <el-icon><User /></el-icon> 身份证号
            </span>
            <div class="info-value">
              {{ tenant.idNumber }}
              <el-icon class="edit-icon" @click="editField('idNumber')"><Edit /></el-icon>
            </div>
          </div>

          <!-- 地址 -->
          <div class="info-group">
            <span class="info-label">
              <el-icon><User /></el-icon> 联系地址
            </span>
            <div class="info-value">
              {{ tenant.address.province }} {{ tenant.address.city }} {{ tenant.address.district }}
              <el-icon class="edit-icon" @click="editField('address')"><Edit /></el-icon>
            </div>
          </div>

          <!-- 职业信息 -->
          <div class="info-group">
            <span class="info-label">
              <el-icon><User /></el-icon> 职业
            </span>
            <div class="info-value">
              {{ tenant.occupation || '未设置' }}
              <el-icon class="edit-icon" @click="editField('occupation')"><Edit /></el-icon>
            </div>
          </div>

          <div class="info-group">
            <span class="info-label">
              <el-icon><User /></el-icon> 工作单位
            </span>
            <div class="info-value">
              {{ tenant.workUnit || '未设置' }}
              <el-icon class="edit-icon" @click="editField('workUnit')"><Edit /></el-icon>
            </div>
          </div>

          <div class="info-group">
            <span class="info-label">
              <el-icon><User /></el-icon> 月收入
            </span>
            <div class="info-value">
              {{ tenant.income ? `¥${tenant.income.toLocaleString()}` : '未设置' }}
              <el-icon class="edit-icon" @click="editField('income')"><Edit /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <el-button type="primary" size="large" @click="saveChanges">
          <el-icon class="btn-icon"><Document /></el-icon> 保存所有更改
        </el-button>
        <el-button type="info" size="large" @click="resetForm">
          <el-icon class="btn-icon"><Document /></el-icon> 重置信息
        </el-button>
      </div>
    </div>

    <div class="stats-section">
      <div class="stat-card">
        <el-icon class="stat-icon"><User /></el-icon>
        <div class="stat-value">42</div>
        <div class="stat-label">当前租户数</div>
      </div>
      <div class="stat-card">
        <el-icon class="stat-icon"><OfficeBuilding /></el-icon>
        <div class="stat-value">18</div>
        <div class="stat-label">管理物业数</div>
      </div>
      <div class="stat-card">
        <el-icon class="stat-icon"><Coin /></el-icon>
        <div class="stat-value">¥126,800</div>
        <div class="stat-label">本月总租金</div>
      </div>
      <div class="stat-card">
        <el-icon class="stat-icon"><Document /></el-icon>
        <div class="stat-value">15</div>
        <div class="stat-label">待处理事务</div>
      </div>
    </div>

    <footer>
      <p>PC租房</p>
    </footer>
  </div>

  <!-- 编辑对话框 -->
  <el-dialog v-model="editDialog.visible" :title="editDialog.title" width="500px">
    <el-form label-width="120px">
      <!-- 姓名编辑 -->
      <el-form-item label="姓名" v-if="editDialog.field === 'name'">
        <el-input v-model="editDialog.value" placeholder="请输入姓名" />
      </el-form-item>

      <!-- 性别编辑 -->
      <el-form-item label="性别" v-if="editDialog.field === 'gender'">
        <el-radio-group v-model="editDialog.value">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 出生日期编辑 -->
      <el-form-item label="出生日期" v-if="editDialog.field === 'birth'">
        <el-date-picker
            v-model="editDialog.value"
            type="date"
            placeholder="选择出生日期"
            value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- 邮箱编辑 -->
      <el-form-item label="电子邮箱" v-if="editDialog.field === 'email'">
        <el-input v-model="editDialog.value" placeholder="请输入电子邮箱" type="email" />
      </el-form-item>

      <!-- 手机编辑 -->
      <el-form-item label="手机号码" v-if="editDialog.field === 'phone'">
        <el-input v-model="editDialog.value" placeholder="请输入手机号码" />
      </el-form-item>

      <!-- 身份证号编辑 -->
      <el-form-item label="身份证号" v-if="editDialog.field === 'idNumber'">
        <el-input v-model="editDialog.value" placeholder="请输入身份证号码" />
      </el-form-item>

      <!-- 地址编辑 -->
      <el-form-item label="联系地址" v-if="editDialog.field === 'address'">
        <div class="address-row">
          <el-select v-model="editDialog.value.province" placeholder="选择省份" style="margin-bottom: 15px; width: 100%">
            <el-option v-for="province in provinces" :key="province" :label="province" :value="province" />
          </el-select>
          <el-select v-model="editDialog.value.city" placeholder="选择城市" style="margin-bottom: 15px; width: 100%">
            <el-option v-for="city in cities[editDialog.value.province] || []" :key="city" :label="city" :value="city" />
          </el-select>
          <el-select v-model="editDialog.value.district" placeholder="选择区县" style="width: 100%">
            <el-option v-for="district in districts[editDialog.value.city] || []" :key="district" :label="district" :value="district" />
          </el-select>
        </div>
      </el-form-item>

      <!-- 职业编辑 -->
      <el-form-item label="职业" v-if="editDialog.field === 'occupation'">
        <el-select v-model="editDialog.value" placeholder="请选择职业" style="width: 100%">
          <el-option v-for="(occupation, index) in occupations" :key="index" :label="occupation" :value="occupation" />
        </el-select>
      </el-form-item>

      <!-- 工作单位编辑 -->
      <el-form-item label="工作单位" v-if="editDialog.field === 'workUnit'">
        <el-input v-model="editDialog.value" placeholder="请输入工作单位" />
      </el-form-item>

      <!-- 收入编辑 -->
      <el-form-item label="月收入" v-if="editDialog.field === 'income'">
        <el-slider
            v-model="editDialog.value"
            :min="0"
            :max="50000"
            :step="500"
            show-input
            :format-tooltip="formatIncome"
        />
        <div style="margin-top: 15px; color: #666; font-size: 15px; text-align: center">
          当前值: {{ formatIncome(editDialog.value) }}
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="editDialog.visible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  min-height: 100vh;
  padding: 20px;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  padding: 30px 0;
  margin-bottom: 30px;
  animation: fadeInDown 0.8s ease-out;
}

header h1 {
  font-size: 2.8rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

header p {
  font-size: 1.2rem;
  color: #5a6a7f;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.tenant-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  margin-bottom: 40px;
  animation: fadeInUp 0.8s ease-out;
  transition: transform 0.3s;
}

.tenant-card:hover {
  transform: translateY(-5px);
}

.card-header {
  background: linear-gradient(90deg, #3498db, #2c3e50);
  color: white;
  padding: 25px 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tenant-id {
  font-weight: 600;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 1.1rem;
}

.card-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 35px;
  padding: 35px;
}

@media (max-width: 900px) {
  .card-content {
    grid-template-columns: 1fr;
  }
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #eee;
  padding-right: 35px;
}

@media (max-width: 900px) {
  .avatar-section {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 35px;
    margin-bottom: 20px;
  }
}

.avatar-container {
  position: relative;
  margin-bottom: 25px;
}

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid #ecf0f1;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.03);
}

.upload-btn {
  margin-top: 15px;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.upload-progress {
  width: 100%;
  margin-top: 15px;
  text-align: center;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.info-group {
  margin-bottom: 20px;
  padding: 20px;
  background: #f9fbfd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s;
}

.info-group:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
}

.info-label {
  display: block;
  font-size: 15px;
  color: #5a6a7f;
  margin-bottom: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-value {
  font-size: 17px;
  font-weight: 500;
  color: #2c3e50;
  padding: 12px 15px;
  background: white;
  border-radius: 10px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.edit-icon {
  color: #3498db;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-icon:hover {
  color: #2980b9;
  transform: scale(1.15);
}

.action-buttons {
  display: flex;
  justify-content: center;
  padding: 25px 0 35px;
  gap: 25px;
  background: #f8fafc;
  border-top: 1px solid #eee;
}

.action-buttons .el-button {
  padding: 14px 35px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-buttons .el-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 18px rgba(0, 0, 0, 0.15);
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s;
  border: 1px solid #eef2f7;
}

.stat-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 48px;
  margin-bottom: 20px;
  color: #3498db;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 17px;
  color: #5a6a7f;
  font-weight: 500;
}

footer {
  text-align: center;
  padding: 40px 0;
  color: #5a6a7f;
  font-size: 15px;
  border-top: 1px solid #e1e8f0;
  margin-top: 50px;
}

.upload-status {
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.uploading {
  background: #e3f2fd;
  color: #1976d2;
}

.success {
  background: #e8f5e9;
  color: #388e3c;
}

.error {
  background: #ffebee;
  color: #d32f2f;
}

.avatar-actions {
  display: flex;
  gap: 12px;
  margin-top: 15px;
}

.avatar-preview {
  border: 2px dashed #3498db;
  border-radius: 12px;
  padding: 15px;
  margin-top: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 10px;
}

.header-icon {
  width: 1.5em;
  height: 1.5em;
}

.btn-icon {
  margin-right: 8px;
}

.status-icon {
  margin-right: 8px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>