//@flow
import React from 'react'
import styled from 'styled-components'
import {
  Tab,
  Icon,
  Tabs,
  Checkbox,
} from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import { List, AutoSizer } from 'react-virtualized'
import { Link as InternalLink } from 'react-router-dom'

import { TOMOSCAN_URL } from '../../config/environment'
import { Colors, Loading, TmColors, Theme, Link, Centered, Text, UtilityIcon } from '../Common'
import { formatDate } from '../../utils/helpers'
import type { Order } from '../../types/orders'
import tickUrl from '../../assets/images/tick.svg'
import FundsTable from '../FundsTable'

type Props = {
  loading: boolean,
  selectedTabId: string,
  onChange: string => void,
  toggleCollapse: void => void,
  cancelOrder: string => void,
  orders: {
    finished: Array<Order>,
    processing: Array<Order>,
  }, 
  authenticated: Boolean,
}

const STATUS = {
  'ADDED': <FormattedMessage id='exchangePage.added' />,
  'OPEN': <FormattedMessage id='exchangePage.open' />,
  'PARTIAL_FILLED': <FormattedMessage id='exchangePage.partialFilled' />,
  'CANCELLED': <FormattedMessage id='exchangePage.cancelled' />,  
  'FILLED': <FormattedMessage id='exchangePage.filledStatus' />,
  'REJECTED': <FormattedMessage id='exchangePage.rejected' />,
}

const ORDERTYPES = {
  'LO': <FormattedMessage id='exchangePage.limit' />,
  'MO': <FormattedMessage id='exchangePage.market' />,
}

const ORDERSIDES = {
  'BUY': <FormattedMessage id='exchangePage.buy' />,
  'SELL': <FormattedMessage id='exchangePage.sell' />,
}

const rowHeight = 45
const overscanRowCount = 5
const widthColumns = ['15%', '15%', '8%', '8%', '13%', '13%', '13%', '10%', '5%']
const widthColumnsOrderHistory = ['12%', '16%', '8%', '8%', '13%', '12%', '13%', '10%', '8%']
const widthColumnsTradeHistory = ['15%', '18%', '10%', '18%', '15%', '20%', '8%']

const OrdersTableRenderer = (props: Props) => {
  const hasScrollBar = (orders) => {
    const tableBodyElm = document.querySelector('.bp3-tab-panel[aria-hidden="false"] .order-table-body')
    const tableBodyHeight = tableBodyElm ? tableBodyElm.scrollHeight : 0
    const contentHeight = orders.length * rowHeight
    return contentHeight > tableBodyHeight
  }

  const {
    loading,
    selectedTabId,
    onChange,
    cancelOrder,
    orders,
    trades,
    isHideOtherPairs,
    handleChangeHideOtherPairs,
    authenticated,
    pricePrecision,
    amountPrecision,
  } = props

  return (
    <React.Fragment>
      <TabsContainer selectedTabId={selectedTabId} onChange={onChange}>
        <Tab
          id="open-orders"
          title={<FormattedMessage 
            id="exchangePage.openOrders"
            values={{numberOfOrders: orders['processing'].length}} />}
          panel={
            <OrdersTablePanel
              loading={loading}
              orders={orders['processing']}
              cancelOrder={cancelOrder}
              selectedTabId={selectedTabId}
              isHideOtherPairs={isHideOtherPairs}
              handleChangeHideOtherPairs={handleChangeHideOtherPairs}
              hasScrollBar={hasScrollBar(orders['processing'])}
              authenticated={authenticated}
              pricePrecision={pricePrecision}
              amountPrecision={amountPrecision}
            />
          }
        />
        <Tab
          id="order-history"
          title={<FormattedMessage id="exchangePage.orderHistory" />}
          panel={
            <OrdersTablePanel
              loading={loading}
              orders={orders['finished']}
              cancelOrder={cancelOrder}
              selectedTabId={selectedTabId}
              isHideOtherPairs={isHideOtherPairs}
              handleChangeHideOtherPairs={handleChangeHideOtherPairs}
              hasScrollBar={hasScrollBar(orders['finished'])}
              authenticated={authenticated}
              pricePrecision={pricePrecision}
              amountPrecision={amountPrecision}
            />
          }
        />
        <Tab
          id="trade-history"
          title={<FormattedMessage id="exchangePage.tradeHistory" />}
          panel={
            <OrdersTablePanel
              loading={loading}
              orders={trades}
              cancelOrder={cancelOrder}
              selectedTabId={selectedTabId}
              isHideOtherPairs={isHideOtherPairs}
              handleChangeHideOtherPairs={handleChangeHideOtherPairs}
              hasScrollBar={hasScrollBar(trades)}
              authenticated={authenticated}
              pricePrecision={pricePrecision}
              amountPrecision={amountPrecision}
            />
          }
        />
        <Tab
          id="funds"
          title={<FormattedMessage id="exchangePage.funds" />}
          panel={
            <FundsTable />
          }
        />
      </TabsContainer>
    </React.Fragment>
  )
}

