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

  handleDragEnter = (e) => {
    this.cancelEvent(e)

    if (this.props.onAcceptedDragEnter && (e.dataTransfer.items.length === 1 || this.props.multiple)) {
      for (const item of e.dataTransfer.items) {
        if (item.kind !== 'file' || !includesTypeOrName(this.props.accept, item.type)) {
          return;
        }
      }

      this.props.onAcceptedDragEnter(e)
    }
  }

  handleDrop = (e) => {
    this.cancelEvent(e)
    if (this.props.onDrop) {
      this.props.onDrop(e)
    }

    if (this.props.onAcceptedDragEnter && (e.dataTransfer.files.length === 1 || this.props.multiple)) {
      for (const file of e.dataTransfer.files) {
        if (!includesTypeOrName(this.props.accept, file.type, file.name)) {
          return;
        }
      }

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
        onDragEnter={this.handleDragEnter}
        onDrop={this.handleDrop}
        onDragOver={this.cancelEvent}
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
