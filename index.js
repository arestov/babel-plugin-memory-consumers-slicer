const isAmdBody = require('./src/isAmdBody')
const makeObjectReplacer = require('./src/object/make')
const makeArrayReplace = require('./src/array/make')

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

  const handleObject = makeObjectReplacer(babel)
  const handleArray = makeArrayReplace(babel)

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

      const createConstr = item => {
        switch (item.type) {
          case 'object':
            return handleObject.placeConstructor(item)
          case 'array':
            return handleArray.placeConstructor(item)
          default:
            return null
        }
      }

      function insertTo(path, list) {
        if (pluginContext.list_injected) {
          return
        }
        pluginContext.list_injected = true
        // eslint-disable-next-line no-plusplus
        for (let i = list.length - 1; i >= 0; i--) {
          const item = list[i]

          const constr = createConstr(item)

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
      ArrayExpression: {
        exit(path, pluginContext) {
          docs(path)
          handleArray.matchAndReplace(pluginContext, path)
        },
      },
      ObjectExpression: {
        exit(path, pluginContext) {
          docs(path)
          handleObject.matchAndReplace(pluginContext, path)
        },
      },
    },
  }
}
