// @flow
import React from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Icon } from '@blueprintjs/core'
import { injectIntl, FormattedMessage } from 'react-intl'
import {
  Theme,
  TmColors,
} from '../Common'
import Modal from '../Modal'

type Props = {
  isOpen: boolean,  
  accountAddress: string,
  onClose: (SyntheticEvent<>) => void,
  notifyCopiedSuccess: void => void
}

const ReceiveTokensModal = (props: Props) => {
  const {
    notifyCopiedSuccess,
    accountAddress,
    onClose,
    isOpen,
    intl,
    mode,
  } = props  

  return (
    <Modal
      className={`${mode}-dialog sm`}
      onClose={onClose}
      title={<FormattedMessage id="portfolioPage.receiveModal.title" />}
      isOpen={isOpen}>
        <ModalContent>
          <Title><FormattedMessage id="portfolioPage.receiveModal.copyAddress" />:</Title>

          <AddressWrapper>
            <AddressText>{accountAddress}</AddressText>
            <CopyToClipboard text={accountAddress} onCopy={notifyCopiedSuccess}>
              <CopyIconBox title={intl.formatMessage({ id: "portfolioPage.receiveModal.copyAddress" })}>
                <i class="fa fa-clone fa-lg" aria-hidden="true"></i>
              </CopyIconBox> 
            </CopyToClipboard>
          </AddressWrapper>

          <ScanQRTitle><FormattedMessage id="portfolioPage.receiveModal.qrCode" /></ScanQRTitle>
          <QRImage><QRCode value={accountAddress} size={180} includeMargin={true} /></QRImage>  
        </ModalContent>
    </Modal>
  )
}

const ModalContent = styled.div``

const Title = styled.div`
  margin-bottom: 7px;
  font-size: ${Theme.FONT_SIZE_LG};
`

const AddressWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const AddressText = styled.div``

const CopyIconBox = styled.span`
  cursor: pointer;
  padding: 5px;

  &:hover .bp3-icon.bp3-icon-applications {
    color: ${props => props.theme.mainColorHover};
  }
`

const ScanQRTitle = styled(Title)`
  margin: 30px auto 35px;
  position: relative;
  text-align: center;

  :before,
  :after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 50%;
    width: 140px;
    border-top: 1px solid ${TmColors.GRAY};
  }

  :before {
    left: 0;
  }

  :after {
    right: 0;
  }
`

const QRImage = styled.div`
  text-align: center;
  margin-bottom: 30px;
`

export default injectIntl(ReceiveTokensModal)

