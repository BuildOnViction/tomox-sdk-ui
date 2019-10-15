// @flow
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Loading, Colors, TmColors } from '../Common'
import { getChangePercentText, truncateZeroDecimal } from '../../utils/helpers'
import { PopoverPosition } from "@blueprintjs/core"
import { Select } from "@blueprintjs/select"
import BigNumber from 'bignumber.js'

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
          <Title><FormattedMessage id="exchangePage.orderbook" /></Title>

          <PricePrecisionsDropdown 
            pricePrecisionsList={pricePrecisionsList}
            onChangePricePrecision={onChangePricePrecision}
            pricePrecision={pricePrecision}
             />

          <FilterList>
            <FilterSell onClick={() => this.changeFilter('sell')}><i>filter sell</i></FilterSell>
            <FilterAll onClick={() => this.changeFilter('all')}><i>filter all</i></FilterAll>
            <FilterBuy onClick={() => this.changeFilter('buy')}><i>filter buy</i></FilterBuy>
          </FilterList>
        </OrderBookHeader>

        {isNoItems && (<NoItems><FormattedMessage id="exchangePage.noOrderbook" /></NoItems>)}

        {!isNoItems && 
        (
          <OrderBookContent className="order-book-content all">
            {!bids && <Loading />}

            <ListHeading>
              <HeaderRow>
                <HeaderCell width="33%" className="header-cell"><FormattedMessage id="exchangePage.price" /></HeaderCell>
                <HeaderCell width="34%" className="header-cell text-right"><FormattedMessage id="exchangePage.amount" /></HeaderCell>
                <HeaderCell width="33%" className="header-cell text-right"><FormattedMessage id="exchangePage.volume" /></HeaderCell>
              </HeaderRow>
            </ListHeading>

            <ListContent>
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
              
              <LatestTick>
                {currentPairData && (
                  <LatestPrice width="75%">
                    <CryptoPrice>
                      <Ellipsis title={truncateZeroDecimal(BigNumber(currentPairData.price).toFormat(pricePrecision))}>
                        {truncateZeroDecimal(BigNumber(currentPairData.price).toFormat(pricePrecision))}
                      </Ellipsis>
                    </CryptoPrice>
                    <CashPrice>
                      <Ellipsis title={truncateZeroDecimal(BigNumber(currentPairData.priceUsd).toFormat(pricePrecision))}>
                        {referenceCurrency.symbol}{truncateZeroDecimal(BigNumber(currentPairData.priceUsd).toFormat(pricePrecision))}
                      </Ellipsis>
                    </CashPrice> 
                  </LatestPrice>
                )}  

                {currentPairData && (currentPairData.change !== null) && (
                  <PercentChange positive={Number(currentPairData.change) >= 0} width="25%">
                    <Ellipsis>{getChangePercentText(currentPairData.change)}</Ellipsis>
                  </PercentChange> 
                )}                          
              </LatestTick>
              
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
      <Cell className="up" width="33%">{BigNumber(order.price).toFormat(pricePrecision)}</Cell>
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
      <Cell className="down" width="33%">{BigNumber(order.price).toFormat(pricePrecision)}</Cell>
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
  color: ${TmColors.GRAY};
  cursor: pointer;
`

const PrecisionMenuItem = styled.li`
  padding: 3px 10px;
  color: ${TmColors.GRAY};
  cursor: pointer;
  background: ${({active}) => active ? TmColors.LIGHT_BLUE : 'initial'};

  &:hover {
    background: ${TmColors.LIGHT_BLUE};
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
const Title = styled.div.attrs({
  className: 'title xs-hidden',
})``
const FilterList = styled.div.attrs({
  className: "filter-list",
})``
const FilterSell = styled.div.attrs({
  className: "filter filter-sell",
})``
const FilterAll = styled.div.attrs({
  className: "filter filter-all",
})``
const FilterBuy = styled.div.attrs({
  className: "filter filter-buy",
})``

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
  margin-bottom: 10px;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      margin-bottom: 5px;
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
      height: 378px !important;
    }
  }
`

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

const LatestTick = styled.div.attrs({
  className: 'latest-tick',
})`
  flex-grow: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 30px;
  padding-left: 10px;
  background: ${props => props.theme.orderbookLatestPrice};
`
const LatestPrice = styled.div.attrs({
  className: 'latest-price',
})`
  width: ${props => props.width? props.width : "70px"};
`
const CryptoPrice = styled.span.attrs({
  className: 'crypto',
})`
  width: 60%;
`

const CashPrice = styled.span.attrs({
  className: 'cash',
})`
  width: 40%;
`

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

const Ellipsis = styled.span`
  width: 100%;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default OrderBookRenderer