// @flow
import React from 'react'
import { Checkbox, InputGroup } from '@blueprintjs/core'
import {
  RowSpaceBetween,
  MutedText,
  Theme,
  DarkMode,
  TmColors,
  Link,
} from '../Common'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { TOMOSCAN_URL } from '../../config/environment'
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

const WidthColums = ['20%', '30%', '30%', '20%']

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
        <TableHeaderCell width={WidthColums[0]}><MutedText><FormattedMessage id="portfolioPage.coin" /></MutedText></TableHeaderCell>
        <TableHeaderCellXsHidden width={WidthColums[1]}><MutedText><FormattedMessage id="portfolioPage.total" /></MutedText></TableHeaderCellXsHidden>
        <TableHeaderCellXsHidden width={WidthColums[2]}><MutedText><FormattedMessage id="portfolioPage.availableAmount" /></MutedText></TableHeaderCellXsHidden>
        <CellXs width="60%"><FormattedMessage id="portfolioPage.total" />/<FormattedMessage id="portfolioPage.availableAmount" /></CellXs>
        <TableHeaderCell width={WidthColums[3]}><MutedText><FormattedMessage id="portfolioPage.inOrders" /></MutedText></TableHeaderCell>
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
  const { accountAddress, TOMOTokenData } = props

  if (!TOMOTokenData) return null

  const { symbol, balance, availableBalance, inOrders } = TOMOTokenData

  return (
    <Row key="TOMO">
      <Cell width={WidthColums[0]}>
        <Link href={`${TOMOSCAN_URL}/address/${accountAddress}`} target="blank" color={TmColors.WHITE}>{symbol}</Link>
      </Cell>
      <CellXsHidden width={WidthColums[1]}>
        <Ellipsis title={balance}>{truncateZeroDecimal(balance)}</Ellipsis>
      </CellXsHidden>
      <CellXsHidden width={WidthColums[2]}>
        <Ellipsis>{truncateZeroDecimal(availableBalance)}</Ellipsis>
      </CellXsHidden>
      <CellXs width="65%">
        <TotalBalance>{truncateZeroDecimal(balance)}</TotalBalance>
        <span>{truncateZeroDecimal(availableBalance)}</span> 
      </CellXs>
      <Cell width={WidthColums[3]}>
        <Ellipsis>{truncateZeroDecimal(inOrders)}</Ellipsis>
      </Cell>
    </Row>
  )
}

const QuoteTokenRows = (props: Props) => {
  const { accountAddress, quoteTokensData } = props

  if (!quoteTokensData) return null

  return quoteTokensData.map(
    ({ symbol, balance, availableBalance, inOrders, address }, index) => {
      return (
        <Row key={index}>
          <Cell width={WidthColums[0]}>
          <Link href={`${TOMOSCAN_URL}/tokens/${address}/trc21/${accountAddress}`} target="blank" color={TmColors.WHITE}>{symbol}</Link>
          </Cell>
          <CellXsHidden width={WidthColums[1]}>
            <Ellipsis title={balance}>{truncateZeroDecimal(balance)}</Ellipsis>
          </CellXsHidden>
          <CellXsHidden width={WidthColums[2]}>
            <Ellipsis>{truncateZeroDecimal(availableBalance)}</Ellipsis>
          </CellXsHidden>
          <CellXs width="65%">
            <TotalBalance>{truncateZeroDecimal(balance)}</TotalBalance>
            <span>{truncateZeroDecimal(availableBalance)}</span>
          </CellXs>
          <Cell width={WidthColums[3]}>
            <Ellipsis>{truncateZeroDecimal(inOrders)}</Ellipsis>
          </Cell>
        </Row>
      )
    }
  )
}

const BaseTokenRows = (props: Props) => {
  const { accountAddress, baseTokensData } = props

  if (!baseTokensData) return null

  return baseTokensData.map(
    ({ symbol, balance, availableBalance, inOrders, address }, index) => {
      return (
        <Row key={index}>
          <Cell width={WidthColums[0]}>
            <Link href={`${TOMOSCAN_URL}/tokens/${address}/trc21/${accountAddress}`} target="blank" color={TmColors.WHITE}>{symbol}</Link>
          </Cell>
          <CellXsHidden width={WidthColums[1]}>
            <Ellipsis title={balance}>{truncateZeroDecimal(balance)}</Ellipsis>
          </CellXsHidden>
          <CellXsHidden width={WidthColums[2]}>
            <Ellipsis>{truncateZeroDecimal(availableBalance)}</Ellipsis>
          </CellXsHidden>
          <CellXs width="65%">
            <TotalBalance>{truncateZeroDecimal(balance)}</TotalBalance>
            <span>{truncateZeroDecimal(availableBalance)}</span>
          </CellXs>
          <Cell width={WidthColums[3]}>
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

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      padding: 0 10px;
    }
  }
`

const SearchWrapper= styled(InputGroup).attrs({
  className: 'xs-hidden',
})`
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
  padding: 0 10px;
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

const TableHeaderCellXsHidden = styled(TableHeaderCell).attrs({
  className: 'xs-hidden',
})``

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

const CellXs = styled(Cell)`
  display: none;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      display: flex;
      flex-flow: column;
      align-items: start;
      justify-content: center;
      line-height: 16px;
    }
  }
`

const CellXsHidden = styled(Cell).attrs({
  className: 'xs-hidden',
})``

const Row = styled.div`
  display: flex;
  width: 100%;
  height: 45px;
  padding: 0 10px;

  &:nth-child(2n+1) {
    background: ${props => props.theme.subBg};
  }
`

const OperationButtonWrapper = styled.div`
  display: flex;
  align-items: center;
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

const TotalBalance = styled.span`
  color: ${props => props.theme.link};
`

export default withRouter(FundsTableRenderer)
