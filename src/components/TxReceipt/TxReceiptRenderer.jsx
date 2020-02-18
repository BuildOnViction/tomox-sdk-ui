// @flow
import React from 'react'
import styled from 'styled-components'
import { Button, Collapse } from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
import { TmColors } from '../Common'

type Props = {
  visible: boolean,
  blockHash: string,
  blockNumber: string,
  gasLimit: number,
  hash: string,
  toggleVisible: (SyntheticEvent<>) => void
}

const TxReceiptRenderer = (props: Props) => {
  const { blockHash, blockNumber, gasUsed, visible, toggleVisible } = props
  return (
    <div>
      <ButtonReceipt minimal text={visible ? `Hide Receipt` : `Show Receipt`} onClick={toggleVisible} />
      <Collapse isOpen={visible}>
        <ul>
          <li key="1"><FormattedMessage id="portfolioPage.transferTokensModal.blockHash" />: <WordBreak>{blockHash}</WordBreak></li>
          <li key="2"><FormattedMessage id="portfolioPage.transferTokensModal.blockNumber" />: {blockNumber}</li>
          <li key="3"><FormattedMessage id="portfolioPage.transferTokensModal.gasUsed" />: {gasUsed}</li>
        </ul>
      </Collapse>
    </div>
  )
}

const ButtonReceipt = styled(Button)`
  &.bp3-button {
    background-color: ${props => props.theme.inputBackground2} !important;

    &:hover {
      color: ${props => props.theme.inputColor} !important;
    }
  }
`

const WordBreak = styled.p`
  word-break: break-all;
`

export default TxReceiptRenderer