const pathm = require('path')
const getFunctionName = require('./getFunctionName')

function constrName(dataType, path, pluginContext) {
  // const filename = ''

  const filename1 = pathm
    .basename(pluginContext.file.opts.filename, pathm.extname(pluginContext.file.opts.filename))
    .replace(/[^\w]/gi, '_')

  // console.log(filename1)
  const funcName = getFunctionName(path, pluginContext)
  const pos = path.node.loc ? path.node.loc.start : { line: 'N', column: 'N' }

  const prefix = pluginContext.opts && pluginContext.opts.prefix
  const fullPrefix = prefix ? `__${prefix}` : ''

  const postFix = funcName ? `__${funcName}` : ''
  const memoryConstructorName = `MSlice${fullPrefix}_${dataType}__${filename1}_line_${pos.line}_column_${pos.column}${postFix}`
  return memoryConstructorName
}

module.exports = constrName
