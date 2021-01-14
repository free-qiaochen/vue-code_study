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