import { parserHTML } from './parser'
import { generate } from './generate'
/**
 * 把template模板解析为ast语法树，
 * 生成代码字符串
 * 转化为render函数
 * @param {*} template 
 */
export function compileToFunction (template) {
  let root = parserHTML(template) // 模板解析成ast语法树

  // ast生成代码字符串
  let code = generate(root)
  // render函数(new Function + with,将code串转为render函数)
  let render = new Function(`with(this){return ${code}}`)

  console.log('render:', render)
  return render
}
// render函数
// function() {
//     with (this) {
//         return _c('div',
//             {
//                 id: "app", a: "1",
//                 style: { "color": 0, "background": 10 }
//             },
//             _v("hello" + _s(arr) + "world"),
//             _c('p', undefined, _v('111'))
//         )
//     }
// }
