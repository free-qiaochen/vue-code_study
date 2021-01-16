import { initState } from "./state";
import { compileToFunction } from './compiler/index'
import { callHook, mountComponent } from "./lifecycle";
import { mergeOptions } from "./utils";


export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    console.log('vm:', vm)
    // vm.$options = options;  // 后面会对options进行扩展操作
    // 注意这里的vm.constructor.options是initGlobalApi()中的(当前组件实例的)options
    vm.$options = mergeOptions(vm.constructor.options, options);

    callHook(vm, 'beforeCreate')
    // 数据初始化：
    initState(vm);  // 劫持vm.$options.data
    callHook(vm, 'created')

    if (vm.$options.el) {
      // 将数据挂载到这个模板上（el对应节点）
      vm.$mount(vm.$options.el)
    }

  }
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options
    el = document.querySelector(el)
    vm.$el = el
    if (!options.render) {
      let template = options.template
      if (!template && el) {// 用户也没有传递template 就取el的内容作为模板
        template = el.outerHTML;
        // 模板template编译为ast语法树，转化为render函数，
        let render = compileToFunction(template);
        options.render = render
      }
    }
    // 
    mountComponent(vm, el) // 组件的挂载流程
  }
}