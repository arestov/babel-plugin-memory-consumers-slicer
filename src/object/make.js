const createPlaceConstructor = require('./placeConstructor')
const createMatchAndReplace = require('./matchAndReplace')

const make = babel => {
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
    placeConstructor: createPlaceConstructor(babel, makeConstr, makeProp),
    matchAndReplace: createMatchAndReplace(babel, callConstr),
  }
}

module.exports = make
