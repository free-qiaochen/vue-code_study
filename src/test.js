// 题目一：
for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i)
  }, 1000 * i)
}

// 题目二：
var a = 100
function fn () {
  console.log(a)
  var a = 2
}
fn()
console.log(a)

// 题目三：
var names = '爱康'
const obj = {
  names: '国宾',
  age: '16',
  son: {
    names: '体检',
    getName: function () {
      console.log(this.names)
    }
  }
}
function getName () {
  console.log(this.names)
}
let { names: n, age } = obj
console.log(names, n, age)
obj.son.getName()
getName()

// 题目四：
console.log('script start')

async function async1 () {
  await async2()
  console.log('async1 end')
}

async function async2 () {
  console.log('async2 end')
}
async1()

setTimeout(function () {
  console.log('setTimeout')
}, 0)

new Promise((resolve) => {
  console.log('Promise')
  resolve()
})
  .then(function () {
    console.log('promise1')
  })
  .then(function () {
    console.log('promise2')
  })

console.log('script end')
