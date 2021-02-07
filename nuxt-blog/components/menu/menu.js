export default {
  home: {
    name: '首页',
    path: '/admin',
    icon: 'el-icon-menu'
  },
  contents: {
    name: '内容管理',
    path: '',
    children: [{
      name: '文章列表',
      path: '/admin/article/list',
      icon: 'el-icon-menu'
    },
    {
      name: '文章添加',
      path: '/admin/article/add',
      icon: 'el-icon-menu'
    }
    ]
  }
}
