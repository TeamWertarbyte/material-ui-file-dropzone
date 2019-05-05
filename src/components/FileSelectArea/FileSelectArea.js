import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import DropAreaBase from '../DropAreaBase/DropAreaBase'

const styles = theme => ({
  root: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    '&:hover, &$dragOver': {
      borderColor: theme.palette.primary.main
    },
    transition: theme.transitions.create('border-color'),
    '& *': {
      pointerEvents: 'none'
    }
  },
  clickable: {
    cursor: 'pointer'
  },
  dragOver: {}
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
      clickable,
      onSelectFiles,
      ...other
    } = this.props

    const {
      dragOver
    } = this.state

    return (
      <DropAreaBase
        clickable={clickable}
        {...other}
        className={classNames(classes.root, className, { [classes.dragOver]: dragOver, [classes.clickable]: clickable })}
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
