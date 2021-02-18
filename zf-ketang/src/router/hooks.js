import store from '../store';
import * as Types from '../store/action-types';

export default {
  // 此字段只是给自己看的，没有任何特殊意义
  'clear_token': (to, form, next) => {
    // 可以设置whiteList，切换路由，清除已有进行中的请求
    store.commit(Types.CLEAR_TOKEN);
    console.log('clear request token')
    next()
  },
  'login_permission': async (to, from, next) => {
    // 有些公司 直接 有token就是登录了，没token就是没登录，
    // 用户是否需要登录才能访问的标识；
    let needLogin = to.matched.some(item => item.meta.needLogin)
    if (to.matched.length === 0) {  // fix:未匹配到路由，需要再次登录
      needLogin = true
    }
    console.log('login_permission', needLogin)
    // debugger
    // 如果vuex中有值，我就认为你当前登录过了
    if (!store.state.user.hasPermission) {  // 用户刷新token在，但是vuex中的数据丢失了
      // 返回了一个isLogin字段表示用户是否登陆过了
      let isLogin = await store.dispatch(`user/${Types.VALIDATE}`)
      if (needLogin) {  // 需要登录的页面
        if (!isLogin) { // 未登录，跳到登录页
          next('/login')
        } else {
          next(); // 已登录直接跳转
        }
      } else {  // 不需要登录
        if (to.name === 'login') {  // 访问的是登录页面
          if (!isLogin) {
            next()
          } else {  // 已登录，再访问登录页，直接跳转到个人中心
            next('/profile')
          }
        } else {
          next()
        }
      }
    } else {  // vuex中有值(未刷新页面)，代表已登录
      if (to.name === 'login') {
        next('/profile');
      } else {
        next()
      }
    }
    // next()
  },
  'menu-permission': async (to, from, next) => {
    // 这里需要对权限进行处理，动态的添加路由
    if (store.state.user.hasPermission) { // 用户已登录
      console.log('menuPermission', store.state.user.hasPermission, store.state.user.menuPermission)
      // debugger
      if (!store.state.user.menuPermission) { // 无菜单权限，才需要处理
        console.log('add route')
        await store.dispatch(`user/${Types.ADD_ROUTE}`);// 路由动态加载，此时组件时异步加载 ()=>  我希望等待组件加载完毕后跳转过去
        next({ ...to, replace: true }); // 页面重新跳了一次 组件也ok了 hack /home
      } else {
        next()
      }
    } else {
      next()
    }
    next()
  }
}