import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Typography } from '@material-ui/core'
import UploadIcon from '@material-ui/icons/CloudUpload'
import ImageIcon from '@material-ui/icons/Image'
import { InvisibleDropArea, FileSelectArea } from '../src'

storiesOf('InvisibleDropArea', module)
  .add('default', () => (
    <InvisibleDropArea
      style={{ width: '100%', height: 'calc(100vh - 20px)' }}
      activeIcon={<UploadIcon />}
      activeText='Drop files to upload'
      onSelectFiles={action('onSelectFiles')}
    >
      <Typography>Try dragging some files to this area.</Typography>
    </InvisibleDropArea>
  ))
  .add('multiple images', () => (
    <InvisibleDropArea
      style={{ width: '100%', height: 'calc(100vh - 20px)' }}
      accept='image/*'
      multiple
      activeIcon={<ImageIcon />}
      activeText='Drop image to upload'
      onSelectFiles={action('onSelectFiles')}
    >
      <Typography>Try dragging some images to this area.</Typography>
    </InvisibleDropArea>
  ))
  .add('disabled', () => (
    <InvisibleDropArea
      style={{ width: '100%', height: 'calc(100vh - 20px)' }}
      onSelectFiles={action('onSelectFiles')}
      disabled
    >
      <Typography>Try dragging a file to this area.</Typography>
    </InvisibleDropArea>
  ))

storiesOf('FileSelectArea', module)
  .add('with icon and text', () => (
    <FileSelectArea
      style={{ width: 300, height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      onSelectFiles={action('onSelectFiles')}
      multiple
    >
      <UploadIcon style={{ opacity: 0.3, width: 96, height: 96 }} />
      <Typography align='center'>Click or drag file to this area to upload</Typography>
    </FileSelectArea>
  ))
  .add('disabled', () => (
    <FileSelectArea
      style={{ width: 300, height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      onSelectFiles={action('onSelectFiles')}
      disabled
    >
      <UploadIcon style={{ opacity: 0.3, width: 96, height: 96 }} />
      <Typography align='center'>Click or drag file to this area to upload</Typography>
    </FileSelectArea>
  ))
