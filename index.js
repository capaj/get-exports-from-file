const babylon = require('babylon')
const fs = require('fs')
const traverse = require('traverse')

module.exports = function (filePath) {
  const code = fs.readFileSync(filePath, 'utf8')
  // console.log(code)
  const tree = babylon.parse(code, {
    sourceType: 'module',
    plugins: ['*']
  })
  const exportedComponents = []
  traverse(tree).forEach(function () {
    if (this.key !== 'type') {
      return
    }
    const {parent, node} = this
    if (node === 'ExportNamedDeclaration') {
      console.log(parent.node.declaration.declarations[0].id.name)
      exportedComponents.push({
        name: parent.node.declaration.declarations[0].id.name,
        exported: true
      })
    } else if (node === 'ExportDefaultDeclaration') {
      exportedComponents.push({
        name: parent.node.declaration.name,
        exported: 'default'
      })
    }
    // console.log(this.value)
  })
  return exportedComponents
  // console.log(tree)
}

