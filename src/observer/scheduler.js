import { nextTick } from "../utils";

let queue = [];
let has = {}; // 做列表的，列表维护存放了哪些Watcher

// 
function flushSchedulerQueue () {
  for (let i = 0; i < queue.length; i++) {
    queue[i].run(); // watcher.run()更新
  }
  // 重置条件
  queue = [];
  has = {};
  pending = false;
}
let pending = false;
// 要等待同步代码执行完毕后，财执行异步逻辑
export function queueWatcher (watcher) {
  const id = watcher.id;  // name和age的id是同一个
  if (has[id] == null) {  // watcher 去重
    queue.push(watcher);
    has[id] = true;
    // 开启一次更新操作，批处理（防抖）
    if (!pending) {
      nextTick(flushSchedulerQueue, 0); // ???待研究
      // setTimeout(flushSchedulerQueue, 0);
      pending = true;
    }
  }
}