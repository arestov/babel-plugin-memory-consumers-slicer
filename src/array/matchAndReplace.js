const constrName = require('../constrName')

module.exports = (babel, callConstr) => (pluginContext, path) => {
  const t = babel.types

  const { elements } = path.node

  if (elements.length) {
    return
  }

  const memoryConstructorName = constrName('Array', path, pluginContext)

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
