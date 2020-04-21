//@flow
import React from 'react'
import styled from 'styled-components'
import {
  Tab,
  Tabs,
  Checkbox,
} from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import { Colors, Loading, CenteredMessage, TmColors, Theme } from '../../Common'
import { formatDate, calcPercent } from '../../../utils/helpers'
import type { Order } from '../../../types/orders'
import tickUrl from '../../../assets/images/tick.svg'
import { interestPrecision, lendingAmountPrecision } from '../../../config/tokens'
// import FundsTable from '../../FundsTable'

type Props = {
  loading: boolean,
  selectedTabId: string,
  onChange: string => void,
  toggleCollapse: void => void,
  cancelOrder: string => void,
  orders: {
    finished: Array<Order>,
    processing: Array<Order>,
  }
}

const OrdersTableRendererMobile = (props: Props) => {
  const {
    loading,
    selectedTabId,
    onChange,
    cancelOrder,
    orders,
    isHideOtherPairs,
    handleChangeHideOtherPairs,
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
              pricePrecision={pricePrecision}
              amountPrecision={amountPrecision}
            />
          }
        />
        {/* <Tab
          id="funds"
          title={<FormattedMessage id="exchangePage.funds" />}
          panel={
            <FundsTable />
          }
        /> */}
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
                pricePrecision={pricePrecision}
                amountPrecision={amountPrecision} />)
    case 'order-history':
      return (<OrderHistoryTable 
                orders={orders} 
                cancelOrder={cancelOrder}
                isHideOtherPairs={isHideOtherPairs} 
                handleChangeHideOtherPairs={handleChangeHideOtherPairs}
                pricePrecision={pricePrecision}
                amountPrecision={amountPrecision} />)
    default:
      return (<div></div>)
  }
}

const OpenOrderTable = ({orders, cancelOrder, isHideOtherPairs, handleChangeHideOtherPairs, amountPrecision, pricePrecision}) => {
  
  return (
    <ListContainer>
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label="Hide other pairs" />

      {(orders.length === 0) && (<NoOrders><CenteredMessage message="No orders" /></NoOrders>)}

      {(orders.length > 0) &&
        (<ListBodyWrapper>
          {orders.map((order, index) => (
            <Row key={index}>
              <CenterCell width={"25%"} muted>  
                <FieldValue style={{marginBottom: "7px"}} color={order.side === 'BORROW' ? TmColors.GREEN : TmColors.RED}>{order.side} {order.type}</FieldValue>
                <div style={{width: "40px"}}>
                  <CircularProgressbar 
                    value={calcPercent(order.filled, order.amount, amountPrecision).toFixed(0)}
                    text={`${calcPercent(order.filled, order.amount, amountPrecision).toFixed(0)}%`}
                    styles={buildStyles({
                      textColor: order.side === 'BORROW' ? TmColors.GREEN : TmColors.RED,
                    })} />
                </div>
              </CenterCell>
              <Cell width={"75%"} muted>
                <ChildRow style={{marginBottom: "10px"}}>
                  <FieldValue>{`${order.termSymbol}/${order.lendingTokenSymbol}`}</FieldValue>
                  <FieldValue color={TmColors.LIGHT_GRAY}>{formatDate(order.time, 'LL-dd HH:mm:ss')}</FieldValue>
                </ChildRow> 
                <ChildRow>
                  <Cell width="70%">
                    <div>
                      <FieldTitle><FormattedMessage id="exchangePage.filledAmount" /></FieldTitle>
                      <FieldValue>{BigNumber(order.filled).toFormat(lendingAmountPrecision)}</FieldValue>
                    </div>
                    <div>
                      <FieldTitle><FormattedMessage id="exchangePage.amount" /></FieldTitle>
                      <FieldValue>{BigNumber(order.amount).toFormat(lendingAmountPrecision)}</FieldValue>
                    </div>
                    <div>
                      <FieldTitle><FormattedMessage id="exchangeLendingPage.orders.interest" /></FieldTitle>
                      <FieldValue>{BigNumber(order.interest).toFormat(interestPrecision)}&#37;</FieldValue>
                    </div>
                  </Cell>
                  <Cell width="30%">
                  {order.cancelAble && (<CancelButton onClick={() => cancelOrder(order.hash)}>Cancel</CancelButton>)}
                  </Cell>
                </ChildRow> 
              </Cell>
            </Row>
          ))}
        </ListBodyWrapper>)
      }
    </ListContainer>
  )
}

