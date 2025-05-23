<template>
  <div class="login-container">
    <el-card class="login-box">
      <h2 class="title">房屋租赁系统</h2>
      <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          @submit.native.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
              v-model="loginForm.username"
              prefix-icon="el-icon-user"
              placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              type="password"
              placeholder="请输入密码"
              show-password
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              native-type="submit"
              class="login-btn"
          >
            立即登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          try {
            const res = await this.$http.post('/login', this.loginForm)
            if (res.code === 200) {
              this.$store.commit('SET_USER', res.data)
              this.$router.push('/dashboard')
            }
          } catch (error) {
            this.$message.error(error.response?.data?.message || '登录失败')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}

.login-box {
  width: 400px;
  padding: 30px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #409EFF;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}
</style>