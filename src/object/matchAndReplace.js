const getFunctionName = require('../getFunctionName')

module.exports = (babel, callConstr) => (pluginContext, path) => {
  const t = babel.types

  const { properties } = path.node

  if (
    properties.some(item => {
      return item.type !== 'ObjectProperty' && item.type !== 'StringLiteral'
    })
  ) {
    return
  }

  const funcName = getFunctionName(path)

  const pos = path.node.loc.start

  const postFix = funcName ? `__${funcName}` : ''
  const memoryConstructorName = `CustomMemGroup_line_${pos.line}_column_${pos.column}${postFix}`

  pluginContext.memory_constructors.push({
    name: memoryConstructorName,
    props: properties.map(({ key }) => key),
  })

  const expressedCall = callConstr({
    FN_NAME: t.identifier(memoryConstructorName),
  })

  const args = properties.map(({ value }) => t.cloneNode(value))

  expressedCall.expression.arguments = args

  path.replaceWith(expressedCall)
}
