
import { arrayMethods } from "./array";
import { isObject } from "../utils";
import Dep from "./dep";


class Observer {
  constructor(data) { // 组件最外层的data一定是对象，对对象中的所有属性 进行劫持

    this.dep = new Dep(); // data（后续的） 可能是对象或者数组，(属性值对应是复杂类型的)上边都有dep属性
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
  observeArray (data) {  //数组：对数组里边的数组以及对象会再次进行劫持，形成递归

    // 如果数组里放的是对象类型，也做了观测，JSON.stringify() 也做了收集一来了？？？？
    data.forEach(item => observe(item))
  }
  walk (data) { // 对象,遍历对象，进行劫持
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }


}

// {arr:[1,2,3]}  ,数组依赖收集(递归)

function dependArray (value) {
  for (let i = 0; i < value.length; i++) {
    let current = value[i]; // current是数组里面的数组 [[[[[]]]]]
    current.__ob__ && current.__ob__.dep.depend();
    if (Array.isArray(current)) {
      dependArray(current);
    }
  }
}
function defineReactive (data, key, value) {
  let childOb = observe(value)  // value如果是对象（普通值会直接返回），会继续递归劫持
  let dep = new Dep();  // 每个属性都有自己的dep（唯一），

  console.log('deficeReactive:key', key)
  Object.defineProperty(data, key, {
    get () {// 取值时我希望将watcher和dep 对应起来
      if (Dep.target) { // 此值是在模板中取值的(在watcher中使用了)
        dep.depend(); // dep和watcher做映射
        if (childOb) {
          childOb.dep.depend(); // 让属性值是数组和对象的也记录watcher
          if (Array.isArray(value)) { //取外层数组要将数组里面的也进行依赖收集
            dependArray(value);
          }
        }
      }
      return value
    },
    set (newVal) {
      // todo:
      if (newVal !== value) {

        observe(newVal) // 如果用户赋值的是一个新对象，需要再次进行劫持
        value = newVal
        dep.notify();// 告诉当前的属性对应dep存放的watcher执行->更新
      }
    }
  })
}
export function observe (data) {
  // 如果是对象（array和object）才观测
  if (!isObject(data)) {
    return;
  }
  if (data.__ob__) {
    return; // 观测过的数据上有__ob__属性，不重复观测
  }
  // 默认最外层的data必须是一个对象，所以data一定会走Observer
  return new Observer(data);
}