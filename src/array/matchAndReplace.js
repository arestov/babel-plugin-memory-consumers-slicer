const getFunctionName = require('../getFunctionName')

module.exports = (babel, callConstr) => (pluginContext, path) => {
  const t = babel.types

  const { elements } = path.node

  if (elements.length) {
    return
  }

  const funcName = getFunctionName(path)

  const pos = path.node.loc.start

  const postFix = funcName ? `__${funcName}` : ''
  const memoryConstructorName = `CustomMemGroup_line_${pos.line}_column_${pos.column}${postFix}`

  pluginContext.memory_constructors.push({
    type: 'array',
    name: memoryConstructorName,
    els: elements.map(({ key }) => key),
  })

  const expressedCall = callConstr({
    FN_NAME: t.identifier(memoryConstructorName),
  })

  const args = elements.map(({ value }) => t.cloneNode(value))

  expressedCall.expression.arguments = args

  path.replaceWith(expressedCall)
}
