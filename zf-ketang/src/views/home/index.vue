<template>
  <div class="home">
    <HomeHeader v-model="currentCategory" />
    <van-swipe class="my-swipe"
               :autoplay="3000"
               indicator-color="white">
      <van-swipe-item v-for="(s,index) in slidesImg"
                      :key="index">
        <!-- <img src="@/assets/home/1.jpeg" /> -->
        <img :src="s.url" />
        <!-- {{s}} -->
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import HomeHeader from './home-header'
import {
  createNamespacedHelpers
  // mapActions,
  // mapState,
  // mapMutations
} from 'vuex' //???
import * as Types from '@/store/action-types'
// 这里拿到的都是home模块下的
let { mapState: mapState, mapMutations, mapActions } = createNamespacedHelpers(
  'home'
)
export default {
  computed: {
    ...mapState(['category', 'slides']),
    currentCategory: {
      get() {
        return this.category
      },
      set(value) {
        this[Types.SET_CATEGORY](value)
        console.log(value)
      }
    },
    slidesImg() {
      const urls = []
      this.slides.forEach((i) => {
        urls.push({ url: require(`@/assets/home/${i}.jpeg`) })
      })
      return urls
    }
  },
  components: {
    HomeHeader
  },
  methods: {
    ...mapActions([Types.SET_SLIDES]),
    ...mapMutations([Types.SET_CATEGORY])
  },
  async mounted() {
    if (this.slides.length === 0) {
      try {
        console.log('---')
        await this[Types.SET_SLIDES]() //  不生效????,不要忘记调用
        // await this.$store.dispatch(`home/${Types.SET_SLIDES}`)
        // console.log('after:', this.slides)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
.home {
  width: 750px;
  .my-swipe {
    height: 300px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>