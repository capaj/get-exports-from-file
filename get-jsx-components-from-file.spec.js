import test from 'ava'
import getJsxComponentsFromFile from './index'

test('finds', async t => {
  t.deepEqual(getJsxComponentsFromFile('fixtures/basic.js'), [
    {name: 'statelessComponent', exported: true},
    {name: 'ShoppingList', exported: 'default'}
    // {name: 'statelessComponentNotExported', exported: false},
  ])
})
