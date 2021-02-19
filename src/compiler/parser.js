// vue2的正则
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名 
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  用来获取的标签名的 match后的索引为1的
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签的 
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配闭合标签的
//           aa  =   "  xxx "  | '  xxxx '  | xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // a=b  a="b"  a='b'
const startTagClose = /^\s*(\/?)>/; //     />   <div/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}

// html字符串模板，进行解析，结果组成一个树结构，栈
function createAstElement (tagName, attrs) {
  return {
    tag: tagName,
    type: 1,
    children: [],
    parent: null,
    attrs,
  }
}

// let root = null; // root需要放在parserHTML里边，外边在遇到有组件时候出bug，返回的根始终是同一个？？
let stack = []

function end (tagName) {
  let last = stack.pop()
  if (last.tag !== tagName) {
    throw new Error('标签嵌套错误！', tagName)
  }
}
function chars (text) {
  text = text.replace(/\s/g, '');
  let parent = stack[stack.length - 1]
  if (text) {
    parent.children.push({
      type: 3,
      text
    })
  }
}
/**
 * html-->
 * @param {*} html 
 */
export function parserHTML (html) {

  let root = null;
  function start (tagName, attributes) {
    let parent = stack[stack.length - 1]
    let element = createAstElement(tagName, attributes);
    if (!root) {
      root = element;
    }
    if (parent) {
      element.parent = parent;  // 记录父元素是谁
      parent.children.push(element) // 树结构存储父子节点
    }
    stack.push(element);
  }
  function advance (len) {
    html = html.substring(len)
  }
  function parseStartTag (tag) {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let end;
      let attr;
      // 如果没遇到标签结尾就不停前进往下解析：
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
        advance(attr[0].length)
      }
      if (end) {
        advance(end[0].length)
      }
      return match;
    }
    return false; // 不是开始标签
  }
  while (html) {  // 遍历html字符串模板，一直解析(解析过的删掉)，构造ast语法树
    let textEnd = html.indexOf('<');
    if (textEnd == 0) { // ??
      const startTagMatch = parseStartTag(html);  // 解析开始标签
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue;
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue;
      }
    }
    let text;
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      chars(text)
      advance(text.length)
    }
  }

  return root;
}