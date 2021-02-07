export default function ({ store, redirect, route }) {
  // 跳转到登录页面
  // 每次刷新页面，会将数据放到vuex中
  const username = store.state.user.username
  if (route.path.startsWith('/admin')) {
    if (!username) {
      redirect('/login')
    }
  } else {
    if (/login/.test(route.path)) {
      if (username) {
        redirect('/admin')
      }
    }
  }
}
