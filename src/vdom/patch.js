
export function patch (oldVnode, vnode) {
  if (!oldVnode) {
    // 如果没有el元素，那就直接根据虚拟节点返回真实节点，这里是组件的mount->update->patch
    return createElm(vnode);
  }
  if (oldVnode.nodeType == 1) {
    // 用vnode来生成真实dom，替换原本的dom元素；
    const parentElm = oldVnode.parentNode;  // 父节点(真实dom)
    let elm = createElm(vnode);// 根据虚拟节点，创建元素
    parentElm.insertBefore(elm, oldVnode.nextSibling);
    parentElm.removeChild(oldVnode);
    return elm
  }
}
function createComponent (vnode) {
  let i = vnode.data; // vnode.data.hook.init
  if ((i = i.hook) && (i = i.init)) {
    i(vnode); // 调用init方法，--> new Ctor()实例化组件的构造函数，$mount挂载组件，组件$el上有dom
  }
  if (vnode.componentInstance) {  // 有属性说明子组件new完毕了，并且组件对应的真实DOM挂载到了componentInstance.$el
    return true
  }
}
// 创建真实节点
function createElm (vnode) {
  let { tag, data, children, text, vm } = vnode
  if (typeof tag === 'string') {
    // debugger
    if (createComponent(vnode)) {  // 组件
      // 返回组件对应的真实节点，在下方插入父中
      return vnode.componentInstance.$el;
    }
    vnode.el = document.createElement(tag); // 虚拟节点会有一个el属性，对应真实节点
    children.forEach(child => {
      // 递归子元素dom，组件的dom也会在这里插入父组件中，
      vnode.el.appendChild(createElm(child));
    })
  } else {  // 文本节点
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}