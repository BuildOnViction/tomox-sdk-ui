// @flow
import React from 'react'
import styled from 'styled-components'
import { Callout, Intent } from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
import { TOMOSCAN_URL } from '../../config/environment'
import { TmColors } from '../Common'

type Props = {
  receipt: Object,
  hash: string,
  title: ?string
}

const TxSuccessNotification = ({ receipt, hash, title }: Props) => (
  <Callout intent={Intent.SUCCESS} title={title}>
    <p><FormattedMessage id="portfolioPage.transferTokensModal.txHash" /></p>
    <WordBreak title={hash}><Link href={`${TOMOSCAN_URL}/txs/${hash}`} target="_blank">{hash}</Link></WordBreak>
  </Callout>
)

TxSuccessNotification.defaultProps = {
  title: 'Transaction successful',
}

const WordBreak = styled.p`
  word-break: break-all;
`

const Link = styled.a`
  color: ${TmColors.GRAY};
  &:hover {
    color: ${TmColors.LIGHT_GRAY}; 
  }
`

export default TxSuccessNotification

