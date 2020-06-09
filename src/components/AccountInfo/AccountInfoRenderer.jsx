import React from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { injectIntl, FormattedMessage } from 'react-intl'

function AccountRenderer({ intl, address }) {
  if (!address) return null

  return (
    <Wrapper>
      <Title><FormattedMessage id="app.wallet" /></Title>
      <AlignCenter><QRCode value={address} size={200} includeMargin={true} /></AlignCenter> 
      <AlignCenter>{address}</AlignCenter>
      <AlignCenter>
        <CopyToClipboard text={address}>
          <CopyButton title={intl.formatMessage({ id: "portfolioPage.receiveModal.copyAddress" })}>
            <Typo><FormattedMessage id="createWalletPage.copyAddress" /></Typo>
            <i className="fa fa-clone" aria-hidden="true"></i>
          </CopyButton> 
        </CopyToClipboard>
      </AlignCenter>    
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 0 10px;
`

const AlignCenter = styled.div`
  display: flex;
  justify-content: center;
  word-break: break-all;
  margin-bottom: 17px;
`

const CopyButton = styled.span`
  cursor: pointer;
  padding: 7px 20px;
  border-radius: 3px;
  background-color: #2d3650;
`

const Title = styled.div`
  margin-bottom: 25px;
`

const Typo = styled.span`
  margin-right: 3px;
`

export default injectIntl(AccountRenderer)