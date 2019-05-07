import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import DropAreaBase from '../DropAreaBase'

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

const FileSelectArea = React.forwardRef(function FileSelectArea (props, ref) {
  const {
    children,
    className,
    classes,
    onSelectFiles,
    ...other
  } = props
  
  const [dragOver, setDragOver] = React.useState(false)

  const handleDragOver = () => {
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleSelectFiles = (files) => {
    setDragOver(false)
    onSelectFiles(files)
  }

  return (
    <DropAreaBase
      {...other}
      className={classNames(classes.root, className, {
        [classes.dragOver]: dragOver,
        [classes.clickable]: props.clickable,
        [classes.disabled]: props.disabled
      })}
      onAcceptedDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onSelectFiles={handleSelectFiles}
      ref={ref}
    >
      {children}
    </DropAreaBase>
  )
})

FileSelectArea.defaultProps = {
  clickable: true
}

export default withStyles(styles)(FileSelectArea)
