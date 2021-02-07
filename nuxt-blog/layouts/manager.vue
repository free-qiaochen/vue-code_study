<template>
  <div>
    <el-container>
      <el-header>
        <div @click="goHome">
          manager header:{{ '$store.state.user.username' }}
        </div>
      </el-header>
      <el-container>
        <el-aside>
          <Menu />
        </el-aside>
        <el-main>
          <Nuxt />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Menu from '@/components/menu/index.vue'
export default {
  components: {
    Menu
  },
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>
