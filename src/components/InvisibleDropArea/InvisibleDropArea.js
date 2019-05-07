import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Typography from '@material-ui/core/Typography'
import ImageIcon from '@material-ui/icons/Image'
import DropAreaBase from '../DropAreaBase/DropAreaBase'

const styles = theme => ({
  root: {
    position: 'relative'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    background: fade(theme.palette.background.default, 0.5),
    transition: 'opacity .3s ease',
  },
  overlayDragging: {
    opacity: 1,
    '& $iconContainer': {
      animation: 'wui-invisibledroparea-pulse 1s infinite',
    }
  },
  iconContainer: {
    background: theme.palette.primary.main,
    borderRadius: '50%',
    marginBottom: theme.spacing.unit * 3,
    width: 96,
    height: 96,
    padding: 16
  },
  icon: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    width: 96,
    height: 96
  },
  disabled: {},
  '@keyframes wui-invisibledroparea-pulse': {
    '0%': {
      boxShadow: `0 0 0 0 ${theme.palette.primary.main}`
    },
    '50%': {
      boxShadow: `0 0 0 5px ${theme.palette.primary.main}`
    },
    '100%': {
      boxShadow: `0 0 0 0 ${theme.palette.primary.main}`
    }
  }
})

class InvisibleDropArea extends React.Component {
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
      activeText,
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
          [classes.disabled]: this.props.disabled
        })}
        onAcceptedDragEnter={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onSelectFiles={this.handleSelectFiles}
      >
        {children}
        <div className={classNames(classes.overlay, { [classes.overlayDragging]: dragOver })}>
          <div className={classes.iconContainer}>
            <ImageIcon className={classes.icon} />
          </div>
          {activeText && <Typography>{activeText}</Typography>}
        </div>
      </DropAreaBase>
    )
  }
}

export default withStyles(styles)(InvisibleDropArea)
