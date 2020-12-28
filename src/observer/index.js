import { isObject } from "./utils";
import { arrayMethods } from "./array";


class Observer {
  constructor(data) {
    // data 可能是对象或者数组，
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false, // 不可枚举的
    })
    // data.__ob__ = this;  // 所有劫持过的属性都有__ob__属性
    if (Array.isArray(data)) {
      // 数组的劫持，对数组原来的方法进行改写，切片编程
      data.__proto__ = arrayMethods;
      this.observeArray(data);  // 如果数组里的数据是对象类型，需要监控这个对象的变化
    } else {
      this.walk(data);  // 对象的劫持逻辑
    }
  }
  observeArray (data) {  //数组：对数组里边的数组一级对象会再次进行劫持，形成递归
    data.forEach(item => observe(item))
  }
  walk (data) { // 对象,遍历对象，进行劫持
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }


}
function defineReactive (data, key, value) {
  observe(value)  // value如果是对象（普通值会直接返回），会继续递归劫持
  Object.defineProperty(data, key, {
    get () {
      return value
    },
    set (newVal) {
      // todo:
      observe(newVal) // 如果用户赋值的是一个新对象，需要再次进行劫持
      value = newVal
    }
  })
}

export function observe (data) {
  // 如果是对象才观测
  if (!isObject(data)) {
    return;
  }
  if (data.__ob__) {
    return; // 观测过的数据上有__ob__属性，不重复观测
  }
  // 
  return new Observer(data);
}