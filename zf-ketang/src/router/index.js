import Vue from 'vue'
import VueRouter from 'vue-router'
import loadable from '@/utils/loadable.js'
import hooks from './hooks'
import Home from '../views/home/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/lesson',
    name: 'lesson',
    component: loadable(() => import('@/views/lesson/index.vue'))
  },
  {
    path: '/profile',
    name: 'profile',
    component: loadable(() =>import('@/views/profile/index.vue'))
  },
  {
    path:'/login',
    name: 'login',
    component: loadable(() =>import('@/views/login/index.vue'))
  },
  {
    path:'/reg',
    name:'reg',
    component: loadable(() =>import('@/views/reg/index.vue'))
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

Object.values(hooks).forEach(hook => {
  router.beforeEach(hook)
})

export default router
