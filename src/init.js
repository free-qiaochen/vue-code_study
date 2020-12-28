import { initState } from "./state";



export function initMixin (Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    vm.$options = options;  // 后面会对options进行扩展操作
    // 数据初始化：
    initState(vm);  // 劫持vm.$options.data
    if (vm.$options.el) {
      // 将数据挂载到这个模板上（el对应节点）
      vm.$mount(vm.$options.el)
    }

  }
  Vue.prototype.$mount = function(el) {
    const vm = this;
    const options = vm.$options
    el = document.querySelector(el)
    vm.$el = el
    if(!option.render){
      let template = options.template
      if (!template && el) {
        template = el.outerHTML;
        let render = compileToFunction(template)
        options.render = render
      }
    }
    // 
    mountComponent(vm,el) // 组件的挂载流程
  }
}