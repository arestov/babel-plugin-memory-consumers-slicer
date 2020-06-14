var {default: generate} = require("babel-generator");
var isAmdBody = require('./src/isAmdBody')
var getFunctionName = require('./src/getFunctionName')

function docs(path) {
  // console.log(path.constructor.prototype)
}

function docBabel(bab) {
  // console.log('babel', Object.keys(bab))

}

module.exports = function logger(babel) {
  docBabel(babel)

  var t = babel.types

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

  var isProgram = function(path) {
    return path.isProgram()
  }


  var getProgram = function(path) {
    var cur = path.findParent(isProgram)
    return cur
  }

  return {
    name: 'mem',
    pre() {
      this.memory_constructors = []
    },
    post(root) {
      var pluginContext = this

      var list = pluginContext.memory_constructors
      if (!list.length) {
        return
      }


      root.path.traverse({
        BlockStatement: {
          enter: (path) => {
            if (pluginContext.list_injected) {
              return
            }

            if (!isAmdBody(path)) {
              return
            }

            insertTo(path, list)
          }
        }
      })

      function insertTo(path, list) {
        if (pluginContext.list_injected) {
          return
        }
        pluginContext.list_injected = true
        for (var i = list.length-1; i >= 0; i--) {
          var item = list[i]


          var constr = makeConstr({
            FN_NAME: t.identifier(item.name),
          })

          var params = item.props.map((_, i) => {
            return t.identifier(`arg${i}`)
          })

          var props = item.props.map((sourceProp, i) => {
            var prop = makeProp()
            prop.expression.left.property = sourceProp
            prop.expression.right = t.identifier(`arg${i}`)
            return prop
          })

          constr.params = params
          constr.body.body = props


          path.unshiftContainer('body', constr);
        }
      }

      insertTo(root.path, list)

      pluginContext.memory_constructors = null
      pluginContext.list_injected = null
    },
    visitor: {
      ObjectExpression: {
        exit(path, pluginContext) {
          docs(path)

          var properties = path.node.properties

          if (properties.some(item => {
            return item.type !== 'ObjectProperty' && item.type !== 'StringLiteral'
          })) {
            return
          }


          var funcName = getFunctionName(path)

          var pos = path.node.loc.start

          const postFix = funcName ? `__${funcName}` : ''
          const memoryConstructorName = `CustomMemGroup_line_${pos.line}_column_${pos.column}${postFix}`

          pluginContext.memory_constructors.push({
            name: memoryConstructorName,
            props: properties.map(({key}) => key),
          })

          var expressedCall = callConstr({
            FN_NAME: t.identifier(memoryConstructorName)
          })

          var args = properties.map(({value}) => t.cloneNode(value))

          expressedCall.expression.arguments = args

          path.replaceWith(expressedCall)

        },
      },
    }
  };
}
