import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import InvisibleDropArea from '../src/components/InvisibleDropArea/InvisibleDropArea'

storiesOf('InvisibleDropArea', module)
  .add('default', () => (
    <InvisibleDropArea
      style={{ width: 300, height: 300, border: '1px solid red' }}
    />
  ))
  .add('multiple images', () => (
    <InvisibleDropArea
      style={{ width: 300, height: 300, border: '1px solid red' }}
      accept='image/*'
      multiple
      activeText='Drop image to upload'
      onSelectFiles={action('onSelectFiles')}
    />
  ))