const OrdersTablePanel = (props: {
  loading: boolean,
  orders: Array<Order>,
  cancelOrder: string => void,
  selectedTabId: String,
  isHideOtherPairs: String,
  handleChangeHideOtherPairs: string => void,
  hasScrollBar: Boolean,
  authenticated: Boolean,
}) => {
  const { 
    loading, 
    orders, 
    cancelOrder, 
    selectedTabId, 
    isHideOtherPairs, 
    handleChangeHideOtherPairs, 
    hasScrollBar,
    authenticated,
    pricePrecision,
    amountPrecision,
  } = props
  
  if (loading) return <Loading />

  switch(selectedTabId) {
    case 'open-orders':
      return (<OpenOrderTable 
                orders={orders} 
                cancelOrder={cancelOrder} 
                isHideOtherPairs={isHideOtherPairs} 
                handleChangeHideOtherPairs={handleChangeHideOtherPairs}
                hasScrollBar={hasScrollBar}
                authenticated={authenticated}
                pricePrecision={pricePrecision}
                amountPrecision={amountPrecision} />)
    case 'order-history':
      return (<OrderHistoryTable 
                orders={orders} 
                cancelOrder={cancelOrder}
                isHideOtherPairs={isHideOtherPairs} 
                handleChangeHideOtherPairs={handleChangeHideOtherPairs}
                hasScrollBar={hasScrollBar}
                authenticated={authenticated}
                pricePrecision={pricePrecision}
                amountPrecision={amountPrecision} />)
    case 'trade-history':
      return (<TradeHistoryTable 
                orders={orders} 
                cancelOrder={cancelOrder}
                isHideOtherPairs={isHideOtherPairs} 
                handleChangeHideOtherPairs={handleChangeHideOtherPairs}
                hasScrollBar={hasScrollBar}
                authenticated={authenticated}
                pricePrecision={pricePrecision}
                amountPrecision={amountPrecision} />)
    default:
      return (<div></div>)
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

const _noOrderRowsRenderer = () => {
  return (
    <Centered my={4}>
      <UtilityIcon name="not-found" width={32} height={32} />
      <Text sm={true} color={TmColors.GRAY}><FormattedMessage id="exchangePage.noOrders" />.</Text>
    </Centered>
  )
}

const OpenOrderTable = ({orders, cancelOrder, isHideOtherPairs, handleChangeHideOtherPairs, hasScrollBar, authenticated, pricePrecision, amountPrecision}) => {
  const _rowRenderer = ({index, key, style}: *) => {
    const order = orders[index]

    return (
      <Row key={index} style={style}>
        <Cell width={widthColumns[0]} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
          {formatDate(order.time, 'LL-dd HH:mm:ss')}
        </Cell>
        <Cell width={widthColumns[1]} title={order.pair} muted>
          <Link href={`${TOMOSCAN_URL}/orders/${order.hash}`} target="_blank">{order.pair}</Link>
        </Cell>
        <Cell width={widthColumns[2]} muted>
          {ORDERTYPES[order.type]}
        </Cell>
        <Cell width={widthColumns[3]} className={`${order.side && order.side.toLowerCase() === "buy" ? "up" : "down"}`} muted>
          {order.side && ORDERSIDES[order.side.toUpperCase()]}
        </Cell>
        <Cell width={widthColumns[4]} title={order.price} muted>
          {order.type === 'LO' ? BigNumber(order.price).toFormat() : 'Market'}
        </Cell>
        <Cell width={widthColumns[5]} muted>
          {BigNumber(order.amount).toFormat()}
        </Cell>
        <Cell width={widthColumns[6]} muted>
          {order.type === 'LO' ? BigNumber(order.total).toFormat() : 'Market'}
        </Cell>
        <Cell width={widthColumns[7]} muted>
          {order.filled && BigNumber(order.filledPercent).toFormat(2)}%
        </Cell>
        <Cell width={widthColumns[8]} muted>
          {order.cancelAble && (
            <CancelIcon 
              icon="cross" 
              intent="danger" 
              onClick={() => cancelOrder(order.hash)} />
          )}
        </Cell>
      </Row>
    )
  }

  return (
    <ListContainer>
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label={<FormattedMessage id="exchangeLendingPage.orders.hideOtherPairs" />} />

      <ListHeader style={{paddingRight: hasScrollBar ? '16px' : '10px'}}>
        <HeaderCell width={widthColumns[0]}><FormattedMessage id="exchangePage.date" /></HeaderCell>
        <HeaderCell width={widthColumns[1]}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={widthColumns[2]}><FormattedMessage id="exchangePage.type" /></HeaderCell>
        <HeaderCell width={widthColumns[3]}><FormattedMessage id="exchangePage.side" /></HeaderCell>
        <HeaderCell width={widthColumns[4]}><FormattedMessage id="exchangePage.price" /></HeaderCell>
        <HeaderCell width={widthColumns[5]}><FormattedMessage id="exchangePage.amount" /></HeaderCell>
        <HeaderCell width={widthColumns[6]}><FormattedMessage id="exchangePage.total" /></HeaderCell>          
        <HeaderCell width={widthColumns[7]}><FormattedMessage id="exchangePage.filled" /></HeaderCell>
        <HeaderCell width={widthColumns[8]}></HeaderCell>
      </ListHeader>

      <ListBodyWrapper className="list">
        {!authenticated && <LoginMessage />}
        {authenticated && (
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={orders.length}
                rowHeight={rowHeight}
                rowRenderer={_rowRenderer}
                noRowsRenderer={_noOrderRowsRenderer}
                overscanRowCount={overscanRowCount}
              />
            )}
          </AutoSizer>
        )}
      </ListBodyWrapper>
    </ListContainer>
  )
}

