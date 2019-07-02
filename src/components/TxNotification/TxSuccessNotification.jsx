// @flow
import React from 'react'
import styled from 'styled-components'
import { Callout, Intent } from '@blueprintjs/core'
import TxReceipt from '../TxReceipt'

type Props = {
  receipt: Object,
  hash: string,
  title: ?string
}

const TxSuccessNotification = ({ receipt, hash, title }: Props) => (
  <Callout intent={Intent.SUCCESS} title={title}>
    <p>Transaction Hash:</p>
    <WordBreak title={hash}>{hash}</WordBreak>
    <TxReceipt receipt={receipt} />
  </Callout>
)

TxSuccessNotification.defaultProps = {
  title: 'Transaction successful',
}

export default TxSuccessNotification

const WordBreak = styled.p`
  word-break: break-all;
`
