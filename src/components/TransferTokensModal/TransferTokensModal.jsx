// @flow
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import Modal from '../Modal'
import TransferTokensFormContainer from '../TransferTokensForm'
import type { Token } from '../../types/tokens'

type Props = {
  isOpen: boolean,
  handleClose: (SyntheticEvent<>) => void,
  token: Token,
  tokens: Array<Token>
}

const TransferTokensModal = (props: Props) => (
  <ModalWrapper
    title={<FormattedMessage id="portfolioPage.transferTokensModal.title" />}
    icon="info-sign"
    isOpen={props.isOpen}
    onClose={props.handleClose}
    className={`${props.mode}-dialog sm`}
  >
    <TransferTokensFormContainer token={props.token} tokens={props.tokens} />
  </ModalWrapper>
)

const ModalWrapper = styled(Modal)`
  .bp3-dialog-body {
    margin: 0;
  }
`

export default TransferTokensModal
