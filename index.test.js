const pluginTester = require('babel-plugin-tester')

const path = require('path')
const plugin = require('./index')

pluginTester.default({
  plugin,
  fixtures: path.join(__dirname, 'fixtures'),
})
