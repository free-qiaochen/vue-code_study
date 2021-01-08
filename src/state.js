
import { isFunction } from './utils'
import { observe } from './observer/index'

export function initState (vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
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