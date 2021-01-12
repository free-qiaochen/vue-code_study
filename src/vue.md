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
