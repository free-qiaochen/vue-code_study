export const actions = {
  nuxtServerInit (store, { $axios, app }) { // @nuxtjs/axios  同步数据到vuex中
    const userInfo = app.$cookies.get('user')
    console.log(userInfo)
    if (userInfo) {
      if (true) {
        store.commit('user/set_user', userInfo)
      } else {
        app.$cookies.remove('user')
      }
    }
  }
}
