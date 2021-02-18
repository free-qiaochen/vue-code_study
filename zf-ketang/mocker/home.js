const Mock = require('mockjs')
const delayData = (data, time = 1500) => (req, res) => {
  setTimeout(() => {
    res.json(data);
  }, time)
}

const response = {
  success: function (data = '') {
    return {
      code: 200,
      message: '操作成功',
      data
    }
  },
  fail: function (message) {
    return {
      code: 0,
      message
    }
  }
}

// const slidesList = [
//   { url: '@/assets/home/1.jpeg' },
//   { url: '@/assets/home/2.jpeg' },
//   { url: '@/assets/home/3.jpeg' },
//   { url: '@/assets/home/4.jpeg' },
//   { url: '@/assets/home/5.jpeg' }
// ]
const slidesList = [1, 2, 3, 4, 5]
const authList = [
  {
    path: '/profile/student-manager',
    name: 'student',
    auth: 'student'
  },
  {
    path: '/profile/lesson-manager',
    name: 'lesson',
    auth: 'lesson'
  },
  {
    path: '/profile/points',
    name: 'points',
    auth: 'points'
  }
]

module.exports = {
  'GET /api/slider': (req, res) => {
    setTimeout(() => {
      res.status(200).json({
        code: 200,
        message: 'slides list ',
        data: Mock.mock(slidesList)
      })
    }, 2000)
  },
  'POST /api/login': (req, res) => {
    console.log('req:', req)
    const data = {
      token: 'testToken',
      username: req.body.username,
      authList: authList
    }
    res.status(200).json(response.success(data))
  },
  'GET /api/validate': (req, res) => {
    console.log('req:', req)
    const data = {
      token: 'testToken',
      // username: req.body.username,
      authList: authList
    }
    res.status(200).json(response.success(data))
  }
}