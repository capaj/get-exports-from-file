import test from 'ava'
import getJsxComponentsFromFile from './index'

test('finds', t => {
  t.deepEqual(getJsxComponentsFromFile('fixtures/basic.js'), [
    {name: 'ShoppingList', props: [], exported: 'default'},
    {name: 'statelessComponentNotExported', props: [], exported: false},
    {name: 'statelessComponent', props: [], exported: true}
  ])
})
