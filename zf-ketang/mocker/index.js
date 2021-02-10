const fs = require('fs');
const path = require('path');

const MockDir = path.resolve(__dirname, './')
const dir = fs.readdirSync(MockDir)
const filterDir = dir.filter(item => !item.includes('index'))

const mock = {};
filterDir.forEach(file => {
  Object.assign(mock, require(path.resolve(__dirname, file)))
})

module.exports = mock;