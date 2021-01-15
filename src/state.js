
import { isFunction } from './utils'
import { observe } from './observer/index'
import Watcher from './observer/watcher';


/**
 * $watch 扩展
 * @param {*} Vue 
 */
export function stateMixin (Vue) {
  Vue.prototype.$watch = function (key, handler, options = {}) {
    options.user = true;// 标识是用户写的watcher
    // vm,name,用户回调，options.user
    new Watcher(this, key, handler, options);
  }
}
export function initState (vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {  // computed初始化
    // initComputed(vm, opts.computed)
  }
  if (opts.watch) { // watch 初始化
    initWatch(vm, opts.watch)
  }
}

// 代理，把vm._data.xxx都代理到vm.xx上，方便用户访问操作数据
function proxy (vm, source, key) {
  Object.defineProperty(vm, key, {
    get () {
      return vm[source][key]
    },
    set (newValue) {
      vm[source][key] = newValue
    }
  })
}

function initData (vm) {
  let data = vm.$options.data;  // vm.$el vue内部会对属性检测，如果是以$开头，不会进行代理
  // vue2中会将data中的所有数据进行劫持（object.defineProperty）进而实现响应式

  // 这里把vm和data进行关联，通过_data
  data = vm._data = isFunction(data) ? data.call(vm) : data;
  for (const key in data) { // 用户取vm.xxx => vm._data.xxx
    proxy(vm, '_data', key)
  }
  observe(data)
}
function initWatch (vm, watch) {
  for (const key in watch) {
    let handler = watch[key];
    // watch 的几种不同写法
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
function createWatcher (vm, key, handler) {
  return vm.$watch(key, handler)
}
