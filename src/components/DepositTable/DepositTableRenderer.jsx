// @flow
import React from 'react'
import QRCode from 'qrcode.react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { Checkbox, InputGroup, Dialog, Icon } from '@blueprintjs/core'
import {
  RowSpaceBetween,
  ColoredCryptoIcon,
  TokenIcon,
  Colors,
  MutedText,
  // SmallText,
  Theme,
  DarkMode,
} from '../Common'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import type { TokenData, Symbol } from '../../types/tokens'
// import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'
import tickUrl from '../../assets/images/tick.svg'
import doubleArrowsUpUrl from '../../assets/images/double_arrows_up.svg'

type Props = {
  connected: boolean,
  baseTokensData: Array<TokenData>,
  quoteTokensData: Array<TokenData>,
  TOMOTokenData: TokenData,
  tokenDataLength: number,
  // provider: string,
  // depositTableData: Array<Object>,
  searchInput: string,
  handleSearchInputChange: (SyntheticEvent<>) => void,
  isHideZeroBalanceToken: boolean,
  openDepositModal: string => void,
  openConvertModal: (string, string) => void,
  openSendModal: string => void,
  toggleAllowance: Symbol => void,
  toggleZeroBalanceToken: void => void,
  redirectToTradingPage: string => void,
}

const DepositTableRenderer = (props: Props) => {
  const {
    isHideZeroBalanceToken,
    toggleZeroBalanceToken,
    // depositTableData,
    searchInput,
    handleSearchInputChange,
    tokenDataLength,
    accountAddress,
    isOpenReceiveDialog,
    openReceiveDialog,
    closeReceiveDialog,
    notifyCopiedSuccess,
    openSendModal,
  } = props
  return (
    <React.Fragment>
      <TableSection>
        <RowSpaceBetween style={{ marginBottom: '10px' }}>
          <OperationButtonWrapper>
            <MarginButton onClick={openSendModal}>
              <DoubleArrowsUpIcon src={doubleArrowsUpUrl} alt="Send icon"></DoubleArrowsUpIcon>
              Send
            </MarginButton>
            <MarginButton onClick={openReceiveDialog}>
              <DoubleArrowsDownIcon src={doubleArrowsUpUrl} alt="Receive icon"></DoubleArrowsDownIcon>
              Receive
            </MarginButton>

            <CheckboxWrapper
              label="Hide zero amounts"
              checked={isHideZeroBalanceToken}  
              onChange={toggleZeroBalanceToken} />
          </OperationButtonWrapper>
          
          <SearchWrapper
              type="string"
              leftIcon="search"
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
        </RowSpaceBetween>
        <Table>
          <TableHeader>
            <TableHeaderCell width="24%"><MutedText>Coin</MutedText></TableHeaderCell>
            <TableHeaderCell width="17%"><MutedText>Total</MutedText></TableHeaderCell>
            <TableHeaderCell width="17%"><MutedText>Available amount</MutedText></TableHeaderCell>
            <TableHeaderCell width="17%"><MutedText>In orders</MutedText></TableHeaderCell>
            <TableHeaderCell width="25%">
              <MutedText>Operation</MutedText>
            </TableHeaderCell>
          </TableHeader>
        </Table>
        <TableBodyContainer>
          <Table>
            <TableBody>
              <TOMORow {...props} />
              <QuoteTokenRows {...props} />
              <BaseTokenRows {...props} />
            </TableBody>
          </Table>
          {tokenDataLength === 0 && <NoToken>No tokens</NoToken>}
        </TableBodyContainer>
      </TableSection>

      <ReceiveDialog
        notifyCopiedSuccess={notifyCopiedSuccess}
        accountAddress={accountAddress}
        isOpen={isOpenReceiveDialog} 
        onClose={closeReceiveDialog} />
    </React.Fragment>
  )
}

const TOMORow = (props: Props) => {
  const {
    connected,
    TOMOTokenData,
    openDepositModal,
    openSendModal,
    // openConvertModal,
    redirectToTradingPage,
  } = props

  if (!TOMOTokenData) return null

  const { symbol, balance } = TOMOTokenData

  return (
    <Row key="TOMO">
      <Cell width="24%">
        <TokenNameWrapper>
          <ColoredCryptoIcon size={30} color={Colors.BLUE5} name={symbol} />
          <span>{symbol}</span>
        </TokenNameWrapper>
      </Cell>
      <Cell width="17%">
        <Ellipsis title={balance}>{balance}</Ellipsis>
      </Cell>
      <Cell width="17%">
        <Ellipsis>-</Ellipsis>
      </Cell>
      <Cell width="17%">
        <Ellipsis>-</Ellipsis>
      </Cell>
      <Cell width="25%">
        <ButtonWrapper>
          <OperationButton onClick={() => redirectToTradingPage(symbol)}>
            Trade
          </OperationButton>
          <OperationButton disabled={!connected} onClick={() => openDepositModal(symbol)}>
            Deposit
          </OperationButton>
          <OperationButton disabled={!connected} onClick={() => openSendModal(symbol)}>
            Withdrawal
          </OperationButton>          
        </ButtonWrapper>
      </Cell>
    </Row>
  )
}

