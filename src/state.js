
import { isFunction } from './utils'
import { observe } from './observer/index'
import Watcher from './observer/watcher';
import Dep from './observer/dep';


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
    initComputed(vm, opts.computed)
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

// ---computed----
function initComputed (vm, computed) {
  const watchers = vm._computedWatchers = {};
  for (const key in computed) {
    // 校验
    const userDef = computed[key]
    // 依赖的属性变化就重新取值 get
    let getter = typeof userDef == 'function' ? userDef : userDef.get;
    // 每个计算属性本质是watcher
    // 将watcher 和属性做一个映射；
    watchers[key] = new Watcher(vm, getter, () => { }, { lazy: true }); // 默认不执行
    // 将key定义在vm上
    defineComputed(vm, key, userDef)
  }
}

function createComputedGetter (key) {
  return function computedGetter () { // 取计算属性的值，走的是这个函数
    // this._computedWatchers 包含着所有计算属性
    // 通过key可以拿到对应watcher，这个watcher中包含了getter
    let watcher = this._computedWatchers[key]
    if (watcher.dirty) {  // 依据dirty属性，来判断是否需要重新求值
      watcher.evaluate(); // 执行this.get()
    }
    // 如果当前取完值后，Dep.target还有值，需要继续向上收集？？？
    if (Dep.target) { // 计算属性内部依赖两个dep：firstName,lastName
      watcher.depend();// watcher里对应了多个dep，watcher上新加depend方法，
    }
    console.log('---computed,key:',key,watcher.value)
    return watcher.value
  }
}

function defineComputed (vm, key, userDef) {
  let sharedProperty = {}
  if (typeof userDef == 'function') {
    sharedProperty.get = userDef;
  } else {
    sharedProperty.get = createComputedGetter(key);
    sharedProperty.set = userDef.set; // 用户的set触发
  }
  Object.defineProperty(vm, key, sharedProperty); // computed本质也是利用defineProperty
}