const OrderHistoryTable = ({orders, cancelOrder, isHideOtherPairs, handleChangeHideOtherPairs, hasScrollBar, authenticated, pricePrecision, amountPrecision}) => {
  const _rowRenderer = ({index, key, style}: *) => {
    const order = orders[index]

    return (
      <Row key={key} style={style}>
        <Cell width={widthColumnsOrderHistory[0]} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
          {formatDate(order.time, 'LL-dd HH:mm:ss')}
        </Cell>
        <Cell width={widthColumnsOrderHistory[1]} title={order.pair} muted>
          <Link href={`${TOMOSCAN_URL}/orders/${order.hash}`} target="_blank">{order.pair}</Link>
        </Cell>
        <Cell width={widthColumnsOrderHistory[2]} muted>
          {ORDERTYPES[order.type]}
        </Cell>
        <Cell width={widthColumnsOrderHistory[3]} className={`${order.side && order.side.toLowerCase() === "buy" ? "up" : "down"}`} muted>
          {order.side && ORDERSIDES[order.side.toUpperCase()]}
        </Cell>
        <Cell width={widthColumnsOrderHistory[4]} title={order.price} muted>
          {order.type === 'LO' ? BigNumber(order.price).toFormat() : 'Market'}
        </Cell>
        <Cell width={widthColumnsOrderHistory[5]} muted>
          {BigNumber(order.amount).toFormat()}
        </Cell>
        <Cell width={widthColumnsOrderHistory[6]} muted>
          {order.type === 'LO' ? BigNumber(order.total).toFormat() : 'Market'}
        </Cell>
        <Cell width={widthColumnsOrderHistory[7]} muted>
          {order.filled && BigNumber(order.filledPercent).toFormat(2)}%
        </Cell>
        <Cell width={widthColumnsOrderHistory[8]} muted>
          {STATUS[order.status]}
        </Cell>
      </Row>
    )
  }
  
  return (
    <ListContainer className="list-container">
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label={<FormattedMessage id="exchangeLendingPage.orders.hideOtherPairs" />} />

      <ListHeader style={{paddingRight: hasScrollBar ? '16px' : '10px'}}>
        <HeaderCell width={widthColumnsOrderHistory[0]}><FormattedMessage id="exchangePage.date" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[1]}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[2]}><FormattedMessage id="exchangePage.type" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[3]}><FormattedMessage id="exchangePage.side" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[4]}><FormattedMessage id="exchangePage.price" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[5]}><FormattedMessage id="exchangePage.amount" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[6]}><FormattedMessage id="exchangePage.total" /></HeaderCell>          
        <HeaderCell width={widthColumnsOrderHistory[7]}><FormattedMessage id="exchangePage.filled" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[8]}><FormattedMessage id="exchangePage.status" /></HeaderCell>
      </ListHeader>

      <ListBodyWrapper className="list">
        {!authenticated && <LoginMessage />}
        {authenticated && (
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={orders.length}
                rowHeight={rowHeight}
                rowRenderer={_rowRenderer}
                noRowsRenderer={_noOrderRowsRenderer}
                overscanRowCount={overscanRowCount}
              />
            )}
          </AutoSizer>
        )}
      </ListBodyWrapper>
    </ListContainer>
  )
}

