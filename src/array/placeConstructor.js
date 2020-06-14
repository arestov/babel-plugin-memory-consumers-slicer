module.exports = (babel, makeConstr, makeProp) => item => {
  const t = babel.types

  const constr = makeConstr({
    FN_NAME: t.identifier(item.name),
  })

  const params = item.els.map((_, i) => {
    return t.identifier(`arg${i}`)
  })

  const els = item.els.map((sourceProp, i) => {
    const prop = makeProp()
    prop.expression.left.property = sourceProp
    prop.expression.right = t.identifier(`arg${i}`)
    return prop
  })

  constr.params = params
  constr.body.body = els

  return constr
}
