const modules = {}
// require.context是webpack内置的
const files = require.context('.', true, /\.js$/)
files.keys().forEach(key => {
  const path = key.replace(/\.\/|\.js/g, '')
  if (path === 'index') return
  let [namespace, type] = path.split('/')
  if (!modules[namespace]) {
    modules[namespace] = {
      namespaced: true,  // 都增加了命名空间
    }
  }
  modules[namespace][type] = files(key).default;  // 文件导出的结果

})
console.log(modules)
export default modules;