module.exports = (babel, makeConstr, makeProp) => item => {
  const t = babel.types

  const constr = makeConstr({
    FN_NAME: t.identifier(item.name),
  })

  const params = item.props.map((_, i) => {
    return t.identifier(`arg${i}`)
  })

  const props = item.props.map((sourceProp, i) => {
    const prop = makeProp()
    prop.expression.left.property = sourceProp
    if (sourceProp.type === 'StringLiteral') {
      prop.expression.left.computed = true
    }

    prop.expression.right = t.identifier(`arg${i}`)
    return prop
  })

  constr.params = params
  constr.body.body = props

  return constr
}
