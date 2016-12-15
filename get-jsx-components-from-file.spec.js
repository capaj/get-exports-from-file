require('babel-polyfill')
import test from 'ava'
import getExportsFromFile from './index'

// import glob from 'glob'

test('basic', async t => {
  const exp = await getExportsFromFile('fixtures/basic.js')
  t.deepEqual(exp, [
    {name: 'statelessComponent', exported: true},
    {name: 'ShoppingList', exported: 'default'}
    // {name: 'statelessComponentNotExported', exported: false},
  ])
})

test('export as', async t => {
  const exp = await getExportsFromFile('fixtures/export-as.js')
  t.deepEqual(exp, [
    { name: 'b', exported: true },
    { name: 'd', exported: true },
    { name: 'e', exported: true },
    { name: 'exportAs', exported: 'default' }
    // {name: 'statelessComponentNotExported', exported: false},
  ])
})

test('classname', async t => {
  const exp = await getExportsFromFile('fixtures/classname.js')
  t.deepEqual(exp, [
    { name: 'ShoppingList', exported: 'default' }
  ])
})

test('named function', async t => {
  const exp = await getExportsFromFile('fixtures/named-function.js')
  t.deepEqual(exp, [
    { name: 'namedFn', exported: true }
  ])
})

test('index inherits a name from parent dir', async t => {
  const exp = await getExportsFromFile('fixtures/index.js')
  t.deepEqual(exp, [
    { name: 'fixtures', exported: 'default' }
  ])
})

test('capitalize when JSX', async t => {  // JSX components cannot appear with a lowercase first letter
  const exp = await getExportsFromFile('fixtures/should-get-capitalized.js')
  t.deepEqual(exp, [
    { name: 'ShouldGetCapitalized', exported: 'default' }
  ])
})

test('commonJS', async t => {
  const exp = await getExportsFromFile('node_modules/react-intl/lib/index.js', true)
  t.deepEqual(exp, [
    { name: 'addLocaleData', exported: true },
    { name: 'intlShape', exported: true },
    { name: 'injectIntl', exported: true },
    { name: 'defineMessages', exported: true },
    { name: 'IntlProvider', exported: true },
    { name: 'FormattedDate', exported: true },
    { name: 'FormattedTime', exported: true },
    { name: 'FormattedRelative', exported: true },
    { name: 'FormattedNumber', exported: true },
    { name: 'FormattedPlural', exported: true },
    { name: 'FormattedMessage', exported: true },
    { name: 'FormattedHTMLMessage', exported: true }
  ])
})

test.skip('es5 default', async t => {  // JSX components cannot appear with a lowercase first letter
  const exp = await getExportsFromFile('node_modules/react-datepicker/dist/react-datepicker.js', true)
  t.deepEqual(exp, [
    { name: 'DatePicker', exported: 'default' }
  ])
})

// test()

// test.only('files', async (t) => {
//   const files = glob.sync('../be/frontend-be.com/src/**/*.jsx')
//   // console.log(files)
//   await files.map(async (file) => {
//     const exps = await getExportsFromFile(file)
//     console.log(exps)
//   })
// })

