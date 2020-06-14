const pluginTester = require('babel-plugin-tester');

const plugin =  require('./index');

const path = require('path');

pluginTester.default({
  plugin,
  fixtures: path.join(__dirname, 'fixtures')
})
