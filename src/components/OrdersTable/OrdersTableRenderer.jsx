//@flow
import React from 'react'
import styled from 'styled-components'
import {
  Tab,
  Tag,
  Icon,
  Tabs,
  Popover,
  Position,
} from '@blueprintjs/core'
import { Colors, Loading, CenteredMessage } from '../Common'
import { formatDate, capitalizeFirstLetter } from '../../utils/helpers'
import type { Order } from '../../types/orders'

type Props = {
  loading: boolean,
  selectedTabId: string,
  onChange: string => void,
  isOpen: boolean,
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
};

const OrdersTableRenderer = (props: Props) => {
  const {
    loading,
    selectedTabId,
    onChange,
    cancelOrder,
    orders,
  } = props
  return (
    <Wrapper>
      <Tabs selectedTabId={selectedTabId} onChange={onChange}>
        <Tab
          id="open-orders"
          title="Open Orders"
          panel={
            <OrdersTablePanel
              loading={loading}
              orders={orders['OPEN']}
              cancelOrder={cancelOrder}
            />
          }
        />
        <Tab
          id="order-history"
          title="Order History"
          panel={
            <OrdersTablePanel
              loading={loading}
              orders={orders['ALL']}
              cancelOrder={cancelOrder}
            />
          }
        />
        <Tab
          id="trade-history"
          title="Trade History"
          panel={
            <OrdersTablePanel
              loading={loading}
              orders={orders['EXECUTED']}
              cancelOrder={cancelOrder}
            />
          }
        />
        <Tab
          id="funds"
          title="Funds"
        />
      </Tabs>
    </Wrapper>
  )
}

const OrdersTablePanel = (props: {
  loading: boolean,
  orders: Array<Order>,
  cancelOrder: string => void
}) => {
  const { loading, orders, cancelOrder } = props

  if (loading) return <Loading />
  if (orders.length === 0) return <CenteredMessage message="No orders" />

  return (
    <ListContainer className="list-container">
      <ListHeader className="header">
        <HeaderCell width="12%" className="date">Date</HeaderCell>
        <HeaderCell width="10%" className="pair">Pair</HeaderCell>
        <HeaderCell width="5%" className="type">Type</HeaderCell>
        <HeaderCell width="5%" className="side">Side</HeaderCell>
        <HeaderCell width="10%" className="price">Price</HeaderCell>
        <HeaderCell width="10%" className="amount">Amount</HeaderCell>          
        <HeaderCell width="10%" className="filled">Filled(%)</HeaderCell>
        <HeaderCell width="10%" className="total">Total</HeaderCell>
        <HeaderCell width="15%" className="trigger-conditions">Trigger Conditions</HeaderCell>
        <HeaderCell width="13%" className="cancel">
          <Popover
            content="todo: cancel list"
            position={Position.BOTTOM_LEFT}
            minimal>
            <div className="cancel-btn">
              <span>Cancel All</span>
              <i className="arrow-down">arrow down</i>
            </div>            
          </Popover>
        </HeaderCell>
      </ListHeader>

      <ListBodyWrapper className="list">
        {orders.map((order, index) => (
          <OrderRow
            key={index}
            order={order}
            index={index}
            cancelOrder={cancelOrder}
          />
        ))}
      </ListBodyWrapper>
    </ListContainer>
  )
}

const OrderRow = (props: {
  order: Order,
  index: number,
  cancelOrder: string => void
}) => {
  const { order, cancelOrder } = props
  return (
    <Row className="order-row">
      <Cell width="12%" className="date" muted>
        {formatDate(order.time, 'LL-dd H:k:mm')}
      </Cell>
      <Cell width="10%" className="pair" muted>
        {order.pair}
      </Cell>
      <Cell width="5%" className="type" muted>
        {capitalizeFirstLetter(order.type)}
      </Cell>
      <Cell width="5%" className={`side ${order.side.toLowerCase() === "buy" ? "up" : "down"}`} muted>
        {capitalizeFirstLetter(order.side)}
      </Cell>
      <Cell width="10%" className="price" muted>
        {order.price}
      </Cell>
      <Cell width="10%" className="amount" muted>
        {order.amount}
      </Cell>
      <Cell width="10%" className="filled" muted>
        -
      </Cell>
      <Cell width="10%" className="total" muted>
        -
      </Cell>
      <Cell width="15%" className="trigger-conditions" muted>
        -
      </Cell>
      <Cell width="13%" className="cancel" muted>
        {order.status === 'OPEN' && (
          <Icon 
            icon="cross" 
            intent="danger" 
            onClick={() => cancelOrder(order.hash)} />
        )}
      </Cell>
    </Row>
  )
}

const StatusTag = ({ status }) => {
  const statuses = {
    NEW: 'secondar',
    INVALIDATED: 'danger',
    CANCELLED: 'danger',
    OPEN: 'primary',
    FILLED: 'success',
    PARTIALLY_FILLED: 'success',
  }

  const intent = statuses[status]
  return (
    <Tag minimal large interactive intent={intent}>
      {status}
    </Tag>
  )
}

const OrdersTableHeader = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  grid-gap: 10px;
  align-items: center;
`;
const Wrapper = styled.div``

const ListContainer = styled.div`
  height: 100%;
`;
const ListHeaderWrapper = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0px;
  margin-bottom: 10px;
`;
const ListBodyWrapper = styled.ul`
  width: 100%;
  margin: 0;
  overflow-y: auto;
`;
const ListHeader = styled.li`
  width: 100%;
  display: flex;
  margin: 0px !important;
  padding: 10px;
  text-align: left;
`;

const Row = styled.li``

const Cell = styled.span.attrs({
  className: props => props.className
})`
  color: ${props =>
    props.side === 'BUY'
      ? Colors.BUY
      : props.side === 'SELL'
      ? Colors.SELL
      : props.muted
      ? Colors.TEXT_MUTED
      : Colors.WHITE}

  min-width: 35px;
  display: flex;
  align-items: center;
  width: ${props => (props.width ? props.width : '10%')};
`

const HeaderCell = styled.span.attrs({ className: props => props.className })`
  width: ${props => (props.width ? props.width : '10%')};
`;

export default OrdersTableRenderer;
