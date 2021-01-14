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

## 流程：

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

## 更新和依赖收集

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

> 每个属性都要有一个 dep,每个 dep 中存放着 watcher,同一个 watcher 会被多个 dep 所记录

1. 在渲染时存储 watcher
2. 对象依赖收集
3. 数组依赖收集

## 更新去抖动，合并 ing

> 依赖变化触发对应 dep:dep.notify()，进而触发收集 watcher（可能多个）的 update 进行更新
> 这里 update 处做批量更新策略：queueWatcher(this);多次调用 update,希望先将 watcher 缓存下来，等同步代码结束后批量更新，里边调用了 nextTick
