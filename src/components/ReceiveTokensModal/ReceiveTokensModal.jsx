// @flow
import React from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Dialog, Icon } from '@blueprintjs/core'
import {
  Theme,
  DarkMode,
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
  } = props

  return (
    <Dialog
      className="dark-dialog sm"
      onClose={onClose}
      title="Receive tokens"
      canOutsideClickClose={false}
      isOpen={isOpen}
      >
        <Title>Copy address:</Title>

        <AddressWrapper>
          <AddressText>{accountAddress}</AddressText>
          <CopyToClipboard text={accountAddress} onCopy={notifyCopiedSuccess}>
            <CopyIconBox title="Copy Address"><Icon icon="applications" /></CopyIconBox> 
          </CopyToClipboard>
        </AddressWrapper>

        <ScanQRTitle>or Scan QR Code</ScanQRTitle>
        <QRImage><QRCode value={accountAddress} size={180} includeMargin={true} /></QRImage>  
    </Dialog>
  )
}

export default ReceiveTokensModal

const Title = styled.div`
  margin-bottom: 7px;
  font-size: ${Theme.FONT_SIZE_LG};
`

const AddressWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover div {
    color: ${DarkMode.ORANGE};
  }
`

const AddressText = styled.div``

const CopyIconBox = styled.span`
  cursor: pointer;
  padding: 5px;

  &:hover {
    background-color: ${DarkMode.LIGHT_BLUE};
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
    border-top: 1px solid ${DarkMode.GRAY};
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

