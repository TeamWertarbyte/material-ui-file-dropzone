import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Typography from '@material-ui/core/Typography'
import DropAreaBase from '../DropAreaBase'

const styles = theme => ({
  root: {
    position: 'relative'
  },
  dragOver: {
    '& *': {
      pointerEvents: 'none'
    },
    '& $overlay': {
      pointerEvents: 'default'
    }
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
    transition: 'opacity .3s ease'
  },
  overlayDragging: {
    opacity: 1,
    '& $iconContainer': {
      animation: 'wui-invisibledroparea-pulse 1s infinite'
    }
  },
  iconContainer: {
    background: theme.palette.primary.main,
    borderRadius: '50%',
    marginBottom: theme.spacing.unit * 3,
    width: 96,
    height: 96,
    padding: 16,
    boxSizing: 'content-box'
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

const InvisibleDropArea = React.forwardRef(function InvisibleDropArea (props, ref) {
  const {
    activeIcon,
    activeText,
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
        [classes.disabled]: props.disabled,
        [classes.dragOver]: dragOver
      })}
      onAcceptedDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onSelectFiles={handleSelectFiles}
      ref={ref}
    >
      {children}
      <div className={classNames(classes.overlay, { [classes.overlayDragging]: dragOver })}>
        {activeIcon && (
          <div className={classes.iconContainer}>
            {React.cloneElement(activeIcon, { className: classes.icon })}
          </div>
        )}
        {activeText && <Typography>{activeText}</Typography>}
      </div>
    </DropAreaBase>
  )
})

InvisibleDropArea.propTypes = {
  /**
   * Icon to display when an accepted file is dragged over the area.
   */
  activeIcon: PropTypes.node,
  /**
   * Text to display when an accepted file is dragged over the area.
   */
  activeText: PropTypes.string,
  /**
   * Used to render content in the drop area.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  /**
   * Callback fired when the user drops one or more accepted files.
   */
  onSelectFiles: PropTypes.func.isRequired
}

export default withStyles(styles)(InvisibleDropArea)
