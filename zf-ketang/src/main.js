import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'

import "lib-flexible" // 对应设置根字体大小


// 指令
import directives from '@/utils/directives';

// keys values entries
Object.entries(directives).forEach(([id, define]) => {
  console.log(id, define)
  Vue.directive(id, define);
})

// 过滤器？？？

Vue.config.productionTip = false
Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
