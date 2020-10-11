const constrName = require('../constrName')

module.exports = (babel, callConstr) => (pluginContext, path) => {
  const t = babel.types

  const { properties } = path.node

  if (
    // properties.length ||
    properties.some(item => {
      const notOk = item.type !== 'ObjectProperty' && item.type !== 'StringLiteral'
      if (notOk) {
        return true
      }

      if (item.computed) {
        return true
      }

      if (item.value.type === 'FunctionExpression') {
        return true
      }

      return false
    })
  ) {
    return
  }

  const memoryConstructorName = constrName('Object', path, pluginContext)

  pluginContext.memory_constructors.push({
    type: 'object',
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
