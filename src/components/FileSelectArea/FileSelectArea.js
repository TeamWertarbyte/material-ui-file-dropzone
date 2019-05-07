import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import DropAreaBase from '../DropAreaBase/DropAreaBase'

const styles = theme => ({
  root: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    '&:hover, &$dragOver': {
      borderColor: theme.palette.primary.main,
      '&$disabled': {
        borderColor: theme.palette.divider,
      }
    },
    transition: theme.transitions.create('border-color'),
    '& *': {
      pointerEvents: 'none'
    }
  },
  clickable: {
    cursor: 'pointer',
    '&$disabled': {
      cursor: 'default'
    }
  },
  disabled: {},
  dragOver: {
    '&$disabled': {
      cursor: 'no-drop !important'
    }
  }
})

class FileSelectArea extends React.Component {
  state = {
    dragOver: false
  }

  handleDragOver = (e) => {
    this.setState({ dragOver: true })
  }

  handleDragLeave = (e) => {
    this.setState({ dragOver: false })
  }

  handleSelectFiles = (files) => {
    this.setState({ dragOver: false })
    this.props.onSelectFiles(files)
  }

  render () {
    const {
      children,
      className,
      classes,
      onSelectFiles,
      ...other
    } = this.props

    const {
      dragOver
    } = this.state

    return (
      <DropAreaBase
        {...other}
        className={classNames(classes.root, className, {
          [classes.dragOver]: dragOver,
          [classes.clickable]: this.props.clickable,
          [classes.disabled]: this.props.disabled
        })}
        onAcceptedDragEnter={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onSelectFiles={this.handleSelectFiles}
      >
        {children}
      </DropAreaBase>
    )
  }
}

FileSelectArea.defaultProps = {
  clickable: true
}

export default withStyles(styles)(FileSelectArea)
