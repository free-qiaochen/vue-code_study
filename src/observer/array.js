let oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(oldArrayPrototype)

let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice'
]

methods.forEach(method => {
  // 会改变原数组的七个方法，重写，用户调用会走我的自定义逻辑，否则走数组原方法
  arrayMethods[method] = function (...args) { // args是参数列表，arr.push(1,2,3),
    oldArrayPrototype[method].call(this, ...args)  // 执行数组原方法
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.splice(2)
        break;
      default:
        break;
    }
    let ob = this.__ob__; // 根据当前数组获取到observer实例(？？？通过data.__proto__)
    // 如果有新增的内容要进行继续劫持，需要观测数组里的每一项，
    // 更新数组todo...
    if (inserted) {
      ob.observeArray(inserted)
    }
    // 数组派发更新
    ob.dep.notify();
  }
})