// @flow
import React from 'react'
import styled, { keyframes } from 'styled-components'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { Loading, Colors, TmColors, Centered, UtilityIcon, Text, Theme } from '../../Common'

type BidOrAsk = {
  interest: number,
  amount: number,
  total: number
};

type Props = {
  bids: Array<BidOrAsk>,
  asks: Array<BidOrAsk>
};

const widthColumns = ['45%', '55%']

const NoData = () => {
  return (
    <Centered my={4}>
      <UtilityIcon name="not-found" width={32} height={32} />
      <Text sm={true} color={TmColors.GRAY}><FormattedMessage id="exchangePage.noOrderbook" />.</Text>
    </Centered>
  )
}

export class OrderBookRenderer extends React.PureComponent<Props> {
  state = {
    filter: 'all',
  }

  componentDidMount() {
    this.scrollToBottom('list-sell')
  }

  componentDidUpdate() {
    this.scrollToBottom('list-sell')
  }

  scrollToBottom(id: String) {
    const { bids, asks, currentPairData } = this.props

    if (bids.length === 0 && asks.length === 0 && !currentPairData) return
    if (this.state.filter !== 'all') return
    const $listSell = document.getElementById(id)
    $listSell.scrollTop = $listSell.scrollHeight
  }

  changeFilter(value: String) {
    this.setState({
      filter: value,
    })
  }

  getOrderBookClass() {
    const { filter } = this.state
    switch (filter) {
      case 'sell':
        return 'order-book sell'
      case 'buy':
        return 'order-book buy'
      default:
        return 'order-book all'
    }
  }

  render() {
    const { 
      bids, 
      asks, 
      onSelect,
      amountPrecision,
      currentPair,
      currentPairData,
    } = this.props        

    const isNoItems = (bids.length === 0 && asks.length === 0 && !currentPairData)

    return (
      <Wrapper className={ this.getOrderBookClass() }>

        {isNoItems && (<NoData />)}

        {!isNoItems && 
        (
          <OrderBookContent className="order-book-content all">
            {!bids && <Loading />}

            <ListHeading>
              <HeaderRow>
                <HeaderCell width={widthColumns[0]} className="header-cell">
                  <FormattedMessage id="exchangeLendingPage.orderbook.interestWithoutSymbol" />
                </HeaderCell>
                <AmountHeader width={widthColumns[1]} className="header-cell text-right">
                  <FormattedMessage id="exchangeLendingPage.orderbook.amountWithoutSymbol" />
                </AmountHeader>
              </HeaderRow>
            </ListHeading>

            <ListContent>
              {asks && (
                <Asks>
                  {asks.map((order, index) => (
                    <SellOrder 
                      key={index} 
                      order={order}
                      amountPrecision={amountPrecision} 
                      onClick={onSelect} />
                  ))}
                </Asks>
              )}
              
              <LatestTick>
                {currentPairData && (
                  <>
                    <CryptoPrice>
                      <Ellipsis title={BigNumber(currentPairData.close).toFormat(2)}>
                        {BigNumber(currentPairData.close).toFormat(2)}&#37; 
                      </Ellipsis>
                    </CryptoPrice>
                    <CashPrice>
                      <Ellipsis>{BigNumber(currentPairData.volume).toFormat(2)} {currentPair && currentPair.lendingTokenSymbol}</Ellipsis>
                    </CashPrice>
                  </>
                )}  
              </LatestTick>
              
              {bids && (
                <Bids>
                  {bids.map((order, index) => (
                    <BuyOrder 
                      key={index} 
                      order={order} 
                      amountPrecision={amountPrecision}
                      onClick={onSelect}/>
                  ))}
                </Bids>
              )}
            </ListContent>
          </OrderBookContent>
        )}
      </Wrapper>
    )
  }
}

export type SingleOrderProps = {
  order: Object,
  index: number
};

const BuyOrder = (props: SingleOrderProps) => {
  const { order, onClick } = props
  return (
    <Row update={order.update}>
      <BuyRowBackground amount={order.relativeTotal} />
      <Cell onClick={() => onClick({...order, type: "interest", side: "BORROW"})} className="up" width={widthColumns[0]}>{BigNumber(order.interest).toFormat(2)}&#37;</Cell>
      <AmountCell onClick={() => onClick({...order, type: "amount", side: "BORROW"})} className="text-right" width={widthColumns[1]}>{BigNumber(order.amount).toFormat(2)}</AmountCell>
    </Row>
  )
}

