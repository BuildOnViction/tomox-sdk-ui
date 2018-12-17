import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { text, withKnobs } from '@storybook/addon-knobs/react'
import { withInfo } from '@storybook/addon-info'
import TomoBalanceContainer from './index'
import TomoBalanceComponent from './TomoBalance'
import README from './README.md'

storiesOf('TomoBalance', module)
  .addDecorator(withKnobs)
  .add(
    'Default Export',
    withInfo({ text: README, propTablesExclude: [TomoBalanceContainer], source: false })(() => (
      <TomoBalanceContainer
        address={text('account', '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE')}
        loadingMessage="Loading..."
      />
    ))
  )
  .add(
    'Inner Component (Loading)',
    withInfo()(() => (
      <TomoBalanceComponent
        address="0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE"
        balance={null}
        isSubscribed={true}
        loadingMessage="Your balance is..."
        subscribeBalance={action('subscribeBalance')}
      />
    ))
  )
  .add(
    'Inner Component (Loaded)',
    withInfo()(() => (
      <TomoBalanceComponent
        address="0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE"
        balance="1.2345"
        isSubscribed={true}
        loadingMessage="Your balance is..."
        subscribeBalance={action('subscribeBalance')}
      />
    ))
  )
