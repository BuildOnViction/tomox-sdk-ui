// @flow
import React from 'react'
import { Checkbox, InputGroup } from '@blueprintjs/core'
import {
  RowSpaceBetween,
  MutedText,
  Theme,
  DarkMode,
} from '../Common'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import type { TokenData, Symbol } from '../../types/tokens'
import tickUrl from '../../assets/images/tick.svg'

type Props = {
  connected: boolean,
  baseTokensData: Array<TokenData>,
  quoteTokensData: Array<TokenData>,
  TOMOTokenData: TokenData,
  tokenDataLength: number,
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

const FundsTableRenderer = (props: Props) => {
  const {
    isHideZeroBalanceToken,
    toggleZeroBalanceToken,
    searchInput,
    handleSearchInputChange,
    tokenDataLength,
  } = props
  return (
    <Wrapper>
      <TableSection>
        <RowSpaceBetween style={{ marginBottom: '10px' }}>
          <OperationButtonWrapper>
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
            <TableHeaderCell width="25%"><MutedText>Coin</MutedText></TableHeaderCell>
            <TableHeaderCell width="25%"><MutedText>Total</MutedText></TableHeaderCell>
            <TableHeaderCell width="25%"><MutedText>Available amount</MutedText></TableHeaderCell>
            <TableHeaderCell width="25%"><MutedText>In orders</MutedText></TableHeaderCell>
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
    </Wrapper>
  )
}

const TOMORow = (props: Props) => {
  const { TOMOTokenData } = props

  if (!TOMOTokenData) return null

  const { symbol, balance } = TOMOTokenData

  return (
    <Row key="TOMO">
      <Cell width="25%">
        <TokenNameWrapper>{symbol}</TokenNameWrapper>
      </Cell>
      <Cell width="25%">
        <Ellipsis title={balance}>{balance}</Ellipsis>
      </Cell>
      <Cell width="25%">
        <Ellipsis>-</Ellipsis>
      </Cell>
      <Cell width="25%">
        <Ellipsis>-</Ellipsis>
      </Cell>
    </Row>
  )
}

const QuoteTokenRows = (props: Props) => {
  const { quoteTokensData } = props

  if (!quoteTokensData) return null

  return quoteTokensData.map(
    ({ symbol, balance, allowed, image, allowancePending }, index) => {
      return (
        <Row key={index}>
          <Cell width="25%">{symbol}</Cell>
          <Cell width="25%">
            <Ellipsis title={balance}>{balance}</Ellipsis>
          </Cell>
          <Cell width="25%">
            <Ellipsis>-</Ellipsis>
          </Cell>
          <Cell width="25%">
            <Ellipsis>-</Ellipsis>
          </Cell>
        </Row>
      )
    }
  )
}

const BaseTokenRows = (props: Props) => {
  const { baseTokensData } = props

  if (!baseTokensData) return null

  return baseTokensData.map(
    ({ symbol, balance, image, allowancePending }, index) => {
      return (
        <Row key={index}>
          <Cell width="25%">{symbol}</Cell>
          <Cell width="25%">
            <Ellipsis title={balance}>{balance}</Ellipsis>
          </Cell>
          <Cell width="25%">
            <Ellipsis>-</Ellipsis>
          </Cell>
          <Cell width="25%">
            <Ellipsis>-</Ellipsis>
          </Cell>
        </Row>
      )
    }
  )
}

const Wrapper = styled.div`
  padding: 0 15px;
`

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
  height: 35px;
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
  height: 35px;
  padding: 0 20px;

  &:nth-child(2n+1) {
    background: ${DarkMode.BLACK};
  }
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

export default withRouter(FundsTableRenderer)
