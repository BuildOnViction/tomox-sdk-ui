import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs/react'
import { withInfo } from '@storybook/addon-info'
import FundsTableRenderer from './FundsTableRenderer'
import { Card } from '@blueprintjs/core'

import { mockDepositTableData } from '../../mockData'

storiesOf('Funds Table', module)
  .addDecorator(withKnobs)
  .add(
    'Default Export',
    withInfo({ source: false })(() => (
      <Card className="bp3-dark">
        <FundsTableRenderer depositData={mockDepositTableData} />
      </Card>
    ))
  )
