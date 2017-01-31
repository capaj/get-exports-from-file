## get-exports-from-file

just a function used by [vscode-exports-autocomplete](https://github.com/capaj/vscode-exports-autocomplete)

api is straighforward:
```javascript
import getExportsFromFile from './index'
// make sure to use absolute paths, not relative paths
getExportsFromFile('/home/capaj/git_projects/some-js-file.js').then((result) = {
    result.exportsFromFile // array of objects, each object has a `name` and `exported` props
})

```