function isAmdBody(path) {
  const okFunc = path => {
    switch (path.node.type) {
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
        return true
      default: {
        return false
      }
    }
  }

  const func = okFunc(path.parentPath) && path.parentPath

  if (!func) {
    return false
  }

  const funcParent = func.parentPath

  if (funcParent.node.type !== 'CallExpression' || funcParent.node.callee.name !== 'define') {
    return false
  }

  if (funcParent.scope.path.node.type !== 'Program') {
    return false
  }

  return true
}

module.exports = isAmdBody
