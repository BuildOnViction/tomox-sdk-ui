// @flow
import React from 'react'
import { Callout, Intent } from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'

import TxReceipt from '../TxReceipt'

type Props = {
  error: string,
  receipt: Object,
  title: ?string
}

const TxErrorNotification = ({ error, receipt, title, transferFee, symbol }: Props) => (
  <Callout title={<FormattedMessage id="portfolioPage.transferTokensModal.transactionFailed" />} icon="info-sign" intent={Intent.DANGER}>
    <p>{error}</p>
    {receipt && <TxReceipt receipt={receipt} />}
  </Callout>
)

TxErrorNotification.defaultProps = {
  title: 'Transaction Failed',
}

export default TxErrorNotification
