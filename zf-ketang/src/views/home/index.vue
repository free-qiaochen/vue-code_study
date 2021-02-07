<template>
  <div class="home">
    <HomeHeader v-model="currentCategory" />
    <van-swipe class="my-swipe"
               :autoplay="3000"
               indicator-color="white">
      <van-swipe-item v-for="(s,index) in [1,2,3]"
                      :key="index">
        <!-- <img :src="s" /> -->
        {{s}}
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import HomeHeader from './home-header'
import { createNamespacedHelpers } from 'vuex' //???
import * as Types from '@/store/action-types'
// 这里拿到的都是home模块下的
let { mapState: mapState, mapMutations, mapActions } = createNamespacedHelpers(
  'home'
)
export default {
  computed: {
    currentCategory: {
      get() {
        return 1
      },
      set(value) {
        console.log(value)
      }
    }
  },
  components: {
    HomeHeader
  }
}
</script>

<style lang="scss">
.home {
  width: 750px;
  .my-swipe {
    height: 120px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>