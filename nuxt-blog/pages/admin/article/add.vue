<template>
  <div>
    admin add
    <el-input v-model="article.title"
              class="long-input"
              clearable
              placeholder="文章标题" />
    <el-input v-model="article.tag"
              class="long-input"
              clearable
              placeholder="标签,多个用空格隔开" />
    <div v-if="isShowEditor"
         class="editor-container">
      <vue-simplemde ref="markdownEditor"
                     v-model="article.content" />
    </div>
    <el-button class="add-button"
               type="primary">
      添加文章
    </el-button>
  </div>
</template>

<script>
export default {
  components: {
    VueSimplemde: () => import('vue-simplemde')
  },
  data() {
    return {
      isShowEditor: false,
      article: {
        content: '',
        title: '',
        tags: ''
      }
    }
  },
  mounted() {
    // 如果不在mounted中使用可能 会导致 服务端报错
    this.isShowEditor = true
  }
}
</script>

<style lang="scss">
@import 'simplemde/dist/simplemde.min.css';
@import 'font-awesome/css/font-awesome.min.css';

.el-input {
  margin-bottom: 30px;
}
</style>
