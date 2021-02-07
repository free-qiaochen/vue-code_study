<template>
  <div class="login">
    <div class="login-form">
      <div class="login-header">
        <!-- <img src="@/assets/logo.png" alt=""> -->
        <Logo />
      </div>
      <div class="login-info">
        <el-input v-model="username"
                  placeholder="请输入用户名" />
        <el-input v-model="password"
                  type="password"
                  placeholder="请输入用户名" />
      </div>
      <el-button type="primary"
                 @click.native="login">
        登录
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  middleware() {
    console.log('page middleware')
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  created() {
    console.log('created')
  },
  methods: {
    async login() {
      try {
        const r = await this.$store.dispatch('user/set_login', {
          username: this.username,
          password: this.password
        })
        console.log(r)
        this.$router.push('/admin')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
