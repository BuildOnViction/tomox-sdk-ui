// @flow
import React from 'react'
import styled from 'styled-components'
import { Loading, Colors, DarkMode } from '../Common'
import { formatNumber } from 'accounting-js'
import { getChangePercentText } from '../../utils/helpers'
import { PopoverPosition } from "@blueprintjs/core"
import { Select } from "@blueprintjs/select"

type BidOrAsk = {
  price: number,
  amount: number,
  total: number
};

type Props = {
  bids: Array<BidOrAsk>,
  asks: Array<BidOrAsk>
};

type PricePrecision = {
  title: string,
  value: number,
  rank: number,
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
      pricePrecisionsList,
      pricePrecision,
      onChangePricePrecision,
      currentPairData,
      referenceCurrency,
    } = this.props

    const isNoItems = (bids.length === 0 && asks.length === 0 && !currentPairData)

    return (
      <Wrapper className={ this.getOrderBookClass() }>
        <OrderBookHeader className="order-book-header">
          <Title className="title">Orderbook</Title>

          <PricePrecisionsDropdown 
            pricePrecisionsList={pricePrecisionsList}
            onChangePricePrecision={onChangePricePrecision}
            pricePrecision={pricePrecision}
             />

          <FilterList className="filter-list">
            <FilterSell className="filter filter-sell" onClick={() => this.changeFilter('sell')}><i>filter sell</i></FilterSell>
            <FilterAll className="filter filter-all" onClick={() => this.changeFilter('all')}><i>filter all</i></FilterAll>
            <FilterBuy className="filter filter-buy" onClick={() => this.changeFilter('buy')}><i>filter buy</i></FilterBuy>
          </FilterList>
        </OrderBookHeader>

        {isNoItems && (<NoItems>No Orderbook for this token pair</NoItems>)}

        {!isNoItems && 
        (
          <OrderBookContent className="order-book-content all">
            {!bids && <Loading />}

            <ListHeading className="list-header">
              <HeaderRow>
                <HeaderCell width="33%" className="header-cell">Price</HeaderCell>
                <HeaderCell width="34%" className="header-cell text-right">Amount</HeaderCell>
                <HeaderCell width="33%" className="header-cell text-right">Volume</HeaderCell>
              </HeaderRow>
            </ListHeading>

            <ListContent className="list-container">
              {asks && (
                <List className="bp3-list-unstyled list list-sell" id="list-sell">
                  {asks.map((order, index) => (
                    <SellOrder 
                      key={index} 
                      order={order}
                      pricePrecision={pricePrecision} 
                      onClick={() => onSelect(order)} />
                  ))}
                </List>
              )}

              {currentPairData && (
                <LatestTick className="latest-tick">
                  <LatestPrice className="latest-price" width="67%">
                    <CryptoPrice className="crypto">{formatNumber(currentPairData.last_trade_price, {precision: pricePrecision})}</CryptoPrice>
                    <CashPrice className="cash">{referenceCurrency.symbol}{currentPairData.usd ? formatNumber(currentPairData.usd, {precision: 2}) : '_.__'}</CashPrice> 
                  </LatestPrice>
                  
                  <PercentChange positive={(currentPairData.ticks[0].change) >= 0} width="33%">
                    {getChangePercentText(currentPairData.ticks[0].change)}
                  </PercentChange>             
                </LatestTick>
              )}

              {bids && (
                <List className="bp3-list-unstyled list list-buy" id="list-buy">
                  {bids.map((order, index) => (
                    <BuyOrder 
                      key={index} 
                      order={order} 
                      pricePrecision={pricePrecision}
                      onClick={() => onSelect(order)}/>
                  ))}
                </List>
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
  const { order, pricePrecision, onClick } = props
  return (
    <Row onClick={onClick}>
      <BuyRowBackground amount={order.relativeTotal} />
      <Cell className="up" width="33%">{formatNumber(order.price, { precision: pricePrecision })}</Cell>
      <Cell className="text-right" width="34%">{order.amount}</Cell>
      <Cell className="text-right" width="33%">{order.total}</Cell> 
    </Row>
  )
}

const SellOrder = (props: SingleOrderProps) => {
  const { order, pricePrecision, onClick } = props
  return (
    <Row onClick={onClick}>
      <SellRowBackGround amount={order.relativeTotal} />
      <Cell className="down" width="33%">{formatNumber(order.price, { precision: pricePrecision })}</Cell>
      <Cell className="text-right" width="34%">{order.amount}</Cell>
      <Cell className="text-right" width="33%">{order.total}</Cell>
    </Row>
  )
}

const PricePrecisionsDropdown = (props: Array<number>) => {
  const { pricePrecision, pricePrecisionsList, onChangePricePrecision } = props

  const items: Array<PricePrecision> = pricePrecisionsList.map((precision, index) => {
    return {
      title: `${precision} decimals`,
      value: precision,
      rank: index + 1,
    }
  })

  const selectedItem = items.find(item => item.value === pricePrecision)

  return (
    <Select
      items={items}
      activeItem={selectedItem}
      itemRenderer={renderPricePrecisionItem}
      onItemSelect={onChangePricePrecision}
      filterable={false}
      popoverProps={{ minimal: true, popoverClassName: 'precision-menu', position: PopoverPosition.BOTTOM_RIGHT }}
    >
      <PrecisionButton>
        <span>{selectedItem.title}</span> 
        <span className="arrow-down"></span>
      </PrecisionButton>
    </Select>
  )
}

const renderPricePrecisionItem = (item, { handleClick, modifiers }) => {
  return(
    <PrecisionMenuItem key={item.rank} active={modifiers.active} onClick={handleClick}>{item.title}</PrecisionMenuItem>
  )
}

const PrecisionButton = styled.div.attrs({
  className: "decimals-dropdown",
})`
  color: ${DarkMode.GRAY};
  cursor: pointer;
`

const PrecisionMenuItem = styled.li`
  padding: 3px 10px;
  color: ${DarkMode.GRAY};
  cursor: pointer;
  background: ${({active}) => active ? DarkMode.LIGHT_BLUE : 'initial'};

  &:hover {
    background: ${DarkMode.LIGHT_BLUE};
  }
`

const Wrapper = styled.div`
  height: 100%;
`
const OrderBookHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 16px;
  margin-bottom: 4px;
  padding-left: 10px;
`
const Title = styled.div``
const FilterList = styled.div``
const FilterSell = styled.div``
const FilterAll = styled.div``
const FilterBuy = styled.div``

const OrderBookContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`

const List = styled.ul`
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
  padding: 3.5px 0 3.5px 10px !important;

  &:hover {
    background-color: ${DarkMode.LIGHT_BLUE};
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

const ListContent = styled.div``

const HeaderRow = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 0px !important;
  padding-bottom: 10px;
  padding-left: 10px;
  width: 100%;
`

const HeaderCell = styled.span`
  width: ${props => props.width? props.width : "35px"}
`

const LatestTick = styled.div`
  flex-grow: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 30px;
  padding-left: 10px;
  background: ${DarkMode.BLACK};
`
const LatestPrice = styled.div`
  width: ${props => props.width? props.width : "70px"}
`
const CryptoPrice = styled.span``
const CashPrice = styled.span``
const PercentChange = styled.div.attrs({
  className: ({positive}) => positive ? "percent-change up text-right" : "percent-change down text-right",
})`
  width: ${props => props.width? props.width : "35px"}
`

const NoItems = styled.div`
  height: calc(100% - 50px);
  display: flex;
  padding-left: 10px;
  justify-content: center;
  align-items: center;
`

export default OrderBookRenderer