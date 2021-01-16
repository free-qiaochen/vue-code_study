import Watcher from './observer/watcher';
import { patch } from './vdom/patch'
export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;  // 既有初始化，又有更新
    vm.$el = patch(vm.$el, vnode) // patch后把真实dom写在vm的$el属性上
  }
  Vue.prototype.$nextTick = 'nulls'
}
// 后续每个组件渲染的时候都会有一个Watcher
export function mountComponent (vm, el) {
  // 更新函数 数据变化后，会再次调用此函数
  let updateComponent = () => {
    // 调用render函数，生成虚拟dom
    vm._update(vm._render()); // 后续更新可以调用updateComponent方法
    // _update()执行调用patch，用虚拟dom生成真实dom
  }
  callHook(vm, 'beforeMount')
  // updateComponent() // 初始化和更新都走这里
  // 使用观察者模式（实现更新）：data属性是“被观察者”，页面更新是“观察者”；
  new Watcher(vm, updateComponent, () => {
    console.log('更新视图了！')
  }, true)  // 这是一个渲染Watcher，后续有其他类型Watcher
  callHook(vm, 'mounted')
}

// 
export function callHook (vm, hook) {
  let handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}