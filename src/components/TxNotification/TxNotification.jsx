// @flow
import React from 'react'
import { Intent, Spinner } from '@blueprintjs/core'
import TxSuccessNotification from './TxSuccessNotification'
import TxErrorNotification from './TxErrorNotification'
import TxPendingNotification from './TxPendingNotification'
import TxValidityNotification from './TxValidityNotification'

type Props = {
  loading: boolean,
  hash: string,
  receipt: Object,
  status: string,
  statusMessage: string,
  gas: number,
  title: ?string
}

const TxNotification = (props: Props) => {
  const { hash, receipt, status, statusMessage, estimatedGas, title } = props
  switch (status) {
    case 'incomplete':
      return null
    case 'invalid':
      return renderValidityNotification('invalid', statusMessage, estimatedGas)
    case 'valid':
      return renderValidityNotification('valid', statusMessage, estimatedGas)
    case 'sent':
      return renderTxPendingNotification(hash, title)
    case 'confirmed':
      return renderTxSuccessNotification(hash, receipt, title)
    case 'reverted':
      return renderErrorNotification(statusMessage, receipt, title)
    case 'error':
      return renderErrorNotification(statusMessage, receipt, title, estimatedGas)
    default:
      return null
  }
}

// eslint-disable-next-line
const renderLoader = () => {
  return <Spinner intent={Intent.SUCCESS} />
}

const renderErrorNotification = (statusMessage: string, receipt: Object, title: ?string, estimatedGas) => {
  return <TxErrorNotification error={statusMessage} receipt={receipt} title={title} estimatedGas={estimatedGas} />
}

const renderValidityNotification = (status: string, statusMessage: string, gas: number) => {
  return <TxValidityNotification status={status} statusMessage={statusMessage} gas={gas} />
}

const renderTxPendingNotification = (hash: string, title: ?string) => {
  return <TxPendingNotification hash={hash} title={title} />
}

const renderTxSuccessNotification = (hash: string, receipt: Object, title: ?string) => {
  return <TxSuccessNotification hash={hash} receipt={receipt} title={title} />
}

export default TxNotification
