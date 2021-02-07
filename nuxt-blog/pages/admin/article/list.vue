<template>
  <div>
    <li v-for="(l,index) in list"
        :key="index">
      <nuxt-link :to="{name:'detail-uid',params:{uid:l._id}}">
        {{ l.title }}
      </nuxt-link>
    </li>
  </div>
</template>
<script >
export default {
  async asyncData({ $axios }) {
    // 接口服务暂时有问题
    // const { list } = await $axios.get('/api/article')
    // return { list }
  },
  data() {
    return {
      list: [
        {
          title: '11',
          _id: '1'
        },
        {
          title: '22',
          _id: '2'
        },
        {
          title: '33',
          _id: '3'
        }
      ]
    }
  }
}
</script>
<!-- vue3  (validate fetch) 个性配置  seo优化   -->

<style lang="scss" scoped>
div {
  color: $color;
}
</style>
