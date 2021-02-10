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

module.exports = {
  'GET /api/slider': (req, res) => {
    setTimeout(() => {
      res.status(200).json({
        code: 200,
        message: 'slides list ',
        data: Mock.mock(slidesList)
      })
    }, 2000)
  }
}