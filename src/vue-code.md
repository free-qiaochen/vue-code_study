# vue2.x 简版实现流程

## vue 的使用

```js
let vm = new Vue({
  data() {
    //this = vm
    return {
      arr: { name: 'zf' },
    }
  },
})
vm.$mount('#app')
```

## 1.初始化流程：

```js
//响应式流程： new Vue()-- > this._init(options)-->1.initState(vm)-->initData(vm)-->observe(data)-->new Observer(data)--> observeArray(data),walk(data)/遍历data对象defineReactive(data,key,data[key])-->observe(value)会深层劫持,Object.defineProperty(data,key,handlers)属性劫持--(set中用户新赋值的数据也要observe(newVal)进行响应化处理)---->

// 初次渲染
//数据挂载到模板上：this._init()--有el会自动执行$mount(),否则要手动mount--->2.$mount(el)-->render=compileToFunction(template),mountComponent(vm,el)----->updateComponent()--->vm._update(vm_render()?)---->patch(vm.$el,vnode)---->patch会用vnode来生成真实dom，替换el原本的dom元素！

// --模板编译
// render=compileToFunction(template)模板编译成ast，再到虚拟dom，vnode：
// compileToFunction(template)-->root=parserHTML(template)遍历字符串模板template,正则匹配解析生成ast语法树(root)；---->code= generate(root)生成代码(遍历树，拼接成_c()_s()_v()的字符串)---->render=new Function(`with(this){return ${code}}`)字符串代码加上new和with变成render函数，render函数执行产生虚拟dom；
// vm._update(vm_render())-->patch(vm.$el,vnode)---->patch会用vnode来生成真实dom，替换el原本的dom元素！

// 依赖收集

// watch和computed

// 组件化
```

## 2.更新和依赖收集

- 在没有更新机制前，每次数据变化需要手动 render，update，进行页面全量重渲染

### 创建渲染 Watcher

1. 初始化渲染 Watcher

```js
let updateComponent = () => {
  // 调用render函数，生成虚拟dom
  vm._update(vm._render()) // 后续更新可以调用updateComponent方法
  // 用虚拟dom 生成真实dom
}
new Watcher(vm, updateComponent, () => {}, true)
// 初始化Watcher实例会调用updateComponent(),实现首次渲染；（后续页面需要更新执行updateComponent即可）
// 执行render()生成虚拟dom
// update执行，调用patch()生成真实dom
Vue.prototype._update = function (vnode) {
  const vm = this
  vm.$el = patch(vm.$el, vnode)
}
```

2. 生成虚拟 dom
3. 生成真实 dom 挂载

### 依赖收集

> 每个属性都有一个 dep(初始化时添加的，递归data数据中的对象数据，拦截实现响应式),
> render()函数执行，会取值，触发数据拦截中的get方法，此时该数据的dep进行依赖收集，
> 每个 dep 中存放着 watcher,同一个 watcher 会被多个 dep 所记录，watcher也存放dep形成双向存储，
> 数据变化触发set，通过其dep收集的依赖派发更新，dep.notify();对应收集的watcher批量更新；

1. 在渲染时存储 watcher
2. 对象依赖收集
3. 数组依赖收集

## 更新去抖动，合并 ing

> 依赖(的数据)变化触发对应 dep:dep.notify()，进而触发收集 watcher（可能多个）的 update 进行更新
> 这里 update 处做批量更新策略：queueWatcher(this);多次调用 update,希望先将 watcher 缓存下来，等同步代码结束后批量更新，里边调用了 nextTick

## 3. watch 和 computed

### watch

手写 watch：

1. index.js 中添加 stateMixin(Vue)，扩展$watch 方法，
2. state.js 中 initState 中添加 ininWatch();
3. Watcher 修改 getter 和 run()方法，（数据变化，触发 watcher.run 调用 user 的 cb 回调）

### computed