const OrderHistoryTable = ({orders, cancelOrder, isHideOtherPairs, handleChangeHideOtherPairs, pricePrecision, amountPrecision}) => {
  return (
    <ListContainer className="list-container">
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label="Hide other pairs" />

      <ListHeader className="header">
        <HeaderCell width={"35%"}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={"35%"}><FormattedMessage id="exchangeLendingPage.orders.interest" /></HeaderCell>
        <HeaderCell textAlign="right" width={"30%"}><FormattedMessage id="exchangePage.filledAmount" />/<FormattedMessage id="exchangePage.amount" /></HeaderCell>
      </ListHeader>

      {(orders.length === 0) && (<NoOrders><CenteredMessage message="No orders" /></NoOrders>)}

      {(orders.length > 0) && 
        (<ListBodyWrapper className="list">
          {orders.map((order, index) => (
            <Row key={index} cancel={order.status === "CANCELLED" || order.status === "REJECTED"}>
              <Cell width={"35%"} muted>
                <Pair><SideIcon side={order.side} /> <span>{`${order.termSymbol}/${order.lendingTokenSymbol}`}</span></Pair>
                <Date>{formatDate(order.time, 'LL-dd HH:mm:ss')}</Date>
              </Cell>
              <Cell width={"35%"} title={order.interest} muted>
                {BigNumber(order.interest).toFormat(interestPrecision)}
              </Cell>
              <AmountCell textAlign="right" width={"30%"} muted>
                <span>{BigNumber(order.filled).toFormat(lendingAmountPrecision)}</span>
                <span>{BigNumber(order.amount).toFormat(lendingAmountPrecision)}</span>
              </AmountCell>
            </Row>
          ))}
        </ListBodyWrapper>)
      }
    </ListContainer>
  )
}

const TabsContainer = styled(Tabs)`
  position: relative;  
  height: 100%;

  .bp3-tab-list {
    margin-bottom: 10px;
  }

  .bp3-tab-panel {
    height: calc(100% - 47px); // 30px is height, 15px is margin bottom of .bp3-tab-list 
  }

  .bp3-tab-list > *:not(:last-child) {
    margin-right: 0;
    padding-right: 25px !important;
  }

  .bp3-tab {
    font-size: ${Theme.FONT_SIZE_SM};
    user-select: none;
  }
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
  padding: 0 5px 10px 5px;
`

const Row = styled.li.attrs({
  className: 'order-row',
})`
  width: 100%;
  display: flex;
  flex-direction: row;
  line-height: 18px;
  padding: 8px 5px;

  &:nth-child(2n + 1) {
    background: ${props => props.theme.subBg};
  }

  background: ${props => props.cancel ? `${props.theme.secondSubBg} !important` : 'inherit'};
`

const ChildRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
      : Colors.WHITE};

  min-width: 35px;
  width: ${props => (props.width ? props.width : '10%')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: ${props => (props.textAlign ? props.textAlign : 'left')};

  span:last-child {
    color: ${TmColors.GRAY};
  }
`

const CenterCell = styled(Cell)`
  display: flex;
  padding-right: 10px;
  flex-direction: column;
  align-items: center;
`

const AmountCell = styled(Cell)`
  display: flex;
  flex-direction: column;
`

const Pair = styled.div`
  display: flex;
  align-items: center;
`

const Date = styled.div`
  font-size: ${Theme.FONT_SIZE_XS};
  color: ${TmColors.LIGHT_GRAY};
`

const SideIcon = styled.span`
  display: inline-block;
  height: 12px;
  width: 12px;
  margin-right: 5px;
  border-radius: 1px;
  position: relative;
  background-color: ${props => props.side.toUpperCase() === 'BORROW' ? TmColors.GREEN : TmColors.RED};

  &::before {
    content: '${props => props.side.toUpperCase() === 'BORROW' ? 'B' : 'L'}';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    font-size: 8px;
    font-weight: 700;
    color: ${TmColors.WHITE};
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const HeaderCell = styled.span.attrs({ className: props => props.className })`
  width: ${props => (props.width ? props.width : '10%')};
  text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
  font-size: ${Theme.FONT_SIZE_SM};
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
    background-color: ${TmColors.ORANGE} !important;
  }

  input:checked ~ .bp3-control-indicator::before {
    background: url(${tickUrl}) no-repeat center center !important;
  }

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      display: none;
    }
  }
`

const NoOrders = styled.div`
  height: calc(100% - 25px);
`

const CancelButton = styled.div`
  cursor: pointer;
  border: 1px solid ${TmColors.ORANGE};
  border-radius: 2px;
  padding: 3px;
  text-align: center;
  max-width: 60px;
  color: ${TmColors.WHITE};

  &:hover {
    color: ${TmColors.ORANGE};
  }
`

const FieldTitle = styled.span`
  display: inline-block;
  width: 50px;
  color: ${props => props.color || TmColors.LIGHT_GRAY};
`

const FieldValue = styled.span`
  display: inline-block;
  font-size: 10px;
  color: ${props => props.color || TmColors.WHITE};
`

export default OrdersTableRendererMobile
