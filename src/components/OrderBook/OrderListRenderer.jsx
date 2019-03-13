// @flow
import React from 'react'
import styled from 'styled-components'
import { Loading, Colors } from '../Common'
import { Popover, Card, Position } from '@blueprintjs/core'

type BidOrAsk = {
  price: number,
  amount: number,
  total: number
};

type Props = {
  bids: Array<BidOrAsk>,
  asks: Array<BidOrAsk>
};

export const OrderBookRenderer = (props: Props) => {
  const { bids, asks } = props
  return (
    <Wrapper>
      <OrderBookHeader className="order-book-header">
        <Title className="title">Orderbook</Title>

        <Popover
          content={'todo: decimals list'}
          position={Position.BOTTOM_RIGHT}
          minimal>
          <div className="decimals-dropdown">
            <span>7 decimals</span> 
            <span className="arrow-down"></span>
          </div>
        </Popover>

        <FilterList className="filter-list">
          <FilterSell className="filter filter-sell"><i>filter sell</i></FilterSell>
          <FilterAll className="filter filter-all"><i>filter all</i></FilterAll>
          <FilterBuy className="filter filter-buy"><i>filter buy</i></FilterBuy>
        </FilterList>
      </OrderBookHeader>

      <OrderBookContent className="order-book-content">
        {!bids && <Loading />}

        <ListHeading>
          <HeaderRow>
            <HeaderCell width="33%" className="header-cell">Price</HeaderCell>
            <HeaderCell width="34%" className="header-cell text-right">Amount</HeaderCell>
            <HeaderCell width="33%" className="header-cell text-right">Volume</HeaderCell>
          </HeaderRow>
        </ListHeading>

        {asks && (
          <ListContainer className="list-container list-sell">
            <List className="bp3-list-unstyled list">
              {asks.map((order, index) => (
                <SellOrder key={index} index={index} order={order} />
              ))}
            </List>
          </ListContainer>
        )}

        <LatestTick className="latest-tick">
          <LatestPrice className="latest-price" width="67%">
            <CryptoPrice className="crypto">282.6300000</CryptoPrice>
            <CashPrice className="cash">$0.68</CashPrice>
          </LatestPrice>
          <PercentChange className="percent-change up text-right" width="33%">+19.33%</PercentChange>
        </LatestTick>

        {bids && (
          <ListContainer className="list-container list-buy">
            <List className="bp3-list-unstyled list">
              {bids.map((order, index) => (
                <BuyOrder key={index} index={index} order={order} />
              ))}
            </List>
          </ListContainer>
        )}
      </OrderBookContent>
    </Wrapper>
  )
}

export type SingleOrderProps = {
  order: Object,
  index: number
};

const BuyOrder = (props: SingleOrderProps) => {
  const { order } = props
  return (
    <Row>
      <BuyRowBackground amount={order.relativeTotal} />
      <Cell className="up" width="33%">{order.price}</Cell>
      <Cell className="text-right" width="34%">{order.amount}</Cell>
      <Cell className="text-right" width="33%">{order.total}</Cell> 
    </Row>
  )
}

const SellOrder = (props: SingleOrderProps) => {
  const { order, index } = props
  return (
    <Row key={index}>
      <SellRowBackGround amount={order.relativeTotal} />
      <Cell className="down" width="33%">{order.price}</Cell>
      <Cell className="text-right" width="34%">{order.amount}</Cell>
      <Cell className="text-right" width="33%">{order.total}</Cell>
    </Row>
  )
}

const Wrapper = styled.div.attrs({
  className: 'order-book',
})`
  height: 100%;
`
const OrderBookHeader = styled.div``
const Title = styled.div``
const FilterList = styled.div``
const FilterSell = styled.div``
const FilterAll = styled.div``
const FilterBuy = styled.div``

const OrderBookContent = styled.div.attrs({})`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`
const ListContainer = styled.div`
  width: 100%;
`
const List = styled.ul`
  max-height: 224px;
  overflow-y: auto;
`

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
  padding: 5px 0 !important;

  &:hover {
    background-color: ${Colors.BLUE_MUTED};
    position: relative;
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 0 1px rgb(49, 64, 76),
      -1px 10px 4px rgba(16, 22, 26, 0.1), 1px 18px 24px rgba(16, 22, 26, 0.2);
    box-shadow: inset 0 0 0 1px rgb(49, 64, 76),
      -1px 5px 4px rgba(16, 22, 26, 0.1), 1px 7px 24px rgba(16, 22, 26, 0.2);
    z-index: 1;
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
  width: ${props => props.width? props.width : "35px"}
`

const ListHeading = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0px;
`

const HeaderRow = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 0px !important;
  padding-bottom: 10px;
  width: 100%;
`

const HeaderCell = styled.span`
  width: ${props => props.width? props.width : "35px"}
`

const LatestTick = styled.div``
const LatestPrice = styled.div`
  width: ${props => props.width? props.width : "70px"}
`
const CryptoPrice = styled.span``
const CashPrice = styled.span``
const PercentChange = styled.div`
  width: ${props => props.width? props.width : "35px"}
`

export default OrderBookRenderer
