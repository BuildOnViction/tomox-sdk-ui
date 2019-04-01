// @flow
import React from 'react'
import { Checkbox, InputGroup } from '@blueprintjs/core'
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

type Props = {
  connected: boolean,
  baseTokensData: Array<TokenData>,
  quoteTokensData: Array<TokenData>,
  TOMOTokenData: TokenData,
  WETHTokenData: TokenData,
  tokenDataLength: number,
  // provider: string,
  // depositTableData: Array<Object>,
  searchInput: string,
  handleSearchInputChange: (SyntheticEvent<>) => void,
  hideZeroBalanceToken: void => void,
  openDepositModal: string => void,
  openConvertModal: (string, string) => void,
  openSendModal: string => void,
  toggleAllowance: Symbol => void,
  toggleZeroBalanceToken: void => void,
  redirectToTradingPage: string => void,
}

const DepositTableRenderer = (props: Props) => {
  const {
    hideZeroBalanceToken,
    toggleZeroBalanceToken,
    // depositTableData,
    searchInput,
    handleSearchInputChange,
    tokenDataLength,
  } = props
  return (
    <TableSection>
      <RowSpaceBetween style={{ marginBottom: '10px' }}>
        <HideTokenCheck
          checked={hideZeroBalanceToken}
          onChange={toggleZeroBalanceToken}
        >
          Hide zero amounts
        </HideTokenCheck>
        
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
          {/* <TableHeaderCell>Unlocked</TableHeaderCell> */}
          <TableHeaderCell width="25%">
            <MutedText>Operation</MutedText>
          </TableHeaderCell>
        </TableHeader>
      </Table>
      <TableBodyContainer>
        <Table>
          <TableBody>
            <TOMORow {...props} />
            {/* <WETHRow {...props} /> */}
            <QuoteTokenRows {...props} />
            <BaseTokenRows {...props} />
          </TableBody>
        </Table>
        {tokenDataLength === 0 && <NoToken>No tokens</NoToken>}
      </TableBodyContainer>
    </TableSection>
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
          <OperationButton disabled={!connected} onClick={() => openSendModal(symbol)}>
            Send
          </OperationButton>
          <OperationButton disabled={!connected} onClick={() => openDepositModal(symbol)}>
            Receive
          </OperationButton>
        </ButtonWrapper>
        {/* <ButtonWrapper>
          <Button
            disabled={!connected}
            intent="success"
            text="Convert to WETH"
            onClick={() => openConvertModal(NATIVE_TOKEN_SYMBOL, 'WETH')}
            rightIcon="random"
          />
        </ButtonWrapper> */}
      </Cell>
    </Row>
  )
}

// const WETHRow = (props: Props) => {
//   const {
//     connected,
//     WETHTokenData,
//     toggleAllowance,
//     openDepositModal,
//     openSendModal,
//     openConvertModal,
//   } = props

//   if (!WETHTokenData) return null

//   const { symbol, balance, allowed, allowancePending } = WETHTokenData

//   return (
//     <Row key="WETH">
//       <Cell>
//         <TokenNameWrapper>
//           <ColoredCryptoIcon size={30} color={Colors.BLUE5} name={symbol} />
//           <span>{symbol}</span>
//         </TokenNameWrapper>
//       </Cell>
//       <Cell>
//         <div title={balance} style={{ maxWidth: 200 }}>
//           <Ellipsis>{balance}</Ellipsis>
//         </div>
//       </Cell>
//       <Cell>
//         <Switch
//           inline
//           checked={allowed}
//           onChange={() => toggleAllowance(symbol)}
//         />
//         {allowancePending && (
//           <Tag intent="success" large minimal interactive icon="time">
//             Pending
//           </Tag>
//         )}
//       </Cell>
//       <Cell style={{ width: '40%' }}>
//         <ButtonWrapper>
//           <Button
//             disabled={!connected}
//             intent="primary"
//             rightIcon="import"
//             text="Deposit"
//             onClick={() => openDepositModal(symbol)}
//           />
//         </ButtonWrapper>
//         <ButtonWrapper>
//           <Button
//             disabled={!connected}
//             intent="primary"
//             rightIcon="export"
//             text="Send"
//             onClick={() => openSendModal(symbol)}
//           />
//         </ButtonWrapper>
//         <ButtonWrapper>
//           <Button
//             disabled={!connected}
//             intent="success"
//             text="Convert to TOMO"
//             rightIcon="random"
//             onClick={() => openConvertModal('WETH', NATIVE_TOKEN_SYMBOL)}
//           />
//         </ButtonWrapper>
//       </Cell>
//     </Row>
//   )
// }

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
          {/* <Cell>
            <Switch
              inline
              checked={allowed}
              onChange={() => toggleAllowance(symbol)}
            />
            {allowancePending && (
              <Tag intent="success" large minimal interactive icon="time">
                Pending
              </Tag>
            )}
          </Cell> */}
          <Cell width="25%">
            <ButtonWrapper>
              <OperationButton onClick={() => redirectToTradingPage(symbol)}>
                Trade
              </OperationButton>
              <OperationButton disabled={!connected} onClick={() => openSendModal(symbol)}>
                Send
              </OperationButton>
              <OperationButton disabled={!connected} onClick={() => openDepositModal(symbol)}>
                Receive
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
    // toggleAllowance,
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
          {/* <Cell>
            <Switch
              inline
              checked={allowed}
              onChange={() => toggleAllowance(symbol)}
            />
            {allowancePending && (
              <Tag intent="success" large minimal interactive icon="time">
                Pending
              </Tag>
            )}
          </Cell> */}
          <Cell width="25%">
            <ButtonWrapper>
              <OperationButton onClick={() => redirectToTradingPage(symbol)}>
                Trade
              </OperationButton>
              <OperationButton disabled={!connected} onClick={() => openSendModal(symbol)}>
                Send
              </OperationButton>
              <OperationButton disabled={!connected} onClick={() => openDepositModal(symbol)}>
                Receive
              </OperationButton>
            </ButtonWrapper>
          </Cell>
        </Row>
      )
    }
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

const TokenNameWrapper = styled.div`
  display: flex;
  align-items: center;
  & svg,
  & img {
    margin-right: 12px;
  }
`

const HideTokenCheck = styled(Checkbox)`
  margin: 0 !important;

  .bp3-control-indicator {
    border-radius: 0 !important;
  }

  input:checked ~ .bp3-control-indicator {
    background-color: ${DarkMode.WHITE};
    box-shadow: none;
  }

  &:hover {
    // background-color: ${DarkMode.WHITE};
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

export default withRouter(DepositTableRenderer)
