<template>
  <div class="wrapper">
    <div class="home-header">
      <img src="@/assets/logo.png"
           alt="">
      <van-dropdown-menu>
        <van-dropdown-item :value="value"
                           :options="categories"
                           @change="change"></van-dropdown-item>
      </van-dropdown-menu>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        { text: '全部课程', value: -1 },
        { text: 'node课程', value: 0 },
        { text: 'react课程', value: 1 },
        { text: 'vue课程', value: 2 }
      ]
    }
  },
  props: {
    value: Number
  },
  methods: {
    change(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>

<style lang="scss">
.wrapper {
  padding-top: 60px;
  position: relative;
  z-index: 100;
}
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  line-height: 60px;
  background: $background;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  img {
    width: 40px;
    height: 40px;
  }
}
.van-dropdown-menu__bar {
  height: 60px;
  .van-dropdown-menu__title {
    line-height: 60px;
  }
}
</style>