const SellOrder = (props: SingleOrderProps) => {
  const { order, onClick } = props
  return (
    <Row update={order.update}>
      <SellRowBackGround amount={order.relativeTotal} />
      <Cell onClick={() => onClick({...order, type: "interest", side: "INVEST"})} className="down" width={widthColumns[0]}>{BigNumber(order.interest).toFormat(2)}&#37;</Cell>
      <AmountCell onClick={() => onClick({...order, type: "amount", side: "INVEST"})} className="text-right" width={widthColumns[1]}>{BigNumber(order.amount).toFormat(2)}</AmountCell>
    </Row>
  )
}

const Wrapper = styled.div`
  height: 100%;
`

const OrderBookContent = styled.div`
  width: 100%;
  height: 100% !important;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`

const List = styled.ul`
  overflow-y: auto;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      overflow: hidden;
    }
  }
`

const Asks = styled(List).attrs({
  className: "bp3-list-unstyled list list-sell",
  id: "list-sell",
})`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const Bids = styled(List).attrs({
  className: "bp3-list-unstyled list list-buy",
  id: "list-buy",
})``

const fadeInLightMode = keyframes`
  0% {background: rgba(57, 67, 98, .1)}
  50% {background: rgba(57, 67, 98, .3)}
  100% {background: transparent}
`

const fadeInDarkMode = keyframes`
  0% {background: rgba(244, 246, 248, .1)}
  50% {background: rgba(244, 246, 248, .3)}
  100% {background: transparent}
`

/* eslint-disable */
const Row = styled.li.attrs({
  className: 'row',
})`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  position: relative;
  width: 100%;
  margin: 0px !important;
  padding-right: 10px !important;
  animation: ${props => props.update ? 
              (props.theme.mode === 'light' ? 
                fadeInLightMode 
                : fadeInDarkMode) 
              : ''} .3s ease;
  font-family: 'Ubuntu', sans-serif;
  font-size: 12px;
  user-select: none;

  &:hover {
    background-color: ${props => props.theme.orderbookHover};
  }
`

const SellRowBackGround = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: ${props => 100 * props.amount}% !important;
  background-color: ${Colors.SELL_MUTED} !important;
  z-index: 1;
`

const BuyRowBackground = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: ${props => 100 * props.amount}% !important;
  background-color: ${Colors.BUY_MUTED} !important;
  z-index: 1;
`

const Cell = styled.span`
  width: ${props => props.width? props.width : "35px"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  padding: 3.5px 0;

  &:hover {
    font-weight: 700;
  }
`

const AmountCell = styled(Cell)`
  padding: 3.5px 0;
`

const ListHeading = styled.ul.attrs({
  className: "list-header",
})`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0px;
  height: 14px;
  margin-bottom: 0;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      margin-bottom: 12px;
    }
  }
`

const ListContent = styled.div.attrs({
  className: "list-container",
})`
  display: flex;
  flex-direction: column;
  position: relative;
  height: calc(100% - 24px) !important;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      height: 370px !important;
      overflow: hidden;
    }
  }
`

const HeaderRow = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 0px !important;
  padding: 0 10px 10px 0;
  width: 100%;
`

const HeaderCell = styled.span`
  width: ${props => props.width? props.width : "35px"}
  height: fit-content;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Ubuntu', sans-serif;
  font-size: ${Theme.FONT_SIZE_SM};
`

const AmountHeader = styled(HeaderCell)``

const LatestTick = styled.div.attrs({
  className: 'latest-tick',
})`
  flex-grow: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-around;
  height: 30px;
  padding: 0;
  background: ${props => props.theme.orderbookLatestPrice};
`
const LatestPrice = styled.div.attrs({
  className: 'latest-price',
})`
  width: ${props => props.width? props.width : "70px"};
`

const CryptoPrice = styled.span``

const CashPrice = styled.span`
  color: #9ca4ba;
  font-size: ${Theme.FONT_SIZE_XS};
  margin-left: 5px;
`

const PercentChange = styled.div.attrs({
  className: "text-right",
})`
  width: ${props => props.width? props.width : "35px"}
`

const Ellipsis = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default OrderBookRenderer