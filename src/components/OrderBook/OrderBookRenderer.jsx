// @flow
import React from 'react'
import styled, { keyframes } from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { PopoverPosition } from "@blueprintjs/core"
import { Select } from "@blueprintjs/select"
import BigNumber from 'bignumber.js'

import { Loading, Colors, TmColors, Centered, UtilityIcon, Text, Theme } from '../Common'
import { getChangePercentText } from '../../utils/helpers'

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

const widthColumns = ['32%', '32%', '36%']

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
      pricePrecisionsList,
      currentPricePrecision,
      amountPrecision,
      onChangePricePrecision,
      currentPairData,
      referenceCurrency,
      baseTokenSymbol,
      quoteTokenSymbol,
    } = this.props

    const isNoItems = (bids.length === 0 && asks.length === 0 && !currentPairData)

    return (
      <Wrapper className={ this.getOrderBookClass() }>
        <OrderBookHeader className="order-book-header">
          <Title><FormattedMessage id="exchangePage.orderbook" /></Title>

          {
            (pricePrecisionsList.length > 0) && (
              <PricePrecisionsDropdown 
                pricePrecisionsList={pricePrecisionsList}
                onChangePricePrecision={onChangePricePrecision}
                currentPricePrecision={currentPricePrecision}
                />)
          }

          <FilterList>
            <FilterSell onClick={() => this.changeFilter('sell')}><i>filter sell</i></FilterSell>
            <FilterAll onClick={() => this.changeFilter('all')}><i>filter all</i></FilterAll>
            <FilterBuy onClick={() => this.changeFilter('buy')}><i>filter buy</i></FilterBuy>
          </FilterList>
        </OrderBookHeader>

        {isNoItems && (<NoData />)}

        {!isNoItems && 
        (
          <OrderBookContent className="order-book-content all">
            {!bids && <Loading />}

            <ListHeading>
              <HeaderRow>
                <HeaderCell width={widthColumns[0]} className="header-cell">
                  <FormattedMessage 
                    id="exchangePage.orderbook.price"
                    values={{quoteTokenSymbol}} />
                </HeaderCell>
                <AmountHeader width={widthColumns[1]} className="header-cell text-right">
                  <FormattedMessage 
                    id="exchangePage.orderbook.amount"
                    values={{baseTokenSymbol}} />
                </AmountHeader>
                <HeaderCell width={widthColumns[2]} className="header-cell text-right">
                  <FormattedMessage 
                    id="exchangePage.orderbook.total"
                    values={{baseTokenSymbol}} />
                </HeaderCell>
              </HeaderRow>
            </ListHeading>

            <ListContent>
              {asks && (
                <Asks>
                  {asks.map((order, index) => (
                    <SellOrder 
                      key={index} 
                      order={order}
                      currentPricePrecision={currentPricePrecision}
                      amountPrecision={amountPrecision} 
                      onClick={onSelect} />
                  ))}
                </Asks>
              )}
              
              <LatestTick>
                {currentPairData && (
                  <LatestPrice width="75%">
                    <CryptoPrice>
                      <Ellipsis title={BigNumber(currentPairData.price).toFormat(currentPairData.pricePrecision)}>
                        {BigNumber(currentPairData.price).toFormat(currentPairData.pricePrecision)}
                      </Ellipsis>
                    </CryptoPrice>
                    {currentPairData.priceUsd && (<CashPrice>
                      <Ellipsis title={BigNumber(currentPairData.priceUsd).toFormat(currentPairData.pricePrecisionUsd)}>
                        {referenceCurrency.symbol}{BigNumber(currentPairData.priceUsd).toFormat(currentPairData.pricePrecisionUsd)}
                      </Ellipsis>
                    </CashPrice>)} 
                  </LatestPrice>
                )}  

                {currentPairData && (currentPairData.change !== null) && (
                  <PercentChange positive={Number(currentPairData.change) >= 0} width="25%">
                    <Ellipsis>{getChangePercentText(currentPairData.change)}</Ellipsis>
                  </PercentChange> 
                )}                          
              </LatestTick>
              
              {bids && (
                <Bids>
                  {bids.map((order, index) => (
                    <BuyOrder 
                      key={index} 
                      order={order} 
                      currentPricePrecision={currentPricePrecision}
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
  const { order, currentPricePrecision, amountPrecision, onClick } = props
  return (
    <Row update={order.update}>
      <BuyRowBackground amount={order.relativeTotal} />
      <Cell onClick={() => onClick({...order, type: "price", side: "BUY"})} className="up" width={widthColumns[0]}>{BigNumber(order.price).toFormat(currentPricePrecision)}</Cell>
      <AmountCell onClick={() => onClick({...order, type: "amount", side: "BUY"})} className="text-right" width={widthColumns[1]}>{BigNumber(order.amount).toFormat(amountPrecision)}</AmountCell>
      <Cell onClick={() => onClick({...order, type: "amount", side: "BUY"})} className="text-right" width={widthColumns[2]}>{BigNumber(order.total).toFormat(amountPrecision)}</Cell> 
    </Row>
  )
}

const SellOrder = (props: SingleOrderProps) => {
  const { order, currentPricePrecision, amountPrecision, onClick } = props
  return (
    <Row update={order.update}>
      <SellRowBackGround amount={order.relativeTotal} />
      <Cell onClick={() => onClick({...order, type: "price", side: "SELL"})} className="down" width={widthColumns[0]}>{BigNumber(order.price).toFormat(currentPricePrecision)}</Cell>
      <AmountCell onClick={() => onClick({...order, type: "amount", side: "SELL"})} className="text-right" width={widthColumns[1]}>{BigNumber(order.amount).toFormat(amountPrecision)}</AmountCell>
      <Cell onClick={() => onClick({...order, type: "amount", side: "SELL"})} className="text-right" width={widthColumns[2]}>{BigNumber(order.total).toFormat(amountPrecision)}</Cell>
    </Row>
  )
}

const PricePrecisionsDropdown = (props: Array<number>) => {
  const { currentPricePrecision, pricePrecisionsList, onChangePricePrecision } = props

  const items: Array<PricePrecision> = pricePrecisionsList.map((precision, index) => {
    return {
      title: `${precision} decimals`,
      value: precision,
      rank: index + 1,
    }
  })

  const selectedItem = items.find(item => item.value === currentPricePrecision)

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
  padding: 0 10px;
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

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      overflow: hidden;
    }
  }
`

const Asks = styled(List).attrs({
  className: "bp3-list-unstyled list list-sell",
  id: "list-sell",
})``

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
  padding: 0 10px !important;
  animation: ${props => props.update ? 
              (props.theme.mode === 'light' ? 
                fadeInLightMode 
                : fadeInDarkMode) 
              : ''} .3s ease;
  font-family: 'Ubuntu', sans-serif;
  font-size: 13px;
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
      height: 390px !important;
    }
  }
`

const HeaderRow = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 0px !important;
  padding: 0 10px 10px 10px;
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

const AmountHeader = styled(HeaderCell)`
`

const LatestTick = styled.div.attrs({
  className: 'latest-tick',
})`
  flex-grow: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 30px;
  padding: 0 10px;
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

const Ellipsis = styled.span`
  width: 100%;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default OrderBookRenderer