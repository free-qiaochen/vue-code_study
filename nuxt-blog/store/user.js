export const state = () => {
  return {
    username: null,
    token: null // 每次发送ajax的时候，要验证token的正确性
  }
}
export const mutations = {
  set_user (state, payload) {
    state.username = payload.username
    state.token = payload.token
  }
}
export const actions = {
  async set_login ({ commit }, payload) {
    // const userInfo = await this.$axios.post('/api/login', payload)
    const userInfos = await setTimeout(() => Promise.resolve({ username: '小明', token: 'token' }), 1000)
    const userInfo = { username: '小明', token: 'token' }
    commit('set_user', userInfo) // 不会持久化，刷新丢失
    console.log('set_user', userInfo, userInfos)
    // 服务端和客户端都可以使用
    this.app.$cookies.set('user', userInfo) // 存到浏览器中
  }
}
