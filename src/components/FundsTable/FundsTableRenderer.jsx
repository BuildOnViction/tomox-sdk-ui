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
import { truncateZeroDecimal } from '../../utils/helpers'
import type { TokenData } from '../../types/tokens'
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

      <TableHeader>
        <TableHeaderCell width="25%"><MutedText>Coin</MutedText></TableHeaderCell>
        <TableHeaderCell width="25%"><MutedText>Total</MutedText></TableHeaderCell>
        <TableHeaderCell width="25%"><MutedText>Available amount</MutedText></TableHeaderCell>
        <TableHeaderCell width="25%"><MutedText>In orders</MutedText></TableHeaderCell>
      </TableHeader>

      <TableBodyContainer>
        <TableBody>
          <TOMORow {...props} />
          <QuoteTokenRows {...props} />
          <BaseTokenRows {...props} />
        </TableBody>
        {tokenDataLength === 0 && <NoToken>No tokens</NoToken>}
      </TableBodyContainer>
    </Wrapper>
  )
}

const TOMORow = (props: Props) => {
  const { TOMOTokenData } = props

  if (!TOMOTokenData) return null

  const { symbol, balance, availableBalance, inOrders } = TOMOTokenData

  return (
    <Row key="TOMO">
      <Cell width="25%">
        <TokenNameWrapper>{symbol}</TokenNameWrapper>
      </Cell>
      <Cell width="25%">
        <Ellipsis title={balance}>{truncateZeroDecimal(balance)}</Ellipsis>
      </Cell>
      <Cell width="25%">
        <Ellipsis>{truncateZeroDecimal(availableBalance)}</Ellipsis>
      </Cell>
      <Cell width="25%">
        <Ellipsis>{truncateZeroDecimal(inOrders)}</Ellipsis>
      </Cell>
    </Row>
  )
}

const QuoteTokenRows = (props: Props) => {
  const { quoteTokensData } = props

  if (!quoteTokensData) return null

  return quoteTokensData.map(
    ({ symbol, balance, availableBalance, inOrders }, index) => {
      return (
        <Row key={index}>
          <Cell width="25%">{symbol}</Cell>
          <Cell width="25%">
            <Ellipsis title={balance}>{truncateZeroDecimal(balance)}</Ellipsis>
          </Cell>
          <Cell width="25%">
            <Ellipsis>{truncateZeroDecimal(availableBalance)}</Ellipsis>
          </Cell>
          <Cell width="25%">
            <Ellipsis>{truncateZeroDecimal(inOrders)}</Ellipsis>
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
    ({ symbol, balance, availableBalance, inOrders }, index) => {
      return (
        <Row key={index}>
          <Cell width="25%">{symbol}</Cell>
          <Cell width="25%">
            <Ellipsis title={balance}>{truncateZeroDecimal(balance)}</Ellipsis>
          </Cell>
          <Cell width="25%">
            <Ellipsis>{truncateZeroDecimal(availableBalance)}</Ellipsis>
          </Cell>
          <Cell width="25%">
            <Ellipsis>{truncateZeroDecimal(inOrders)}</Ellipsis>
          </Cell>
        </Row>
      )
    }
  )
}

const Wrapper = styled.div`
  padding: 0 15px;
  height: 100%;
`

const SearchWrapper= styled(InputGroup)`
  .bp3-input {
    color: ${DarkMode.LIGHT_GRAY};
    max-width: 220px;
    background: ${props => props.theme.subBg};
    border-radius: 0;
    &:focus, 
    &.bp3-active {
      box-shadow: none;
    }
  }
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
  height: calc(100% - 75px);
  overflow-y: auto;
`

const TableBody = styled.div`
  height: 100%;
  color: ${props => props.theme.textTable};
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
  height: 45px;
  padding: 0 20px;

  &:nth-child(2n+1) {
    background: ${props => props.theme.subBg};
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
