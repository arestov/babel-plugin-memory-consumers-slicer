var {default: generate} = require("babel-generator");

function docs(path) {
  // console.log(path.constructor.prototype)
}

function docBabel(bab) {
  // console.log('babel', Object.keys(bab))

}

function isAmdBody(path) {

  var okFunc = path => {
    switch (path.node.type) {
      case "FunctionExpression":
      case "ArrowFunctionExpression":
        return true
      default: {
        return false
      }
    }
  }

  var func = okFunc(path.parentPath) && path.parentPath

  if (!func) {
    return
  }

  var funcParent = func.parentPath

  if (funcParent.node.type !== 'CallExpression' || funcParent.node.callee.name !== 'define')  {
    return
  }

  if (funcParent.scope.path.node.type !== 'Program') {
    return
  }

  return true
}

function parentName(path) {
  switch (path.node.type) {
    case "VariableDeclarator":
      return path.node.id.name
    case "ObjectProperty":
      return path.node.key.name
    default:
      return null
  }
}

function getFunctionName(path) {
  var func = path.findParent(path => {
    switch (path.node.type) {
      case "FunctionDeclaration":
      case "FunctionExpression":
      case "ArrowFunctionExpression":
      case "ClassMethod":
        return true
      default: {
        return false
      }
    }
  })
  if (!func) {
    return
  }
  switch (func.node.type) {
    case "FunctionDeclaration":
      return func.node.id.name
    case "ClassMethod":
      return func.node.key.name
    case "FunctionExpression":
      return func.node.id ? func.node.id.name : parentName(func.parentPath)
    case "ArrowFunctionExpression":
      return parentName(func.parentPath)
    default:
      return null
  }
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
      this.memory_constructors = {}
    },
    post(root) {
      var pluginContext = this

      var list = Object.keys(pluginContext.memory_constructors)
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
            FN_NAME: t.identifier(item)
          })
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

          if (path.node.properties.length) {
            return
          }

          var funcName = getFunctionName(path)

          var pos = path.node.loc.start

          const postFix = funcName ? `__${funcName}` : ''
          const memoryConstructorName = `CustomMemGroup_line_${pos.line}_column_${pos.column}${postFix}`

          var constr = makeConstr({
            FN_NAME: t.identifier(memoryConstructorName)
          })

          pluginContext.memory_constructors[memoryConstructorName] = true

          path.replaceWith(callConstr({
            FN_NAME: t.identifier(memoryConstructorName)
          }))

        },
      },
    }
  };
}
