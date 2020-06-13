const pluginTester = require('babel-plugin-tester');

const plugin =  require('./new-hack');

const path = require('path');

pluginTester.default({
  plugin,
  fixtures: path.join(__dirname, 'fixtures')
})
