## get-exports-from-file

just a function used by [vscode-exports-autocomplete](https://github.com/capaj/vscode-exports-autocomplete)

api is straighforward:
```javascript
import getExportsFromFile from './index'
// make sure to use absolute paths, not relative paths
getExportsFromFile('/some-js-file.js').then((result) = {
    result.exportsFromFile // array of objects, each object has a String `name` and Boolean `default` props
})
// second argument is a flag to signify you want to attempt to get CommonJS export
getExportsFromFile('/CJS.js', true).then((result) = {
    result.exportsFromFile // array of objects, each object has a String `name` and Boolean `default` props
})


```