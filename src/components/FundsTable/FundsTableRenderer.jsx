// @flow
import React from 'react'
import { Checkbox } from '@blueprintjs/core'
import {
  MutedText,
  Theme,
  TmColors,
  Link,
  Text,
  UtilityIcon,
  Centered,
} from '../Common'
import styled from 'styled-components'
import { withRouter, Link as InternalLink } from 'react-router-dom'
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

const rowHeight = 45
const WidthColums = ['15%', '30%', '30%', '25%']

class FundsTableRenderer extends React.PureComponent {
  state = {hasScrollbar: false}

  componentDidUpdate() {
    const tableBodyHeight = document.getElementById('funds-table-body').clientHeight
    const contentHeight = this.props.tokenDataLength * rowHeight
    const hasScrollbar = contentHeight > tableBodyHeight

    if (this.state.hasScrollbar !== hasScrollbar) {
      this.setState({hasScrollbar})
    }
  }

  render() {
    const {
      isHideZeroBalanceToken,
      toggleZeroBalanceToken,
      tokenDataLength,
      authenticated,
    } = this.props

    return (
      <Wrapper>
        <CheckboxWrapper
          label="Hide zero amounts"
          checked={isHideZeroBalanceToken}  
          onChange={toggleZeroBalanceToken} />

        <TableHeader style={{paddingRight: this.state.hasScrollbar ? '16px' : '10px'}}>
          <TableHeaderCell width={WidthColums[0]}><MutedText><FormattedMessage id="portfolioPage.coin" /></MutedText></TableHeaderCell>
          <TableHeaderCellXsHidden width={WidthColums[1]}><MutedText><FormattedMessage id="portfolioPage.total" /></MutedText></TableHeaderCellXsHidden>
          <TableHeaderCellXsHidden width={WidthColums[2]}><MutedText><FormattedMessage id="portfolioPage.availableAmount" /></MutedText></TableHeaderCellXsHidden>
          <HeaderCellXs width="60%"><FormattedMessage id="portfolioPage.total" />/<FormattedMessage id="portfolioPage.available" /></HeaderCellXs>
          <TableHeaderCell width={WidthColums[3]}><MutedText><FormattedMessage id="portfolioPage.inOrders" /></MutedText></TableHeaderCell>
        </TableHeader>

        <TableBodyContainer>
          <TableBody>
            {!authenticated && <LoginMessage />}
            {authenticated && (tokenDataLength === 0) && <NoItems />}
            {authenticated && (tokenDataLength > 0) && (
              <React.Fragment>
                <TOMORow {...this.props} />
                <QuoteTokenRows {...this.props} />
                <BaseTokenRows {...this.props} />
              </React.Fragment>
            )}            
          </TableBody>
        </TableBodyContainer>
      </Wrapper>
    )
  }
}

const LoginMessage = () => {
  return (
    <Centered my={4}>
      <UtilityIcon name="login" width={32} height={32} />
      <Text sm={true} color={TmColors.GRAY}>
        <FormattedMessage id="app.mustLogin1" />&nbsp;
        <LoginLink to="/unlock"><FormattedMessage id="app.mustLogin2" /></LoginLink>&nbsp;
        <FormattedMessage id="app.mustLogin3" />
      </Text>
    </Centered>
  )
}

const NoItems = () => {
  return (
    <Centered my={4}>
      <UtilityIcon name="not-found" width={32} height={32} />
      <Text sm={true} color={TmColors.GRAY}><FormattedMessage id="portfolioPage.notFound" />.</Text>
    </Centered>
  )
}

const TOMORow = (props: Props) => {
  const { accountAddress, TOMOTokenData } = props

  if (!TOMOTokenData) return null

  const { symbol, balance, availableBalance, inOrders } = TOMOTokenData

  return (
    <Row key="TOMO">
      <Cell width={WidthColums[0]}>
        <Link href={`${TOMOSCAN_URL}/address/${accountAddress}`} target="_blank">{symbol}</Link>
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
          <Link href={`${TOMOSCAN_URL}/tokens/${address}/trc21/${accountAddress}`} target="_blank">{symbol}</Link>
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
            <Link href={`${TOMOSCAN_URL}/tokens/${address}/trc21/${accountAddress}`} target="_blank">{symbol}</Link>
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
  height: 100%;
`

const TableHeader = styled.div`
  width: 100%;
  padding: 0 10px 10px 10px;
  display: flex;
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

const TableBodyContainer = styled.div.attrs({
  id: 'funds-table-body',
})`
  width: 100%;
  height: calc(100% - 25px);
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
  height: ${rowHeight}px;
  padding: 0 10px;

  &:nth-child(2n+1) {
    background: ${props => props.theme.subBg};
  }
`

const HeaderCellXs = styled(CellXs)`
  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      align-items: start;
      justify-content: start;
      flex-flow: row;
    }
  }
`

const CheckboxWrapper = styled(Checkbox)`
  font-size: ${Theme.FONT_SIZE_SM};
  text-align: center;
  margin-bottom: 0 !important;
  position: absolute !important;
  top: 2px;
  right: 10px;
  user-select: none;

  .bp3-control-indicator {
    box-shadow: none !important;
    background-image: none !important;
  }

  input:checked ~ .bp3-control-indicator {
    background-color: ${TmColors.ORANGE} !important;
  }

  input:checked ~ .bp3-control-indicator::before {
    background: url(${tickUrl}) no-repeat center center !important;
  }
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

const LoginLink = styled(InternalLink)`
  color: ${props => props.color || props.theme.linkText};

  &:hover {
      color: ${TmColors.DARK_ORANGE};
  }
`

export default withRouter(FundsTableRenderer)