const _noTradeRowsRenderer = () => {
  return (
    <Centered my={4}>
      <UtilityIcon name="not-found" width={32} height={32} />
      <Text sm={true} color={TmColors.GRAY}><FormattedMessage id="exchangePage.noTrades" />.</Text>
    </Centered>
  )
}

const TradeHistoryTable = ({orders, cancelOrder, isHideOtherPairs, handleChangeHideOtherPairs, hasScrollBar, authenticated, pricePrecision, amountPrecision}) => {
  const _rowRenderer = ({index, key, style}: *) => {
    const order = orders[index]
    
    return (
      <Row key={index} style={style}>
        <Cell width={widthColumnsTradeHistory[0]} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
          {formatDate(order.time, 'LL-dd HH:mm:ss')}
        </Cell>
        <Cell width={widthColumnsTradeHistory[1]} title={order.pair} muted>
          <Link href={`${TOMOSCAN_URL}/trades/${order.hash}`} target="_blank">{order.pair}</Link>
        </Cell>
        <Cell width={widthColumnsTradeHistory[2]} muted>
          {ORDERTYPES[order.type]}
        </Cell>
        <Cell width={widthColumnsTradeHistory[6]} className={`${order.side && order.side.toLowerCase() === "buy" ? "up" : "down"}`} muted>
          {order.side && ORDERSIDES[order.side.toUpperCase()]}
        </Cell>
        <Cell width={widthColumnsTradeHistory[3]} title={order.price} className={`${order.side && order.side.toLowerCase() === "buy" ? "up" : "down"}`} muted>
          {order.type === 'LO' ? BigNumber(order.price).toFormat() : 'Market'}
        </Cell>
        <Cell width={widthColumnsTradeHistory[4]} muted>
          {BigNumber(order.amount).toFormat()}
        </Cell>
        <Cell width={widthColumnsTradeHistory[5]} muted>
          {order.type === 'LO' ? BigNumber(order.total).toFormat() : 'Market'}
        </Cell>
      </Row>
    )
  }  

  return (
    <ListContainer>
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label={<FormattedMessage id="exchangeLendingPage.orders.hideOtherPairs" />} />

      <ListHeader style={{paddingRight: hasScrollBar ? '16px' : '10px'}}>
        <HeaderCell width={widthColumnsTradeHistory[0]}><FormattedMessage id="exchangePage.date" /></HeaderCell>
        <HeaderCell width={widthColumnsTradeHistory[1]}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={widthColumnsTradeHistory[2]}><FormattedMessage id="exchangePage.type" /></HeaderCell>
        <HeaderCell width={widthColumnsTradeHistory[6]}><FormattedMessage id="exchangePage.side" /></HeaderCell>
        <HeaderCell width={widthColumnsTradeHistory[3]}><FormattedMessage id="exchangePage.price" /></HeaderCell>
        <HeaderCell width={widthColumnsTradeHistory[4]}><FormattedMessage id="exchangePage.filledAmount" /></HeaderCell>
        <HeaderCell width={widthColumnsTradeHistory[5]}><FormattedMessage id="exchangePage.total" /></HeaderCell>          
      </ListHeader>

      <ListBodyWrapper>
        {!authenticated && <LoginMessage />}
        {authenticated && (
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={orders.length}
                rowHeight={rowHeight}
                rowRenderer={_rowRenderer}
                noRowsRenderer={_noTradeRowsRenderer}
                overscanRowCount={overscanRowCount}
              />
            )}
          </AutoSizer>
        )}
      </ListBodyWrapper>
    </ListContainer>
  )
}

