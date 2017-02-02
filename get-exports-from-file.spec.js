require('babel-polyfill')
import test from 'ava'
import getExportsFromFile from './get-exports-from-file'

// import glob from 'glob'

test('basic', async t => {
  const exp = await getExportsFromFile.es6('fixtures/basic.js')
  t.deepEqual(exp.exported, [
    {name: 'statelessComponent'},
    {name: 'ShoppingList', default: true}
    // {name: 'statelessComponentNotExported', exported: false},
  ])
})

test('flow', async t => {
  const exp = await getExportsFromFile.es6('fixtures/flow.js')
  t.deepEqual(exp.exported, [
    {name: 'DateRange'},
    {name: 'DateInterval'},
    {name: 'DateIntervalFlag'}
  ])
})

test('export as', async t => {
  const exp = await getExportsFromFile.es6('fixtures/export-as.js')
  t.deepEqual(exp.exported, [
    { name: 'b' },
    { name: 'd' },
    { name: 'e' },
    { name: 'exportAs', default: true }
    // {name: 'statelessComponentNotExported', exported: false},
  ])
})

test('classname', async t => {
  const exp = await getExportsFromFile.es6('fixtures/classname.js')
  t.deepEqual(exp.exported, [
    { name: 'ShoppingList', default: true }
  ])
})

test('named function', async t => {
  const exp = await getExportsFromFile.es6('fixtures/named-function.js')
  t.deepEqual(exp.exported, [
    { name: 'namedFn' }
  ])
})

test('index inherits a name from parent dir', async t => {
  const exp = await getExportsFromFile.es6('fixtures/index.js')
  t.deepEqual(exp.exported, [
    { name: 'fixtures', default: true }
  ])
})

test('capitalize when JSX', async t => {  // JSX components cannot appear with a lowercase first letter
  const exp = await getExportsFromFile.es6('fixtures/should-get-capitalized.js')
  t.deepEqual(exp.exported, [
    { name: 'ShouldGetCapitalized', default: true }
  ])
})

test('commonJS', async t => {
  const exp = await getExportsFromFile.cjs('node_modules/react-intl/lib/index.js', true)
  t.deepEqual(exp.exported, [
    { name: 'addLocaleData' },
    { name: 'intlShape' },
    { name: 'injectIntl' },
    { name: 'defineMessages' },
    { name: 'IntlProvider' },
    { name: 'FormattedDate' },
    { name: 'FormattedTime' },
    { name: 'FormattedRelative' },
    { name: 'FormattedNumber' },
    { name: 'FormattedPlural' },
    { name: 'FormattedMessage' },
    { name: 'FormattedHTMLMessage' }
  ])
})
test('ignores first export in UMD', async t => {
  const exp = await getExportsFromFile.cjs('node_modules/react-datepicker/dist/react-datepicker.js', true)
  t.deepEqual(exp.exported, [
    {
      name: 'DatePicker',
      default: true
    },
    {
      name: 'isSameDay'
    },
    {
      name: 'isDayInRange'
    },
    {
      name: 'isDayDisabled'
    },
    {
      name: 'allDaysDisabledBefore'
    },
    {
      name: 'allDaysDisabledAfter'
    },
    {
      name: 'getEffectiveMinDate'
    },
    {
      name: 'getEffectiveMaxDate'
    }
  ])
})

test('es5 simple', async t => {
  const exp = await getExportsFromFile.cjs('fixtures/cjs.js', true)
  t.deepEqual(exp.exported, [
    { name: 'cjs', default: true }
  ])
})

test('bad cjs', async t => {
  const exp = await getExportsFromFile.cjs('fixtures/bad-export.js', true)
  t.deepEqual(exp.exported, [])
})

test('mobx', async t => {
  const exp = await getExportsFromFile.cjs('node_modules/mobx/lib/mobx.js', true)
  t.deepEqual(exp.exported, [
    { name: 'extras' },
    { name: 'action' },
    { name: 'runInAction' },
    { name: 'isAction' },
    { name: 'autorun' },
    { name: 'when' },
    { name: 'autorunAsync' },
    { name: 'reaction' },
    { name: 'computed' },
    { name: 'createTransformer' },
    { name: 'expr' },
    { name: 'extendObservable' },
    { name: 'extendShallowObservable' },
    { name: 'intercept' },
    { name: 'isComputed' },
    { name: 'isObservable' },
    { name: 'IObservableFactories' },
    { name: 'observable' },
    { name: 'observe' },
    { name: 'toJS' },
    { name: 'transaction' },
    { name: 'whyRun' },
    { name: 'useStrict' },
    { name: 'isStrictModeEnabled' },
    { name: 'BaseAtom' },
    { name: 'Atom' },
    { name: 'IDerivationState' },
    { name: 'untracked' },
    { name: 'Reaction' },
    { name: 'spy' },
    { name: 'asReference' },
    { name: 'asStructure' },
    { name: 'asFlat' },
    { name: 'asMap' },
    { name: 'isModifierDescriptor' },
    { name: 'isObservableArray' },
    { name: 'ObservableMap' },
    { name: 'map' },
    { name: 'isObservableMap' },
    { name: 'isObservableObject' },
    { name: 'isArrayLike' }
  ])
})
