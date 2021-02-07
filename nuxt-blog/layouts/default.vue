<template>
  <div>
    <header v-if="hasNav">
      <div class="hello">
        hello nuxt
      </div>
      <nav class="nav">
        <nuxt-link class="nav-item"
                   to="/">
          首页
        </nuxt-link>
        <nuxt-link class="nav-item"
                   to="/about">
          我的
        </nuxt-link>
        <nuxt-link class="nav-item"
                   to="/category">
          分类
        </nuxt-link>
        <nuxt-link class="nav-item"
                   to="/admin">
          admin
        </nuxt-link>
      </nav>
    </header>

    <Nuxt />
  </div>
</template>
<script>
export default {
  middleware() {
    console.log('layouts')
  },
  computed: {
    hasNav() {
      return this.$route.path !== '/login' && this.$route.path !== '/reg'
    }
  }
}
</script>
<style lang="scss">
header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  .hello {
    font-size: 20px;
  }
  .nav {
    .nav-item {
      margin: 0 20px;
      font-weight: bold;
    }
  }
}
</style>