1. state.js 中添加 initComputed(vm,opts.computed);
   - 遍历 computed 的 key，给每个 key 实例一个 Watcher：new Watcher(vm, getter, () => { }, { lazy: true });
   - // 将 key 定义在 vm 上
     defineComputed(vm, key, userDef)

```js
function initComputed(vm, computed) {
  const watchers = (vm._computedWatchers = {})
  for (const key in computed) {
    // 校验
    const userDef = computed[key]
    // 依赖的属性变化就重新取值 get
    let getter = typeof userDef == 'function' ? userDef : userDef.get
    // 每个计算属性本质是watcher
    // 将watcher 和属性做一个映射；
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true }) // 默认不执行
    // 将key定义在vm上
    defineComputed(vm, key, userDef)
  }
}
function createComputedGetter(key) {
  return function computedGetter() {
    // 取计算属性的值，走的是这个函数
    // this._computedWatchers 包含着所有计算属性
    // 通过key可以拿到对应watcher，这个watcher中包含了getter
    let watcher = this._computedWatchers[key]
    if (watcher.dirty) {
      // 依据dirty属性，来判断是否需要重新求值
      watcher.evaluate() // 执行this.get()
    }
    // 如果当前取完值后，Dep.target还有值，需要继续向上收集？？？
    if (Dep.target) {
      // 计算属性内部依赖两个dep：firstName,lastName
      watcher.depend() // watcher里对应了多个dep，watcher上新加depend方法，
    }
    console.log('---computed,key:', key, watcher.value)
    return watcher.value
  }
}

function defineComputed(vm, key, userDef) {
  let sharedProperty = {}
  if (typeof userDef == 'function') {
    sharedProperty.get = userDef
  } else {
    sharedProperty.get = createComputedGetter(key)
    sharedProperty.set = userDef.set // 用户的set触发
  }
  Object.defineProperty(vm, key, sharedProperty) // computed本质也是利用defineProperty
}
```

2. 修改 watcher.js:添加 evaluate()方法，depend()方法，
   update()方法中给 computed 的 eatcher 添加 dirty 标记为 true(走到 update 说明该 watcher 依赖的数据变化了，set 有新旧值比较)；

3. 修改 dep.js: pushTarget()和 popTarget()对 watcher 的管理，变为栈结构（不再是同一时刻只有单一渲染 watcher 了），在写 watch 时就该有这一步了！

## 6.生命周期和 vue 组件原理

### 生命周期的合并

1. Mixin 原理：在 global-api/index.js 中

```js
export function initGlobalAPI(Vue) {
  Vue.options = {}

  Vue.mixin = function (mixin) {
    // 将属性合并到Vue.options上
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

2. 合并生命周期,存放到数据中（队列？）
3. 调用生命周期

```js
export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}
```

4. 初始化流程中调用生命周期

```js
Vue.prototype._init = function (options) {
  const vm = this
  vm.$options = mergeOptions(vm.constructor.options, options)
  // 初始化状态
  callHook(vm, 'beforeCreate')
  initState(vm)
  callHook(vm, 'created')
  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
}
```

### 组件

组件这个属性 components 的合并，extend()方法

- 全局组件注册，会调用 Vue.extend()方法，返回组件的构造函数(继承 Vue 的原型，合并 options)

> 在 global-api 模块，给 Vue 上注册方法(Vue.component=fn,Vue.extend=fn)

```js
Vue.component = function (id, definition) {
  definition.name = definition.name || id
  definition = this.options._base.extend(definition)
  this.options['components'][id] = definition
}
Vue.extend = function (extendOptions) {
  const Super = this
  const Sub = function VueComponent(options) {
    this._init(options)
  }
  Sub.cid = cid++
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.options = mergeOptions(Super.options, extendOptions) // mergeOptions方法采用策略模式进行合并，组件属性的合并有父子指向__proto__层层查找
  return Sub
}
```

- 局部组件：

#### 组件初始化

#### 组件渲染

## 4.未来组件化开发趋势??:WebComponent

## 5.PWA (Progressive Web Apps)
