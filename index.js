const isAmdBody = require('./src/isAmdBody')
const getFunctionName = require('./src/getFunctionName')

function docs(path) {
  if (false && path) {
    // console.log(path.constructor.prototype)
  }
}

function docBabel(bab) {
  if (false && bab) {
    // console.log('babel', Object.keys(bab))
  }
}

module.exports = function logger(babel) {
  docBabel(babel)

  const t = babel.types

  const makeConstr = babel.template`
    function FN_NAME() {
    }
  `

  const callConstr = babel.template`
    new FN_NAME()
  `

  const makeProp = babel.template`
    this.prop = arg
  `

  return {
    name: 'mem',
    pre() {
      this.memory_constructors = []
    },
    post(root) {
      const pluginContext = this

      const list = pluginContext.memory_constructors
      if (!list.length) {
        return
      }

      function insertTo(path, list) {
        if (pluginContext.list_injected) {
          return
        }
        pluginContext.list_injected = true
        // eslint-disable-next-line no-plusplus
        for (let i = list.length - 1; i >= 0; i--) {
          const item = list[i]

          const constr = makeConstr({
            FN_NAME: t.identifier(item.name),
          })

          const params = item.props.map((_, i) => {
            return t.identifier(`arg${i}`)
          })

          const props = item.props.map((sourceProp, i) => {
            const prop = makeProp()
            prop.expression.left.property = sourceProp
            prop.expression.right = t.identifier(`arg${i}`)
            return prop
          })

          constr.params = params
          constr.body.body = props

          path.unshiftContainer('body', constr)
        }
      }

      root.path.traverse({
        BlockStatement: {
          enter: path => {
            if (pluginContext.list_injected) {
              return
            }

            if (!isAmdBody(path)) {
              return
            }

            insertTo(path, list)
          },
        },
      })

      insertTo(root.path, list)

      pluginContext.memory_constructors = null
      pluginContext.list_injected = null
    },
    visitor: {
      ObjectExpression: {
        exit(path, pluginContext) {
          docs(path)

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
        },
      },
    },
  }
}
