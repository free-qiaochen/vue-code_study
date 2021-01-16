export function isFunction (val) {
  return typeof val === 'function'
}

export function isObject (val) {
  return typeof val === 'object' && val !== null
}

const callbacks = []
function flushCallbacks () {
  callbacks.forEach(cb => cb())
  waiting = false
}
let waiting = false
export function nextTick (cb) {
  callbacks.push(cb);
  if (!waiting) {
    // timer(flushCallbacks)
    setTimeout(flushCallbacks, 0); // 需要考虑setTimeout的兼容问题
    waiting = true
  }
}

let lifeCycleHooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
]
let strats = {}; // 存放各种策略

//   {}     {beforeCreate:Fn} => {beforeCreate:[fn]}
//   {beforeCreate:[fn]}    {beforeCreate:fn}   => {beforeCreate:[fn,fn]}

function mergeHook (parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);  // 后续
    } else {
      return [childVal];  // 第一次
    }
  } else {
    return parentVal
  }
}
lifeCycleHooks.forEach(hook => {
  strats[hook] = mergeHook
})

// strats.components = function (parentVal, childVal) {
//   // Vue.options.components
//   let options = Object.create(parentVal);// 根据父对象构造一个新对象 options.__proto__= parentVal
//   if (childVal) {
//     for (let key in childVal) {
//       options[key] = childVal[key]; // 直接用子的赋值，子指向父
//     }
//   }
//   return options
// }

// 合并options,可能是data，method，生命周期等，不同选项有不同的合并策略
export function mergeOptions (parent, child) {
  const options = {}; // 合并后的结果
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (parent.hasOwnProperty(key)) {
      continue;
    }
    mergeField(key)
  }
  function mergeField (key) {
    let parentVal = parent[key];
    let childVal = child[key];
    // 策略模式
    if (strats[key]) {
      // 
      options[key] = strats[key](parentVal, childVal);
    } else {
      if (isObject(parentVal) && isObject(childVal)) {//父子都有
        options[key] = { ...parentVal, ...childVal }
      } else {
        // 父有，子没有
        options[key] = parent[key]
        // options[key] = child[key] || parent[key];
      }
    }
  }
  return options
}