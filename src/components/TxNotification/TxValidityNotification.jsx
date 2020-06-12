// @flow
import React from 'react'
import { Callout } from '@blueprintjs/core'

type Props = {
  status: string,
  statusMessage: string,
  transferFee: number
}

const TxValidityNotification = (props: Props) => {
  const { status, statusMessage, transferFee, symbol } = props
  if (status === 'invalid') {
    return renderInvalidTx(transferFee, statusMessage, symbol)
  } else if (status === 'valid') {
    return renderValidTx(transferFee, statusMessage, symbol)
  } 
    return null
  
}

const renderInvalidTx = (transferFee: number, statusMessage: string, symbol) => {
  return (
    <Callout intent="warning" icon="warning-sign" title={statusMessage}>
      Transaction Fee: {transferFee} {symbol}
    </Callout>
  )
}

const renderValidTx = (transferFee: number, statusMessage: string, symbol) => {
  return (
    <Callout intent="success" title={statusMessage}>
      Transaction Fee: {transferFee} {symbol}
    </Callout>
  )
}

export default TxValidityNotification
