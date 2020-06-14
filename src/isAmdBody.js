
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

module.exports = isAmdBody
