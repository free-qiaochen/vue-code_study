const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}

function genProps (attrs) {// [{name:'xxx',value:'xxx'},{name:'xxx',value:'xxx'}]
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      let styleObj = {};
      attr.value.replace(/([^;:]+)\:[^;:]+/g, function () {
        styleObj[arguments[1]] = arguments[2]
      })
      attr.value = styleObj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}
function gen (el) {
  if (el.type == 1) { // element=1,text=3,
    return generate(el);
  } else {
    let text = el.text;
    if (!defaultTagRE.test(text)) {
      return `_v('${text}')`; // {{}}中的内容
    } else {
      // // 'hello' + arr + 'world'    hello {{arr}} {{aa}} world
      let tokens = []
      let match;
      let lastIndex = defaultTagRE.lastIndex = 0;
      while (match = defaultTagRE.exec(text)) { //看有没有匹配到
        let index = match.index;  // 开始索引
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}
function genChildren (el) {
  let children = el.children; // 获取子元素children
  if (children) {
    return children.map(c => gen(c)).join(',')
  }
  return false;
}
export function generate (el) {
  // 遍历ast语法树，拼接成代码字符串
  let children = genChildren(el);
  let code = `_c('${el.tag}',${el.attrs.length ? genProps(el.attrs) : 'undefined'
    }${children ? `,${children}` : ''
    })`
  return code
}
// code

//         return _c('div',
//             {
//                 id: "app", a: "1",
//                 style: { "color": 0, "background": 10 }
//             },
//             _v("hello" + _s(arr) + "world"),
//             _c('p', undefined, _v('111'))
//         )
