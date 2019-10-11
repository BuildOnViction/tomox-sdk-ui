// @flow
import React from 'react'
import { FormattedMessage } from 'react-intl'
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
  <Modal
    title={<FormattedMessage id="portfolioPage.transferTokensModal.title" />}
    icon="info-sign"
    isOpen={props.isOpen}
    onClose={props.handleClose}
    className="dark-dialog sm"
  >
    <TransferTokensFormContainer token={props.token} tokens={props.tokens} />
  </Modal>
)

export default TransferTokensModal
