import * as Types from '@/store/action-types'
import { toLogin, validate } from '@/api/user'
import per from '@/router/permission' // 本地权限菜单的全量表
import router from '@/router'

// 路由过滤，
const filterRouter = (authList = []) => {
  authList = authList.map(item => item.auth); // 后台返回的权限list
  // authList = authList // 后台返回的权限list
  function filter (per) {
    let result = per.filter(route => {
      if (authList.includes(route.meta.auth)) {
        if (route.children) { // 嵌套路由，一般不超过三层
          route.children = filter(route.children);
        }
        return route
      }
    })
    return result
  }
  return filter(per)
}

const userActions = {
  async [Types.SET_USER] ({ commit }, { userInfo, has }) {
    commit(Types.SET_USER, userInfo)
    commit(Types.SET_PERMISSION, has)
  },
  async [Types.SET_LOGIN] ({ commit, dispatch }, payload) {
    let userInfo = await toLogin(payload);
    dispatch(Types.SET_USER, { userInfo, has: true });
  },
  async [Types.VALIDATE] ({ commit, dispatch, state }, payload) {
    // 此时需要看一下用户是否登陆过
    if (!localStorage.getItem('token')) {
      return false
    }
    try {
      // axios 里面的请求中增加token，传递到后端中，让他验证去
      let userInfo = await validate();  // 校验是否通过
      dispatch(Types.SET_USER, { userInfo, has: true })
      return true;
    } catch (e) {
      dispatch(Types.SET_USER, { userInfo, has: false })
      return false
    }
  },
  async [Types.ADD_ROUTE] ({ commit, dispatch, state }, payload) {
    // 添加路由
    let authList = state.authList;
    let routes = filterRouter(authList)
    // ???
    let route = router.options.routes.find(item => item.path === '/profile');
    route.children = routes;  // 给某个特定的部分，添加儿子，
    router.addRoutes([route]);  // 使用特定api添加动态路由
    console.log(router, routes)
    commit(Types.SET_MENU_PERMISSION, true)
  }
}

export default userActions;