import makeUpTheImportDefaultName from './make-up-import-default-name'
import test from 'ava'

test('handles absolute paths', t => {
  const path = makeUpTheImportDefaultName({}, '/home/capaj/git_projects/aaa/node_modules/axios/index.js')
  t.is(path, 'axios')
})

test('capitalize', (t) => {
  const jsx = require('../fixtures/ast-react-element.json')
  const path = makeUpTheImportDefaultName(jsx.program, '/home/capaj/git_projects/aaa/node_modules/axios/index.js')
  t.is(path, 'Axios')
})