const QuoteTokenRows = (props: Props) => {
  const {
    connected,
    quoteTokensData,
    // toggleAllowance,
    openDepositModal,
    openSendModal,
    redirectToTradingPage,
  } = props

  if (!quoteTokensData) return null

  return quoteTokensData.map(
    ({ symbol, balance, allowed, image, allowancePending }, index) => {
      return (
        <Row key={index}>
          <Cell width="24%">
            <TokenNameWrapper>
              <TokenIcon image={image} symbol={symbol} size={30} />
              <span>{symbol}</span>
            </TokenNameWrapper>
          </Cell>
          <Cell width="17%">
            <Ellipsis title={balance}>{balance}</Ellipsis>
          </Cell>
          <Cell width="17%">
            <Ellipsis>-</Ellipsis>
          </Cell>
          <Cell width="17%">
            <Ellipsis>-</Ellipsis>
          </Cell>
          <Cell width="25%">
            <ButtonWrapper>
              <OperationButton onClick={() => redirectToTradingPage(symbol)}>
                Trade
              </OperationButton>
              <OperationButton disabled={!connected} onClick={() => openDepositModal(symbol)}>
                Deposit
              </OperationButton>  
              <OperationButton disabled={!connected} onClick={() => openSendModal(symbol)}>
                Withdrawal
              </OperationButton>
            </ButtonWrapper>
          </Cell>
        </Row>
      )
    }
  )
}

const BaseTokenRows = (props: Props) => {
  const {
    baseTokensData,
    connected,
    openDepositModal,
    openSendModal,
    redirectToTradingPage,
  } = props

  if (!baseTokensData) return null

  return baseTokensData.map(
    ({ symbol, balance, allowed, image, allowancePending }, index) => {
      return (
        <Row key={index}>
          <Cell width="24%">
            <TokenNameWrapper>
              <TokenIcon image={image} symbol={symbol} size={30} />
              <span>{symbol}</span>
            </TokenNameWrapper>
          </Cell>
          <Cell width="17%">
            <Ellipsis title={balance}>{balance}</Ellipsis>
          </Cell>
          <Cell width="17%">
            <Ellipsis>-</Ellipsis>
          </Cell>
          <Cell width="17%">
            <Ellipsis>-</Ellipsis>
          </Cell>
          <Cell width="25%">
            <ButtonWrapper>
              <OperationButton onClick={() => redirectToTradingPage(symbol)}>
                Trade
              </OperationButton>
              <OperationButton disabled={!connected} onClick={() => openDepositModal(symbol)}>
                Deposit
              </OperationButton>
              <OperationButton disabled={!connected} onClick={() => openSendModal(symbol)}>
                Withdrawal
              </OperationButton>
            </ButtonWrapper>
          </Cell>
        </Row>
      )
    }
  )
}

const ReceiveDialog = (props) => {
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

const SearchWrapper= styled(InputGroup)`
  .bp3-input {
    color: ${DarkMode.BLACK};
    min-width: 300px;
    background: ${DarkMode.BLACK};
    border-radius: 0;
    &:focus, 
    &.bp3-active {
      box-shadow: none;
    }
  }
`

const Table = styled.div.attrs({
  className: 'bp3-html-table bp3-interactive bp3-html-table-striped',
})`
  width: 100%;
`

const TableHeader = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;  
  padding: 0 20px;
  &:last-child {
    flex-grow: 2;
  }
`

const TableHeaderCell = styled.div`
  display: flex;
  width: ${props => props.width || '15%'};
  justify-content: ${({align}) => align || 'flex-start'};
  flex-grow: ${({flexGrow}) => flexGrow || 0}
`

const TableBodyContainer = styled.div`
  width: 100%;
  height: 80%;
  overflow-y: auto;
`

const TableSection = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: column;
  height: 100%;
  width: 99%;
`

const TableBody = styled.div`
  height: calc(100% - 100px);
  color: ${DarkMode.WHITE}
`

const Cell = styled.div`
  width: ${({width}) => width || '15%'};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({align}) => align || 'flex-start'}
  flex-grow: ${({flexGrow}) => flexGrow || 0}
`

const Row = styled.div`
  display: flex;
  width: 100%;
  height: ${Theme.ROW_HEIGHT_LG};
  padding: 0 20px;

  &:nth-child(2n+1) {
    background: ${DarkMode.BLACK};
  }

  @media only screen and (max-width: ${Theme.BREAK_POINT_MD}) {
    height: ${Theme.ROW_HEIGHT_MD};
    font-size: ${Theme.FONT_SIZE_SM};
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const OperationButton = styled.button.attrs(({ disabled }) => ({
  disabled,
}))`
  border: none;
  background: transparent;
  padding: 5px 0;
  cursor: pointer;
  color: ${DarkMode.GRAY};
  font-size: ${Theme.FONT_SIZE_MD};

  &[disabled] {
    cursor: default;
  }
  &:hover {
    color: ${DarkMode.ORANGE};
  }
`

const MarginButton = styled(OperationButton)`
  display: flex;
  justify-content: center;
  margin-right: 25px;
`

const OperationButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`

const TokenNameWrapper = styled.div`
  display: flex;
  align-items: center;
  & svg,
  & img {
    margin-right: 12px;
  }
`

const CheckboxWrapper = styled(Checkbox)`
  font-size: ${Theme.FONT_SIZE_SM};
  text-align: center;
  margin-bottom: 0 !important;

  .bp3-control-indicator {
    box-shadow: none !important;
    background-image: none !important;
  }

  input:checked ~ .bp3-control-indicator {
    background-color: ${DarkMode.ORANGE} !important;
  }

  input:checked ~ .bp3-control-indicator::before {
    background: url(${tickUrl}) no-repeat center center !important;
  }
`

const NoToken = styled.p`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
`

const Ellipsis = styled.span`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

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

const DoubleArrowsUpIcon = styled.img`
  margin-right: 10px;
`

const DoubleArrowsDownIcon = styled(DoubleArrowsUpIcon)`
  transform: rotate(180deg);
`

export default withRouter(DepositTableRenderer)
