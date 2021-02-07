export default function ({ $axios, app }) {
  $axios.onRequest((config) => {
    // 获得token每次请求都加上
    const user = app.$cookies.get('user')
    if (user && user.token) {
      // 每次请求后端接口，都携带token，token可以正常拿到数据
      config.headers.authorization = user.token
    }
    return config
  })
  $axios.onResponse((res) => {
    console.log(res)
    if (res.data.er === 0) {
      return Promise.resolve(res.data.data)
    } else {
      return Promise.reject(res)
    }
  })
}
// api接口服务由ssr-server目录提供，目前使用失败！
