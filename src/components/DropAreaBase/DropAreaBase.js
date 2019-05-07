import React from 'react'
import { withStyles } from '@material-ui/core';

const styles = {
  input: {
    display: 'none'
  }
}

function includesTypeOrName (accept, type, name) {
  // an accepted type can be audio/*, video/*, image/*, any MIME type string or a file extension
  // see https://html.spec.whatwg.org/multipage/input.html#file-upload-state-(type=file)

  if (!accept)
    return true

  const acceptedTypes = accept.split(',').map(t => t.trim())
  if (acceptedTypes.length === 0)
    return true

  return acceptedTypes.some((acceptedType) => {
    if (acceptedType === 'audio/*' && type.indexOf('audio/') === 0)
      return true
    if (acceptedType === 'video/*' && type.indexOf('video/') === 0)
      return true
    if (acceptedType === 'image/*' && type.indexOf('image/') === 0)
      return true
    if (acceptedType.indexOf('.') === 0)
      return name != null && name.indexOf(acceptedType) === name.length - acceptedType.length
    return type === acceptedType
  })
}

class DropAreaBase extends React.Component {
  fileInputRef = React.createRef()

  handleClick = (e) => {
    this.fileInputRef.current.click()
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  isAcceptingTransfer (dataTransfer) {
    if (dataTransfer.items.length === 1 || this.props.multiple) {
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
    this.cancelEvent(e)    
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
    this.cancelEvent(e)
    if (this.isAcceptingTransfer(e.dataTransfer)) {
      e.dataTransfer.dropEffect = 'copy'
    } else {
      e.dataTransfer.dropEffect = 'none'
    }
  }

  handleDrop = (e) => {
    this.cancelEvent(e)
    if (this.props.onDrop) {
      this.props.onDrop(e)
    }

    if (this.isAcceptingTransfer(e.dataTransfer)) {
      this.props.onSelectFiles(e.dataTransfer.files)
    }
  }

  handleSelectFiles = (e) => {
    this.props.onSelectFiles(e.target.files)
  }

  cancelEvent = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  render () {
    const {
      accept,
      children,
      classes,
      clickable,
      component: Component,
      multiple,
      onAcceptedDragEnter,
      onClick,
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
        onDragEnd={this.cancelEvent}
        onClick={clickable ? this.handleClick : onClick}
      >
        {children}
        {clickable && <input
          accept={accept}
          className={classes.input}
          multiple={multiple}
          onChange={this.handleSelectFiles}
          ref={this.fileInputRef}
          type='file'
        />}
      </Component>
    )
  }
}

DropAreaBase.defaultProps = {
  component: 'div'
}

export default withStyles(styles)(DropAreaBase)