const TabsContainer = styled(Tabs)`
  position: relative;

  .bp3-tab-list > *:not(:last-child) {
    margin-right: 0;
    padding-right: 50px;
  }

  @media (max-width: 1300px) {
    & .bp3-tab-list > *:not(:last-child) {
      padding-right: 12px;
    }
  }
`

const ListContainer = styled.div.attrs({
  className: 'list-container',
})`
  height: 100%;
`
const ListBodyWrapper = styled.ul.attrs({
  className: 'list order-table-body',
})`
  height: calc(100% - 25px);
  width: 100%;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
`
const ListHeader = styled.li.attrs({
  className: 'header',
})`
  width: 100%;
  display: flex;
  margin: 0px !important;
  text-align: left;
  box-shadow: 0 1px 0 0 ${props => props.theme.border};
  padding: 0 10px 10px 10px;
`

const Row = styled.li.attrs({
  className: 'order-row',
})`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 45px;
  line-height: 45px;
  padding: 0 10px;
  &:nth-child(2n + 1) {
    background: ${props => props.theme.subBg};
  }
`

const Cell = styled.span.attrs({
  className: props => props.className,
})`
  color: ${props =>
    props.side === 'BUY'
      ? Colors.BUY
      : props.side === 'SELL'
      ? Colors.SELL
      : props.muted
      ? props.theme.textTable
      : Colors.WHITE}

  min-width: 25px;
  width: ${props => (props.width ? props.width : '10%')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 5px;
`

const HeaderCell = styled.span.attrs({ className: props => props.className })`
  width: ${props => (props.width ? props.width : '10%')};
  padding-right: 5px;
`

const CancelIcon = styled(Icon)`
  cursor: pointer;
`

const CheckboxHidePairs = styled(Checkbox)`
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
    background-color: ${props => props.theme.checkboxBg} !important;
  }

  input:checked ~ .bp3-control-indicator {
    background-color: ${TmColors.ORANGE} !important;
  }

  input:checked ~ .bp3-control-indicator::before {
    background: url(${tickUrl}) no-repeat center center !important;
  }
`

const LoginLink = styled(InternalLink)`
  color: ${props => props.color || props.theme.linkText};

  &:hover {
      color: ${TmColors.DARK_ORANGE};
  }
`

export default OrdersTableRenderer
