const babylon = require('babylon')
const fs = require('mz/fs')
const path = require('path')
const camelcase = require('lodash.camelcase')

module.exports = function (filePath) {
  return fs.readFile(filePath, 'utf8').then((code) => {
    const tree = babylon.parse(code, {
      sourceType: 'module',
      plugins: ['*']
    })

    const exportedComponents = []
    tree.program.body.forEach((node) => {
      // exports are only in toplevel
      const {type} = node
      if (type === 'ExportNamedDeclaration') {
        let name
        if (node.declaration) {
          name = node.declaration.declarations[0].id.name
        } else if (node.specifiers) {
          name = node.specifiers[0].exported.name
        }
        exportedComponents.push({
          name,
          exported: true
        })
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
          }
        }
        exportedComponents.push({
          name: name,
          exported: 'default'
        })
      }
    })

    return exportedComponents
  })
}

