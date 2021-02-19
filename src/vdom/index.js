import { isReservedTag, isObject } from "../utils"

export function createElement (vm, tag, data = {}, ...children) {
  console.log(tag, data)
  if (isReservedTag(tag)) {

    return vnode(vm, tag, data, data.key, children, undefined)
  } else {
    const Ctor = vm.$options.components[tag]  // 组件的构造函数
    console.log('component:', tag, Ctor)
    return createComponent(vm, tag, data, data.key, children, Ctor)
  }
}
// 创建组件的虚拟节点，
// 为了区分组件和元素，data.hook / componentOptions
function createComponent (vm, tag, data, key, children, Ctor) {
  // 组件的构造函数，确保得到组件的构造函数Ctor，全局注册的ctor是构造函数，局部组件只是配置对象？
  if (isObject(Ctor)) {
    console.log('Ctor 处理')
    Ctor = vm.$options._base.extend(Ctor);  // Vue.extend()
  }
  console.log(Ctor)
  data.hook = { // 等会儿组件初始化渲染时，需要调用此初始化方法
    init (vnode) {
      // new Ctor => new Sub 会用此选项和组件的配置进行合并
      let vm = vnode.componentInstance = new Ctor({ _isComponent: true })
      debugger
      vm.$mount();  // 组件挂载，挂载完成后会在 vnode.componentInstance.$el => <button>
    }
  }
  return vnode(vm, `vue-component-${tag}`, data, key, undefined, { Ctor, children })
}

export function createTextElement (vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}
function vnode (vm, tag, data, key, children, text, componentOptions) {
  return {
    vm, tag, data, key, children, text, componentOptions//...
  }
}