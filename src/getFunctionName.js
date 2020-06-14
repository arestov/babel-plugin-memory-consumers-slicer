
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

module.exports = getFunctionName
