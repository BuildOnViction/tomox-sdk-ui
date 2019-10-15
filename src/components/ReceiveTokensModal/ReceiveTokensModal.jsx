// @flow
import React from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Dialog, Icon } from '@blueprintjs/core'
import { injectIntl, FormattedMessage } from 'react-intl'
import {
  Theme,
  TmColors,
} from '../Common'

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
  } = props

  return (
    <Dialog
      className="dark-dialog sm"
      onClose={onClose}
      title={<FormattedMessage id="portfolioPage.receiveModal.title" />}
      canOutsideClickClose={false}
      isOpen={isOpen}
      >
        <Title><FormattedMessage id="portfolioPage.receiveModal.copyAddress" />:</Title>

        <AddressWrapper>
          <AddressText>{accountAddress}</AddressText>
          <CopyToClipboard text={accountAddress} onCopy={notifyCopiedSuccess}>
            <CopyIconBox title={intl.formatMessage({ id: "portfolioPage.receiveModal.copyAddress" })}><Icon icon="applications" /></CopyIconBox> 
          </CopyToClipboard>
        </AddressWrapper>

        <ScanQRTitle><FormattedMessage id="portfolioPage.receiveModal.qrCode" /></ScanQRTitle>
        <QRImage><QRCode value={accountAddress} size={180} includeMargin={true} /></QRImage>  
    </Dialog>
  )
}

export default injectIntl(ReceiveTokensModal)

const Title = styled.div`
  margin-bottom: 7px;
  font-size: ${Theme.FONT_SIZE_LG};
`

const AddressWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover div {
    color: ${TmColors.ORANGE};
  }
`

const AddressText = styled.div``

const CopyIconBox = styled.span`
  cursor: pointer;
  padding: 5px;

  &:hover {
    background-color: ${TmColors.LIGHT_BLUE};
  }
`

const ScanQRTitle = styled(Title)`
  margin: 30px auto 35px;
  position: relative;

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
    right: 110%;
  }

  :after {
    left: 110%;
  }
`

const QRImage = styled.div`
  text-align: center;
  margin-bottom: 30px;
`

