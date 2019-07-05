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

import { Colors, Loading, CenteredMessage, DarkMode, Theme } from '../Common'
import { formatDate, capitalizeFirstLetter } from '../../utils/helpers'
import type { Order } from '../../types/orders'
import { formatNumber } from 'accounting-js'
import { pricePrecision } from '../../config/tokens'
import tickUrl from '../../assets/images/tick.svg'
import FundsTable from '../FundsTable'

type Props = {
  loading: boolean,
  selectedTabId: string,
  onChange: string => void,
  toggleCollapse: void => void,
  cancelOrder: string => void,
  orders: {
    ALL: Array<Order>,
    OPEN: Array<Order>,
    PENDING: Array<Order>,
    EXECUTED: Array<Order>,
    CANCELLED: Array<Order>,
    FILLED: Array<Order>
  }
}

const widthColumns = ['12%', '10%', '10%', '8%', '10%', '10%', '15%', '10%', '15%', '5%']
const widthColumnsOrderHistory = ['12%', '10%', '10%', '12%', '10%', '10%', '15%', '10%', '15%']
const widthColumnsTradeHistory = ['17%', '20%', '10%', '22%', '15%', '20%']

const OrdersTableRenderer = (props: Props) => {
  const {
    loading,
    selectedTabId,
    onChange,
    cancelOrder,
    orders,
    trades,
    isHideOtherPairs,
    handleChangeHideOtherPairs,
  } = props

  return (
    <React.Fragment>
      <TabsContainer selectedTabId={selectedTabId} onChange={onChange}>
        <Tab
          id="open-orders"
          title={<FormattedMessage id="exchangePage.openOrders" />}
          panel={
            <OrdersTablePanel
              loading={loading}
              orders={orders['OPEN']}
              cancelOrder={cancelOrder}
              selectedTabId={selectedTabId}
              isHideOtherPairs={isHideOtherPairs}
              handleChangeHideOtherPairs={handleChangeHideOtherPairs}
            />
          }
        />
        <Tab
          id="order-history"
          title={<FormattedMessage id="exchangePage.orderHistory" />}
          panel={
            <OrdersTablePanel
              loading={loading}
              orders={orders['ALL']}
              cancelOrder={cancelOrder}
              selectedTabId={selectedTabId}
              isHideOtherPairs={isHideOtherPairs}
              handleChangeHideOtherPairs={handleChangeHideOtherPairs}
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
}) => {
  const { 
    loading, 
    orders, 
    cancelOrder, 
    selectedTabId, 
    isHideOtherPairs, 
    handleChangeHideOtherPairs, 
  } = props
  
  if (loading) return <Loading />

  switch(selectedTabId) {
    case 'open-orders':
      return (<OpenOrderTable 
                orders={orders} 
                cancelOrder={cancelOrder} 
                isHideOtherPairs={isHideOtherPairs} 
                handleChangeHideOtherPairs={handleChangeHideOtherPairs} />)
    case 'order-history':
      return (<OrderHistoryTable 
                orders={orders} 
                cancelOrder={cancelOrder}
                isHideOtherPairs={isHideOtherPairs} 
                handleChangeHideOtherPairs={handleChangeHideOtherPairs} />)
    case 'trade-history':
      return (<TradeHistoryTable 
                orders={orders} 
                cancelOrder={cancelOrder}
                isHideOtherPairs={isHideOtherPairs} 
                handleChangeHideOtherPairs={handleChangeHideOtherPairs} />)
    default:
      return (<div></div>)
  }
}

const OpenOrderTable = ({orders, cancelOrder, isHideOtherPairs, handleChangeHideOtherPairs}) => {
  return (
    <ListContainer>
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label="Hide other pairs" />

      <ListHeader>
        <HeaderCell width={widthColumns[0]}><FormattedMessage id="exchangePage.date" /></HeaderCell>
        <HeaderCell width={widthColumns[1]}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={widthColumns[2]}><FormattedMessage id="exchangePage.type" /></HeaderCell>
        <HeaderCell width={widthColumns[3]}><FormattedMessage id="exchangePage.side" /></HeaderCell>
        <HeaderCell width={widthColumns[4]}><FormattedMessage id="exchangePage.price" /></HeaderCell>
        <HeaderCell width={widthColumns[5]}><FormattedMessage id="exchangePage.amount" /></HeaderCell>
        <HeaderCell width={widthColumns[6]}><FormattedMessage id="exchangePage.total" /></HeaderCell>          
        <HeaderCell width={widthColumns[7]}><FormattedMessage id="exchangePage.filled" /></HeaderCell>
        <HeaderCell width={widthColumns[8]}><FormattedMessage id="exchangePage.status" /></HeaderCell>
        <HeaderCell width={widthColumns[9]}></HeaderCell>
      </ListHeader>

      {(orders.length === 0) && (<CenteredMessage message="No orders" />)}

      {(orders.length > 0) &&
        (<ListBodyWrapper className="list">
          {orders.map((order, index) => (
            <Row key={index}>
              <Cell width={widthColumns[0]} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
                {formatDate(order.time, 'LL-dd HH:mm:ss')}
              </Cell>
              <Cell width={widthColumns[1]} title={order.pair} muted>
                {order.pair}
              </Cell>
              <Cell width={widthColumns[2]} muted>
                {capitalizeFirstLetter(order.type)}
              </Cell>
              <Cell width={widthColumns[3]} className={`${order.side && order.side.toLowerCase() === "buy" ? "up" : "down"}`} muted>
                {order.side && capitalizeFirstLetter(order.side)}
              </Cell>
              <Cell width={widthColumns[4]} title={order.price} muted>
                {order.price}
              </Cell>
              <Cell width={widthColumns[5]} muted>
                {order.amount}
              </Cell>
              <Cell width={widthColumns[6]} muted>
                {formatNumber(order.price * order.amount, { precision: pricePrecision })}
              </Cell>
              <Cell width={widthColumns[7]} muted>
                {order.filled && formatNumber(order.filled*100/order.amount, {  precision: 2 })}%
              </Cell>
              <Cell width={widthColumns[8]} muted>
                {capitalizeFirstLetter(order.status)}
              </Cell>
              <Cell width={widthColumns[9]} muted>
                {order.status === 'OPEN' && (
                  <CancelIcon 
                    icon="cross" 
                    intent="danger" 
                    onClick={() => cancelOrder(order.hash)} />
                )}
              </Cell>
            </Row>
          ))}
        </ListBodyWrapper>)
      }
    </ListContainer>
  )
}

const OrderHistoryTable = ({orders, cancelOrder, isHideOtherPairs, handleChangeHideOtherPairs}) => {
  return (
    <ListContainer className="list-container">
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label="Hide other pairs" />

      <ListHeader className="header">
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

      {(orders.length === 0) && (<CenteredMessage message="No orders" />)}

      {(orders.length > 0) && 
        (<ListBodyWrapper className="list">
          {orders.map((order, index) => (
            <Row key={index}>
              <Cell width={widthColumnsOrderHistory[0]} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
                {formatDate(order.time, 'LL-dd HH:mm:ss')}
              </Cell>
              <Cell width={widthColumnsOrderHistory[1]} title={order.pair} muted>
                {order.pair}
              </Cell>
              <Cell width={widthColumnsOrderHistory[2]} muted>
                {capitalizeFirstLetter(order.type)}
              </Cell>
              <Cell width={widthColumnsOrderHistory[3]} className={`${order.side && order.side.toLowerCase() === "buy" ? "up" : "down"}`} muted>
                {order.side && capitalizeFirstLetter(order.side)}
              </Cell>
              <Cell width={widthColumnsOrderHistory[4]} title={order.price} muted>
                {order.price}
              </Cell>
              <Cell width={widthColumnsOrderHistory[5]} muted>
                {order.amount}
              </Cell>
              <Cell width={widthColumnsOrderHistory[6]} muted>
                {formatNumber(order.price * order.amount, { precision: pricePrecision })}
              </Cell>
              <Cell width={widthColumnsOrderHistory[7]} muted>
                {order.filled && formatNumber(order.filled*100/order.amount, {  precision: 2 })}%
              </Cell>
              <Cell width={widthColumnsOrderHistory[8]} muted>
                {capitalizeFirstLetter(order.status)}
              </Cell>
            </Row>
          ))}
        </ListBodyWrapper>)
      }
    </ListContainer>
  )
}

const TradeHistoryTable = ({orders, cancelOrder, isHideOtherPairs, handleChangeHideOtherPairs}) => {
  return (
    <ListContainer className="list-container">
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label="Hide other pairs" />

      <ListHeader className="header">
        <HeaderCell width={widthColumnsTradeHistory[0]}><FormattedMessage id="exchangePage.date" /></HeaderCell>
        <HeaderCell width={widthColumnsTradeHistory[1]}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={widthColumnsTradeHistory[2]}><FormattedMessage id="exchangePage.type" /></HeaderCell>
        <HeaderCell width={widthColumnsTradeHistory[3]}><FormattedMessage id="exchangePage.price" /></HeaderCell>
        <HeaderCell width={widthColumnsTradeHistory[4]}><FormattedMessage id="exchangePage.filled" /></HeaderCell>
        <HeaderCell width={widthColumnsTradeHistory[5]}><FormattedMessage id="exchangePage.total" /></HeaderCell>          
      </ListHeader>

      {(orders.length === 0) && (<CenteredMessage message="No orders" />)}

      {(orders.length > 0) &&
        (<ListBodyWrapper className="list">
          {orders.map((order, index) => (
            <Row key={index}>
              <Cell width={widthColumnsTradeHistory[0]} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
                {formatDate(order.time, 'LL-dd HH:mm:ss')}
              </Cell>
              <Cell width={widthColumnsTradeHistory[1]} title={order.pair} muted>
                {order.pair}
              </Cell>
              <Cell width={widthColumnsTradeHistory[2]} muted>
                {order.side ? capitalizeFirstLetter(order.side) : '-'}
              </Cell>
              <Cell width={widthColumnsTradeHistory[3]} title={order.price} muted>
                {order.price}
              </Cell>
              <Cell width={widthColumnsTradeHistory[4]} muted>
                {order.amount}
              </Cell>
              <Cell width={widthColumnsTradeHistory[5]} muted>
                {formatNumber(order.price * order.amount, { precision: pricePrecision })}
              </Cell>
            </Row>
          ))}
        </ListBodyWrapper>)
      }
    </ListContainer>
  )
}

const TabsContainer = styled(Tabs)`
  position: relative;
`

const ListContainer = styled.div.attrs({
  className: 'list-container',
})`
  height: 100%;
`
const ListBodyWrapper = styled.ul.attrs({
  className: 'list',
})`
  height: calc(100% - 25px);
  width: 100%;
  margin: 0;
  overflow-y: auto;
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

  min-width: 35px;
  width: ${props => (props.width ? props.width : '10%')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const HeaderCell = styled.span.attrs({ className: props => props.className })`
  width: ${props => (props.width ? props.width : '10%')};
`

const CancelIcon = styled(Icon)`
  cursor: pointer;
`

const CheckboxHidePairs = styled(Checkbox)`
  font-size: ${Theme.FONT_SIZE_SM};
  text-align: center;
  margin-bottom: 0 !important;
  position: absolute;
  top: 2px;
  right: 10px;
  user-select: none;

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

export default OrdersTableRenderer
