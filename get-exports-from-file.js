const babylon = require('babylon')
const fs = require('mz/fs')
const traverse = require('babel-traverse').default
const makeUpImportDefaultName = require('./lib/make-up-import-default-name')

const parse = (filePath) => {
  return fs.readFile(filePath, 'utf8').then((code) => {
    return babylon.parse(code, {
      sourceType: 'module',
      plugins: ['*']
    })
  })
}

module.exports = {
  es6 (filePath) {
    return parse(filePath).then((tree) => {
      const exported = []
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
            exported.push({
              name
            })
          } else if (node.specifiers) {
            node.specifiers.forEach((specifier) => {
              exported.push({
                name: specifier.exported.name
              })
            })
          }
        } else if (type === 'ExportDefaultDeclaration') {
          let {name} = node.declaration

          if (!name) {
            if (node.declaration.type === 'ClassDeclaration') {
              name = node.declaration.id.name
            } else {
              name = makeUpImportDefaultName(node, filePath)
            }
          }
          exported.push({
            name: name,
            default: true
          })
        }
      })

      return {
        exported,
        ast: tree
      }
    })
  },
  cjs (filePath) {
    return parse(filePath).then((tree) => {
      const exported = []

      let foundADefault = false
      traverse.cheap(tree.program, (node) => {
        const {type} = node
        if (type === 'ExpressionStatement') {
          if (node.expression.type === 'AssignmentExpression') {
            if (node.expression.left.object && node.expression.left.object.name === 'exports') {
              if (!node.expression.left.property) {
                return
              }
              if (!foundADefault && node.expression.left.property.name === 'default') {
                foundADefault = true
                // console.log('A', node.expression)

                return exported.push({
                  name: makeUpImportDefaultName(node.expression.right, filePath),
                  default: true
                })
              } else {
                const {right} = node.expression
                if (right.type === 'CallExpression' && right.callee && right.callee.name === 'factory') {
                  return // skip this, because it's most likely a UMD defintion garbage
                }
                // console.log('B', node.expression)

                const {property} = node.expression.left
                return exported.push({
                  name: property.name || property.value
                })
              }
            } else if (node.expression.left.object && node.expression.left.property) {
              if (!foundADefault && node.expression.left.object.name === 'module' && node.expression.left.property.name === 'exports') {
                const {right} = node.expression
                if (right.type === 'CallExpression' && right.callee && right.callee.name === 'factory') {
                  return // skip this, because it's most likely a UMD defintion garbage
                }
                foundADefault = true
                // console.log('C', node.expression)

                return exported.push({
                  name: right.name || makeUpImportDefaultName(right, filePath),
                  default: true
                })
              }
            }
          }
        }
      })
      return {
        exported,
        ast: tree
      }
    })
  }
}

