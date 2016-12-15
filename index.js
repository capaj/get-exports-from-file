const babylon = require('babylon')
const fs = require('mz/fs')
const path = require('path')
const camelcase = require('lodash.camelcase')
const traverse = require('babel-traverse').default

function capitalizeFirstLetter (string) {
  return string[0].toUpperCase() + string.slice(1)
}

module.exports = function (filePath, tryCjs) {
  return fs.readFile(filePath, 'utf8').then((code) => {
    const tree = babylon.parse(code, {
      sourceType: 'module',
      plugins: ['*']
    })

    const exportedComponents = []
    tree.program.body.forEach((node) => {
      const {type} = node
      if (type === 'ExportNamedDeclaration') {
        let name
        if (node.declaration) {
          if (node.declaration.declarations) {
            name = node.declaration.declarations[0].id.name
          } else if (node.declaration.id) {
            name = node.declaration.id.name
          }
          exportedComponents.push({
            name,
            exported: true
          })
        } else if (node.specifiers) {
          node.specifiers.forEach((specifier) => {
            exportedComponents.push({
              name: specifier.exported.name,
              exported: true
            })
          })
        }
      } else if (type === 'ExportDefaultDeclaration') {
        let {name} = node.declaration

        if (!name) {
          if (node.declaration.type === 'ClassDeclaration') {
            name = node.declaration.id.name
          } else {
            name = path.basename(filePath).split('.')[0]
            if (name.includes('-') || name.includes('_')) {
              name = camelcase(name)
            }
            if (name === 'index') {
              name = path.dirname(filePath)
            }
            if (name[0].toLowerCase() === name[0]) {
              traverse.cheap(node, function (path) {
                if (path.type === 'JSXElement') {
                  name = capitalizeFirstLetter(name)
                }
              })
            }
          }
        }
        exportedComponents.push({
          name: name,
          exported: 'default'
        })
      }
    })

    if (tryCjs && exportedComponents.length === 0) {
      traverse.cheap(tree.program, (node) => {
        const {type} = node
        if (type === 'ExpressionStatement') {
          if (node.expression.type === 'AssignmentExpression') {
            // console.log(node.expression)
            if (node.expression.left.object && node.expression.left.object.name === 'exports') {
              const {property} = node.expression.left
              exportedComponents.push({
                name: property.name || property.value,
                exported: true
              })
            }
          }
        }
      })
    }

    return exportedComponents
  })
}

