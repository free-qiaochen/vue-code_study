let ids = 0
class Dep {// 每个属性都给分配一个dep（new Dep()），dep可以来存放watcher，watcher中也要存放这个dep
  constructor() {
    this.ids = ids++;
    this.subs = []; // 用来存放watcher
  }
  depend () {
    // Dep.target,也就是Watcher，有watcher才手机依赖
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
  addSub (watcher) {
    this.subs.push(watcher);  // dep存watcher（在watcher中触发）
  }
  notify () { // 派发更新，让依赖的多个watcher中的update都执行
    this.subs.forEach(watcher => watcher.update())
  }
}
Dep.target = null;  // 全局唯一
export function pushTarget (watcher) {
  Dep.target = watcher
}
export function popTarget (watcher) {
  Dep.target = null
}

export default Dep