import React from 'react'
import PropTypes from 'prop-types'

function includesTypeOrName (accept, type, name) {
  // an accepted type can be audio/*, video/*, image/*, any MIME type string or a file extension
  // see https://html.spec.whatwg.org/multipage/input.html#file-upload-state-(type=file)

  if (!accept) { return true }

  const acceptedTypes = accept.split(',').map(t => t.trim())
  if (acceptedTypes.length === 0) { return true }

  return acceptedTypes.some((acceptedType) => {
    if (acceptedType === 'audio/*' && type.indexOf('audio/') === 0) { return true }
    if (acceptedType === 'video/*' && type.indexOf('video/') === 0) { return true }
    if (acceptedType === 'image/*' && type.indexOf('image/') === 0) { return true }
    if (acceptedType.indexOf('.') === 0) { return name != null && name.indexOf(acceptedType) === name.length - acceptedType.length }
    return type === acceptedType
  })
}

function cancelEvent (e) {
  e.preventDefault()
  e.stopPropagation()
}

// Declare global DataTransferItem for standardjs lintfix
/* global DataTransferItem */

// Browser supports webkitGetAsEntry API needed for dropping folders
const folderDropSupported = !!DataTransferItem.prototype.webkitGetAsEntry

export default class DropAreaBase extends React.Component {
  fileInputRef = React.createRef()

  handleClick = (e) => {
    if (!this.props.disabled) {
      if (this.props.clickable) {
        this.fileInputRef.current.click()
      }
      if (this.props.onClick) {
        this.props.onClick(e)
      }
    }
  }

  isAcceptingTransfer (dataTransfer) {
    if (!this.props.disabled && (dataTransfer.items.length === 1 || this.props.multiple)) {
      if (dataTransfer.items.length > dataTransfer.files.length) {
        // drag event (no files) or some elements are not files
        for (const item of dataTransfer.items) {
          if (item.kind !== 'file' || !includesTypeOrName(this.props.accept, item.type)) {
            return false
          }
        }
      } else {
        // drop event
        if (dataTransfer.files.length === 0) {
          return false
        }
        for (const file of dataTransfer.files) {
          if (!includesTypeOrName(this.props.accept, file.type, file.name)) {
            return
          }
        }
      }
      return true
    }
    return false
  }

  handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'copyMove'
  }

  handleDragEnter = (e) => {
    cancelEvent(e)
    if (this.isAcceptingTransfer(e.dataTransfer)) {
      e.dataTransfer.dropEffect = 'copy'
      if (this.props.onAcceptedDragEnter) {
        this.props.onAcceptedDragEnter(e)
      }
    } else {
      e.dataTransfer.dropEffect = 'none'
    }
  }

  handleDragOver = (e) => {
    cancelEvent(e)
    if (this.isAcceptingTransfer(e.dataTransfer)) {
      e.dataTransfer.dropEffect = 'copy'
    } else {
      e.dataTransfer.dropEffect = 'none'
    }
  }

  handleDrop = (e) => {
    cancelEvent(e)
    if (this.props.onDrop) {
      this.props.onDrop(e)
    }

    if (this.isAcceptingTransfer(e.dataTransfer)) {
      if (folderDropSupported === false) {
        this.props.onSelectFiles(e.dataTransfer.files)
      } else {
        // Recursive function to walk into directories and extract file objects
        const recurseItem = (item, sub) => new Promise((resolve, reject) => {
          // Resolve with a single item list
          if (item.isFile) { item.file(file => resolve([file]), e => reject(e)) }

          // Resolve with merging all sub entry lists
          if (item.isDirectory) {
            item.createReader().readEntries(entries =>
              Promise
                .all(entries
                  .map(entry => recurseItem(entry, sub + item.name + '/')))
                .then(files => files.flat())
                .then(files => resolve(files))
            , err => reject(err))
          }
        })

        Promise
          .all([...e.dataTransfer.items].map(item =>
            recurseItem(item.webkitGetAsEntry(), '/')))
          .then(files => files.flat())
          .then(files => this.props.onSelectFiles(files))
      }
    }
  }

  handleSelectFiles = (e) => {
    this.props.onSelectFiles(e.target.files)
  }

  render () {
    const {
      accept,
      children,
      clickable,
      component: Component,
      disabled,
      multiple,
      onAcceptedDragEnter,
      onSelectFiles,
      ...other
    } = this.props

    return (
      <Component
        {...other}
        onDragStart={this.handleDragStart}
        onDragEnter={this.handleDragEnter}
        onDrop={this.handleDrop}
        onDragOver={this.handleDragOver}
        onDragEnd={cancelEvent}
        onClick={this.handleClick}
      >
        {children}
        {clickable && <input
          accept={accept}
          multiple={multiple}
          onChange={this.handleSelectFiles}
          ref={this.fileInputRef}
          style={{ display: 'none' }}
          type='file'
        />}
      </Component>
    )
  }
}

DropAreaBase.propTypes = {
  /**
   * The accepted file types as a comma-separated list of MIME types or file extensions.
   * If not set, any file type will be accepted.
   */
  accept: PropTypes.string,
  /**
   * Used to render content in the drop area.
   */
  children: PropTypes.node,
  /**
   * If `true`, the drop area can be clicked to open a file selection dialog.
   */
  clickable: PropTypes.bool,
  /**
   * The component used for the root node.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, the drop area will be disabled.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the drop area will accept multiple files.
   */
  multiple: PropTypes.bool,
  /**
   * Callback fired when a user drags one or more accepted files over the drop area.
   */
  onAcceptedDragEnter: PropTypes.func,
  /**
   * Callback fired when the user clicks on the drop area.
   */
  onClick: PropTypes.func,
  /**
   * Callback fired when the user selects or drops one or more accepted files.
   */
  onSelectFiles: PropTypes.func.isRequired
}

DropAreaBase.defaultProps = {
  component: 'div'
}
