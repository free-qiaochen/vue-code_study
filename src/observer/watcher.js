import { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./scheduler";

let id = 0
// new Watcher(vm,updateComponent,()=>{
//   console.log('更新视图了')
// },true); 

class Watcher {
  constructor(vm, expressOrFn, cb, options) {
    this.vm = vm;
    this.expOrFn = expressOrFn;
    // ---watch，computed新加属性---
    this.user = !!options.user;// 是否是用户watcher，
    this.lazy = !!options.lazy;
    this.dirty = options.lazy; // 如果是计算属性的watcher，默认lazy:true,dirty:true;
    this.cb = cb;
    this.options = options;
    this.id = id++
    if (typeof expressOrFn === 'string') {
      // 是字符串时（watch的key），将表达式转化为函数
      this.getter = function () {
        // 当我取数据值时，会进行依赖收集；（age.n;vm['age.n'] -> vm['age']['n']）
        let path = expressOrFn.split('.')
        let obj = vm;
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        console.log('watch obj:', obj)
        return obj; // getter方法？？？
      }
    } else {
      // 默认初始化实例时，需要updateComponent函数执行，里边会走render和update，render会去vm上取值
      this.getter = expressOrFn;
    }
    this.deps = []; // 用来存放dep
    this.depsId = new Set();
    // 初始化，走get方法; 存value作为watch的oldValue
    this.value = this.lazy ? undefined : this.get();
  }
  get () {  // 稍后更新时，可以重新调用getter方法，
    // defineProperty.get,每个属性都可以收集自己的watcher，
    // 希望一个属性可以对应多个watcher，同时一个watcher可以对应多个属性
    pushTarget(this); // Dep.target=watcher
    // console.log('run更新！');
    const value = this.getter.call(this.vm);  // 调用vm._update(vm._render());render（）方法，会去vm上取值，
    popTarget();  // Dep.target = null,如果Dep.target有值，说明在Watcher中使用了，（页面用到了）
    console.log('watcher 中get的value：', value)
    // value 在computed的watcher中有返回值
    return value
  }
  update () {// vue中的更新操作是异步的，
    console.log('调用update了')
    if (this.lazy) {  // 走到update说明依赖变了
      this.dirty = true
    } else {
      // this.run()
      queueWatcher(this);// 多次调用update,希望先将watcher缓存下来，等同步代码结束后批量更新
    }
  }
  run () {  //??
    let newValue = this.get();
    let oldValue = this.value;
    this.value = newValue;  // 为了保证下一次更新时，上一次的最新值是下一次的老值
    if (this.user) {  // user Watcher ，执行用户回调cb
      this.cb.call(this.vm, newValue, oldValue)
    }

  }
  addDep (dep) {
    let id = dep.ids;
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep) // watcher存dep
      dep.addSub(this); // dep 存watcher（调用dep的方法）
    }
  }
  evaluate () {
    this.dirty = false; // 为false表示取过值了
    this.value = this.get();  // 用户的getter执行
  }
  depend () {
    let i = this.deps.length;
    console.log('watcher dependLength:', i)
    while (i--) {
      this.deps[i].depend(); //lastName，firstName收集渲染watcher
    }
  }
}

export default Watcher
/**
 * teacher comment
 *
// watcher 和 dep
// 我们将更新的功能封装了一个watcher
// 渲染页面前，会将当前watcher放到Dep类上
// 在vue中页面渲染时使用的属性，需要进行依赖收集 ，收集对象的渲染watcher
// 取值时，给每个属性都加了个dep属性，用于存储这个渲染watcher （同一个watcher会对应多个dep）
// 每个属性可能对应多个视图（多个视图肯定是多个watcher） 一个属性要对应多个watcher
// dep.depend() => 通知dep存放watcher => Dep.target.addDep() => 通知watcher存放dep
// 双向存储
 */