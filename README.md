# Material-UI File Dropzone
This project provides drag and drop file selector components for [Material-UI][mui]. Take a look at [the demos][storybook].

At the moment, this project is at an early stage. We want to explore possible use cases and explore what the API should look like. Please open an issue if there's something missing or if you encounter a bug.

[mui]: https://material-ui.com
[storybook]: https://teamwertarbyte.github.io/material-ui-file-dropzone/

## Installation
```
npm i --save material-ui-file-dropzone
```

## Usage
### DropAreaBase
Basic component to implement a container that files can be dropped on. This is the foundation of the other components and can be used to create custom upload controls.

|Name|Type|Default|Description|
|---|---|---|---|
|accept|`string`||The accepted file types as a comma-separated list of MIME types or file extensions. If not set, any file type will be accepted.|
|children|`node`||Used to render content in the drop area.|
|clickable|`bool`||If `true`, the drop area can be clicked to open a file selection dialog.|
|component|`elementType`|`'div'`|The component used for the root node.|
|disabled|`bool`||If `true`, the drop area will be disabled.|
|multiple|`bool`||If `true`, the drop area will accept multiple files.|
|onAcceptedDragEnter|`func`||Callback fired when a user drags one or more accepted files over the drop area.|
|onClick|`func`||Callback fired when the user clicks on the drop area.|
|onSelectFiles*|`func`||Callback fired when the user selects or drops one or more accepted files.|

All other properties are passed through to the root element.

### FileSelectArea
This is a very basic file selector that supports drag and drop as well as clicking to open a file selection dialog.

|Name|Type|Default|Description|
|---|---|---|---|
|children|`node`||Used to render content in the drop area.|
|classes|`object`||Override or extend the styles applied to the component.|
|clickable|`bool`|`true`||If `true`, the drop area can be clicked to open a file selection dialog.|
|onSelectFiles*|`func`||Callback fired when the user selects or drops one or more accepted files.|

All other properties are passed through to the underlying `DropAreaBase`. 

### InvisibleDropArea
The invisible drop area can be used for views where no drop area is shown but the user can drop files anywhere to trigger an action (e.g. upload it).

|Name|Type|Default|Description|
|---|---|---|---|
|activeIcon|`node`||Icon to display when an accepted file is dragged over the area.|
|activeText|`string`||Text to display when an accepted file is dragged over the area.|
|children|`node`||Used to render content in the drop area.|
|classes|`object`||Override or extend the styles applied to the component.|
|onSelectFiles*|`func`||Callback fired when the user selects or drops one or more accepted files.|

All other properties are passed through to the underlying `DropAreaBase`.

\* required property

## License
The files included in this repository are licensed under the MIT license.
