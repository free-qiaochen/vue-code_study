import { initGlobalApi } from "./global-api/index";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from './render'
import { stateMixin } from "./state";
function Vue (options) {
  // options 是用户传入的选项
  console.log('options:', options)
  // debugger
  this._init(options);  // 初始化操作
}

// 原型扩展
initMixin(Vue)

renderMixin(Vue)// _render
lifecycleMixin(Vue)  // _update
stateMixin(Vue)  // $watch

// 在类上扩展的Vue.mixin
initGlobalApi(Vue);
export default Vue

// 初次渲染过程：
// init 主要做了状态的初始化（数据劫持对象，数组）
// $mount找render方法，（template->render函数 ：ast->codegenerate-->代码字符串）
// render = with(this)+new Function(codeStr),render方法调用产生虚拟dom，
// 虚拟dom--> 真实dom
// mountComponent -> updateComponent();->vm._update(vm._render())-->patch(vnode),vdom变为真实dom替换；

