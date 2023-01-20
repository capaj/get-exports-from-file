const path = require('path')
const camelcase = require('lodash.camelcase')
const traverse = require('babel-traverse').default

function capitalizeFirstLetter (string) {
  return string[0].toUpperCase() + string.slice(1)
}

const makeUpTheImportDefaultName = (node, filePath) => {
  let name = path.basename(filePath).split('.')[0]
  if (name.includes('-') || name.includes('_')) {
    name = camelcase(name) || name;
  }
  if (name === 'index') {
    name = path.dirname(filePath)
    if (name.includes(path.sep)) {
      name = name.split(path.sep).pop()
    }
  }
  if (name[0].toLowerCase() === name[0]) {
    traverse.cheap(node, function (path) {
      if (path.type === 'JSXElement') {
        name = capitalizeFirstLetter(name)
      }
    })
  }
  return name
}

module.exports = makeUpTheImportDefaultName
