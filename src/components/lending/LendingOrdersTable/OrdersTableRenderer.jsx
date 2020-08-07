//@flow
import React from 'react'
import styled from 'styled-components'
import {
  Tab,
  Icon,
  Tabs,
  Checkbox,
  Popover,
  Position,
  PopoverInteractionKind,
  Menu,
  MenuItem,
} from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import { List, AutoSizer } from 'react-virtualized'
import { Link as InternalLink } from 'react-router-dom'

import { TOMOSCAN_URL } from '../../../config/environment'
import { Colors, Loading, TmColors, Theme, Link, Centered, Text, UtilityIcon, LendingLabelSide } from '../../Common'
import { formatDate, formatAmount } from '../../../utils/helpers'
import tickUrl from '../../../assets/images/tick.svg'
import FundsTable from '../../FundsTable'

const STATUS = {
  'OPEN': <FormattedMessage id='exchangePage.open' />,
  'PARTIAL_FILLED': <FormattedMessage id='exchangePage.partialFilled' />,
  'CANCELLED': <FormattedMessage id='exchangePage.cancelled' />,  
  'FILLED': <FormattedMessage id='exchangePage.filledStatus' />,
  'REJECTED': <FormattedMessage id='exchangePage.rejected' />,
}

const TRADE_STATUS = {
  'CLOSED': <FormattedMessage id='exchangeLendingPage.orders.trade.closed' />,
  'LIQUIDATED': <FormattedMessage id='exchangeLendingPage.orders.trade.liquidated' />,
}

const ORDERTYPES = {
  'LO': <FormattedMessage id='exchangePage.limit' />,
  'MO': <FormattedMessage id='exchangePage.market' />,
}

const TOPUPTYPES = {
  '0': <FormattedMessage id='exchangeLendingPage.orders.topUpManual' />,
  '1': <FormattedMessage id='exchangeLendingPage.orders.topUpAuto' />,
}

const ORDERSIDES = {
  'BORROW': <FormattedMessage id='exchangeLendingPage.orderPlace.btnBorrow' />,
  'LEND': <FormattedMessage id='exchangeLendingPage.orderPlace.btnLend' />,
}

const rowHeight = 45
const overscanRowCount = 5
const columnsOpenOrder = {
  time: '15%', 
  pair: '15%', 
  type: '10%', 
  side: '10%', 
  interest: '12%', 
  amount: '12%', 
  filled: '12%', 
  cancel: '8%',
  actions: '6%',
}
const columnsOrderHistory = {
  time: '18%', 
  pair: '19%', 
  type: '8%', 
  interest: '12%', 
  amount: '14%', 
  filled: '12%', 
  status: '12%',
  actions: '7%',
}
const columnsTradeHistory = {
  openDate: '10%', 
  closeDate: '10%',
  pair: '17%', 
  type: '10%', 
  interest: '10%', 
  filled: '10%',
  liqPrice: '10%',
  collateral: '13%',
  status: '9%',
  actions: '5%',
}
const columnsOpenTrades = {
  openDate: '10%',
  closeDate: '10%',
  pair: '19%',
  type: '13%',
  interest: '10%',
  filled: '10%',
  liqPrice: '12%',
  collateral: '15%',
  actions: '5%',
}

const OrdersTableRenderer = ({ orders, trades, selectedTabId, onChange, ...rest }) => {
  const hasScrollBar = (orders) => {
    const tableBodyElm = document.querySelector('.bp3-tab-panel[aria-hidden="false"] .order-table-body')
    const tableBodyHeight = tableBodyElm ? tableBodyElm.scrollHeight : 0
    const contentHeight = orders.length * rowHeight
    return contentHeight > tableBodyHeight
  }

  return (
    <React.Fragment>
      <TabsContainer selectedTabId={selectedTabId} onChange={onChange}>
        <Tab
          id="open-orders"
          title={
            <FormattedMessage 
              id="exchangeLendingPage.orders.trade.open"
              values={{numberOfOrders: orders['processing'].length}} />
          }
          panel={
            <OrdersTablePanel
              orders={orders['processing']}
              selectedTabId={selectedTabId}
              hasScrollBar={hasScrollBar(orders['processing'])}
              {...rest}
            />
          }
        />
        <Tab
          id="order-history"
          title={<FormattedMessage id="exchangePage.orderHistory" />}
          panel={
            <OrdersTablePanel
              orders={orders['finished']}
              selectedTabId={selectedTabId}
              hasScrollBar={hasScrollBar(orders['finished'])}
              {...rest}
            />
          }
        />
        <Tab
          id="open-trades"
          title={
            <FormattedMessage 
              id="exchangeLendingPage.orders.trade.openContract"
              values={{numberOfTrades: trades['processing'].length}} />
          }
          panel={
            <OpenTradesTable
              orders={trades['processing']}
              selectedTabId={selectedTabId}
              hasScrollBar={hasScrollBar(trades)}
              {...rest}
            />
          }
        />
        <Tab
          id="trade-history"
          title={<FormattedMessage id="exchangeLendingPage.orders.trade.closedContract" />}
          panel={
            <OrdersTablePanel
              orders={trades['finished']}
              selectedTabId={selectedTabId}
              hasScrollBar={hasScrollBar(trades)}
              {...rest}
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

const OrdersTablePanel = ({loading, selectedTabId, ...rest}) => {
  if (loading) return <Loading />

  switch(selectedTabId) {
    case 'open-orders':
      return (<OpenOrderTable {...rest} />)
    case 'order-history':
      return (<OrderHistoryTable {...rest} />)
    case 'open-trades':
      return (<OpenTradesTable {...rest} />)
    case 'trade-history':
      return (<TradeHistoryTable {...rest} />)
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

const OpenOrderTable = ({
  orders, 
  cancelOrder, 
  isHideOtherPairs, 
  handleChangeHideOtherPairs, 
  hasScrollBar, 
  authenticated,
  cancelLendingOrder,
}) => {
  const _rowRenderer = ({index, key, style}: *) => {
    const order = orders[index]

    return (
      <Row key={index} style={style}>
        <Cell width={columnsOpenOrder["time"]} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
          {formatDate(order.time, 'LL-dd HH:mm:ss')}
        </Cell>
        <Cell width={columnsOpenOrder["pair"]} title={order.pair} muted>
          <Link href={`${TOMOSCAN_URL}/lending/orders/${order.hash}`} target="_blank">{`${order.termSymbol}/${order.lendingTokenSymbol}`}</Link>
        </Cell>
        <Cell width={columnsOpenOrder["type"]} muted>
          {ORDERTYPES[order.type]}
        </Cell>
        <Cell width={columnsOpenOrder["side"]} className={`${order.side && order.side.toLowerCase() === "borrow" ? "up" : "down"}`} muted>
          {order.side && ORDERSIDES[order.side.toUpperCase()]}
        </Cell>
        <Cell width={columnsOpenOrder["interest"]} muted>
          {BigNumber(order.interest).toFormat(2)}&#37;
        </Cell>
        <Cell width={columnsOpenOrder["amount"]} muted>
          {BigNumber(order.amount).toFormat()}
        </Cell>
        <Cell width={columnsOpenOrder["filled"]} muted>
          {order.filled && BigNumber(order.filledPercent).toFormat(2)}%
        </Cell>
        <Cell width={columnsOpenOrder['actions']} muted>
          {order.cancelAble && (
            <Link href={`${TOMOSCAN_URL}/lending/orders/${order.hash}`} target="_blank"><i className="fa fa-external-link fa-lg" aria-hidden="true"></i></Link>)
          }
        </Cell>
        <Cell width={columnsOpenOrder["cancel"]} muted>
          {order.cancelAble && (
            <CancelIcon 
              icon="cross" 
              intent="danger" 
              onClick={() => cancelLendingOrder(order.hash)} />
          )}
        </Cell>
      </Row>
    )
  }

  return (
    <ListContainer>
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label={<FormattedMessage id="exchangeLendingPage.orders.hideOtherPairs" />} />

      <ListHeader style={{paddingRight: hasScrollBar ? '16px' : '10px'}}>
        <HeaderCell width={columnsOpenOrder["time"]}><FormattedMessage id="exchangePage.date" /></HeaderCell>
        <HeaderCell width={columnsOpenOrder["pair"]}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={columnsOpenOrder["type"]}><FormattedMessage id="exchangePage.type" /></HeaderCell>
        <HeaderCell width={columnsOpenOrder["side"]}><FormattedMessage id="exchangePage.side" /></HeaderCell>
        <HeaderCell width={columnsOpenOrder["interest"]}><FormattedMessage id="exchangeLendingPage.orders.interest" /></HeaderCell>
        <HeaderCell width={columnsOpenOrder["amount"]}><FormattedMessage id="exchangePage.amount" /></HeaderCell>
        <HeaderCell width={columnsOpenOrder["filled"]}><FormattedMessage id="exchangePage.filled" /></HeaderCell>
        <HeaderCell width={columnsOpenOrder['actions']}></HeaderCell>
        <HeaderCell width={columnsOpenOrder["cancel"]}></HeaderCell>
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
        <Cell width={columnsOrderHistory["time"]} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
          {formatDate(order.time, 'LL-dd HH:mm:ss')}
        </Cell>
        <Cell width={columnsOrderHistory["pair"]} title={order.pair} muted>
          <LendingLabelSide side={order.side} />
          <Link href={`${TOMOSCAN_URL}/lending/orders/${order.hash}`} target="_blank">{`${order.termSymbol}/${order.lendingTokenSymbol}`}</Link>
        </Cell>
        <Cell width={columnsOrderHistory["type"]} muted>
          {ORDERTYPES[order.type]}
        </Cell>
        <Cell width={columnsOrderHistory["interest"]} className={`${order.side && order.side.toLowerCase() === "borrow" ? "up" : "down"}`} muted>
          {BigNumber(order.interest).toFormat(2)}&#37;
        </Cell>
        <Cell width={columnsOrderHistory["amount"]} muted>
          {BigNumber(order.amount).toFormat()}
        </Cell>
        <Cell width={columnsOrderHistory["filled"]} muted>
          {order.filled && BigNumber(order.filledPercent).toFormat(2)}%
        </Cell>
        <Cell width={columnsOrderHistory["status"]} muted>
          {STATUS[order.status]}
        </Cell>
        <Cell width={columnsOrderHistory['actions']} muted>
          <Link href={`${TOMOSCAN_URL}/lending/orders/${order.hash}`} target="_blank"><i className="fa fa-external-link fa-lg" aria-hidden="true"></i></Link>
        </Cell>
      </Row>
    )
  }
  
  return (
    <ListContainer className="list-container">
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label={<FormattedMessage id="exchangeLendingPage.orders.hideOtherPairs" />} />

      <ListHeader style={{paddingRight: hasScrollBar ? '16px' : '10px'}}>
        <HeaderCell width={columnsOrderHistory["time"]}><FormattedMessage id="exchangePage.date" /></HeaderCell>
        <HeaderCell width={columnsOrderHistory["pair"]}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={columnsOrderHistory["type"]}><FormattedMessage id="exchangePage.type" /></HeaderCell>
        <HeaderCell width={columnsOrderHistory["interest"]}><FormattedMessage id="exchangeLendingPage.orders.interest" /></HeaderCell>
        <HeaderCell width={columnsOrderHistory["amount"]}><FormattedMessage id="exchangePage.amount" /></HeaderCell>
        <HeaderCell width={columnsOrderHistory["filled"]}><FormattedMessage id="exchangePage.filled" /></HeaderCell>
        <HeaderCell width={columnsOrderHistory["status"]}><FormattedMessage id="exchangePage.status" /></HeaderCell>
        <HeaderCell width={columnsOrderHistory['actions']}></HeaderCell>
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
        <Cell width={columnsTradeHistory['openDate']} title={formatDate(order.createdAt, 'LL-dd HH:mm:ss')} muted>
          <Day>{formatDate(order.createdAt, 'LL-dd')}</Day>
          <Time>{formatDate(order.createdAt, 'HH:mm:ss')}</Time>
        </Cell>
        <Cell width={columnsTradeHistory['closeDate']} title={formatDate(order.updatedAt, 'LL-dd HH:mm:ss')} muted>
          <Day>{formatDate(order.updatedAt, 'LL-dd')}</Day>
          <Time>{formatDate(order.updatedAt, 'HH:mm:ss')}</Time>
        </Cell>
        <Cell width={columnsTradeHistory['pair']} title={`${order.termSymbol}/${order.lendingTokenSymbol}`} muted>
          <LendingLabelSide side={order.side} />
          <Link href={`${TOMOSCAN_URL}/lending/trades/${order.hash}`} target="_blank">{`${order.termSymbol}/${order.lendingTokenSymbol}`}</Link>
        </Cell>
        <Cell width={columnsTradeHistory['type']} muted>
          {ORDERTYPES[order.type]}-{TOPUPTYPES[order.autoTopUp]}
        </Cell>
        <Cell width={columnsTradeHistory['interest']} className={`${order.side && order.side.toLowerCase() === "borrow" ? "up" : "down"}`} muted>
          {BigNumber(order.interest).toFormat(2)}&#37;
        </Cell>
        <Cell width={columnsTradeHistory['filled']} muted>
          {BigNumber(order.amount).toFormat()}
        </Cell>
        <Cell width={columnsTradeHistory['liqPrice']} title={`${order.collateralTokenSymbol}/${order.lendingTokenSymbol}`} muted>
          {BigNumber(order.liquidationPrice).toFormat(order.liquidationPricePrecision)}
        </Cell>
        <Cell width={columnsTradeHistory['collateral']} muted>
          {formatAmount(order.collateralLockedAmount)} {order.collateralTokenSymbol}
        </Cell>
        <Cell width={columnsTradeHistory['status']} muted>
          {TRADE_STATUS[order.status]}
        </Cell>
        <Cell width={columnsTradeHistory['actions']} muted>
          <Link href={`${TOMOSCAN_URL}/lending/trades/${order.hash}`} target="_blank">
            <i className="fa fa-external-link fa-lg" aria-hidden="true"></i>
          </Link>
        </Cell>
      </Row>
    )
  }  

  return (
    <ListContainer>
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label={<FormattedMessage id="exchangeLendingPage.orders.hideOtherPairs" />} />

      <ListHeader style={{paddingRight: hasScrollBar ? '16px' : '10px'}}>
        <HeaderCell width={columnsTradeHistory['openDate']}><FormattedMessage id="exchangeLendingPage.orders.openDate" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['openDate']}><FormattedMessage id="exchangeLendingPage.orders.closeDate" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['pair']}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['type']}>
          <FormattedMessage id="exchangePage.type" />
          <TypeInfoPopover />
        </HeaderCell>
        <HeaderCell width={columnsTradeHistory['interest']}><FormattedMessage id="exchangeLendingPage.orders.interest" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['filled']}><FormattedMessage id="exchangePage.filledAmount" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['liqPrice']}><FormattedMessage id="exchangeLendingPage.orders.liqPrice" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['collateral']}><FormattedMessage id="exchangeLendingPage.orders.collateral" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['status']}><FormattedMessage id="exchangeLendingPage.orders.status" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['actions']}></HeaderCell>          
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

const OpenTradesTable = ({
  orders, 
  isHideOtherPairs, 
  handleChangeHideOtherPairs, 
  hasScrollBar, 
  authenticated, 
  onSelectTrade,
  toggleRepayModal,
  toggleTopUpModal,
}) => {
  const _rowRenderer = ({index, key, style}: *) => {
    const order = orders[index]
    
    return (
      <Row key={index} style={style} onClick={() => onSelectTrade(order)}>
        <Cell width={columnsOpenTrades['openDate']} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
          <Day>{formatDate(order.time, 'LL-dd')}</Day>
          <Time>{formatDate(order.time, 'HH:mm:ss')}</Time>
        </Cell>
        <Cell width={columnsOpenTrades['closeDate']} title={formatDate(Number(order.liquidationTime)*1000, 'LL-dd HH:mm:ss')} muted>
          <Day>{formatDate(Number(order.liquidationTime)*1000, 'LL-dd')}</Day>
          <Time>{formatDate(Number(order.liquidationTime)*1000, 'HH:mm:ss')}</Time>
        </Cell>
        <Cell width={columnsOpenTrades['pair']} title={order.pair} muted>
          <LendingLabelSide side={order.side} />
          <Link href={`${TOMOSCAN_URL}/lending/trades/${order.hash}`} target="_blank">{`${order.termSymbol}/${order.lendingTokenSymbol}`}</Link>
        </Cell>
        <Cell width={columnsOpenTrades['type']} muted>
          {ORDERTYPES[order.type]}-{TOPUPTYPES[order.autoTopUp]}
        </Cell>
        <Cell width={columnsOpenTrades['interest']} className={`${order.side && order.side.toLowerCase() === "borrow" ? "up" : "down"}`} muted>
          {BigNumber(order.interest).toFormat(2)}&#37;
        </Cell>
        <Cell width={columnsOpenTrades['filled']} muted>
          {BigNumber(order.amount).toFormat()}
        </Cell>
        <Cell width={columnsOpenTrades['liqPrice']} title={`${order.collateralTokenSymbol}/${order.lendingTokenSymbol}`} muted>
          {BigNumber(order.liquidationPrice).toFormat(order.liquidationPricePrecision)}
        </Cell>
        <Cell width={columnsOpenTrades['collateral']} muted>
          {formatAmount(order.collateralLockedAmount)} {order.collateralTokenSymbol}
        </Cell>
        <Cell width={columnsOpenTrades['actions']} muted>
          {
            <ActionsPopover 
              content={
                <ActionsMenu
                  hash={order.hash}
                  side={order.side}
                  toggleRepayModal={toggleRepayModal}
                  toggleTopUpModal={toggleTopUpModal}
                />
              } 
              position={Position.TOP}
              usePortal={false}
            >
              <MoreButton icon="more" />
            </ActionsPopover>
          }
          
        </Cell>
      </Row>
    )
  }  

  return (
    <ListContainer>
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label={<FormattedMessage id="exchangeLendingPage.orders.hideOtherPairs" />} />

      <ListHeader style={{paddingRight: hasScrollBar ? '16px' : '10px'}}>
        <HeaderCell width={columnsOpenTrades['openDate']}><FormattedMessage id="exchangeLendingPage.orders.openDate" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['closeDate']}><FormattedMessage id="exchangeLendingPage.orders.closeDate" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['pair']}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['type']}>
          <FormattedMessage id="exchangePage.type" />
          <TypeInfoPopover />
        </HeaderCell>
        <HeaderCell width={columnsOpenTrades['interest']}><FormattedMessage id="exchangeLendingPage.orders.interest" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['filled']}><FormattedMessage id="exchangePage.filledAmount" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['liqPrice']}>
          <FormattedMessage id="exchangeLendingPage.orders.liqPrice" />
          <LiqInfoPopover />
        </HeaderCell>
        <HeaderCell width={columnsOpenTrades['collateral']}><FormattedMessage id="exchangeLendingPage.orders.collateral" /></HeaderCell>  
        <HeaderCell width={columnsOpenTrades['actions']}></HeaderCell>          
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

const ActionsMenu = ({ side, hash, toggleRepayModal, toggleTopUpModal }) => {
  
  return (
    <Menu>
      {
        (side.toUpperCase() === 'BORROW') && (
          <>
            <MenuItem text={<FormattedMessage id="exchangeLendingPage.orders.actions.topUp" />} onClick={() => toggleTopUpModal(true)} />
            <MenuItem text={<FormattedMessage id="exchangeLendingPage.orders.actions.repay" />} onClick={() => toggleRepayModal(true)} />
          </>
        )
      }
      <MenuLink href={`${TOMOSCAN_URL}/lending/trades/${hash}`} target="_blank"><FormattedMessage id="exchangeLendingPage.orders.actions.details" /> <Icon iconSize='10px' icon="document-share" /></MenuLink>
    </Menu>
  )
}

const TypeInfoPopover = _ => (
  <ActionsPopover
    content={<TypeInfoContent />}
    enforceFocus={false}
    position={Position.BOTTOM}
    interactionKind={PopoverInteractionKind.HOVER}
    usePortal={false}
  >
    <InfoIcon icon="info-sign" iconSize='10px' />
  </ActionsPopover>
)

const TypeInfoContent = _ => (
  <Info>
    <span><FormattedMessage id="exchangeLendingPage.orders.orderType" />-<FormattedMessage id="exchangeLendingPage.orders.topUpType" /></span>
  </Info>
)

const LiqInfoPopover = _ => (
  <ActionsPopover
    content={<LiqInfoContent />}
    enforceFocus={false}
    position={Position.BOTTOM}
    interactionKind={PopoverInteractionKind.HOVER}
    usePortal={false}
  >
    <InfoIcon icon="info-sign" iconSize='10px' />
  </ActionsPopover>
)

const LiqInfoContent = _ => (
  <Info>
    <div><FormattedMessage id="exchangeLendingPage.orders.liqInfor1" /></div>
    <div><FormattedMessage id="exchangeLendingPage.orders.liqInfor2" /></div>
  </Info>
)

const TabsContainer = styled(Tabs)`
  position: relative;

  .bp3-tab-list > *:not(:last-child) {
    margin-right: 0;
    padding-right: 50px;
  }

  .bp3-tab-panel {
    padding-top: 35px !important;
  }

  .funds-checkbox-hide-zero {
    top: 29px !important;
  }

  @media (max-width: 1500px) {
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

  .ReactVirtualized__Grid__innerScrollContainer {
    overflow: visible !important;
  }
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
  padding-left: 5px;

  i.fa-external-link {
    color: ${props => props.theme.mainColorHover};
  }
`

const HeaderCell = styled.span.attrs({ className: props => props.className })`
  width: ${props => (props.width ? props.width : '10%')};
  padding-left: 5px;
`

const CancelIcon = styled(Icon)`
  cursor: pointer;
`

const CheckboxHidePairs = styled(Checkbox)`
  font-size: ${Theme.FONT_SIZE_SM};
  text-align: center;
  margin-bottom: 0 !important;
  position: absolute !important;
  top: 29px;
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

const MoreButton = styled(Icon)`
  cursor: pointer;
  vertical-align: middle;
`

const ActionsPopover = styled(Popover)`
  color: ${props => props.theme.menuColor};

  .bp3-menu {
    color: ${props => props.theme.menuColor};
    background-color: ${props => props.theme.menuBg};
    border: 1px solid ${props => props.theme.border};
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, .1);
  }

  .bp3-menu-item:hover {
    background-color: ${props => props.theme.menuBgHover};
  }

  & .bp3-popover .bp3-popover-arrow-fill {
    fill: ${props => props.theme.menuBg};
  }
`

const MenuLink = styled(Link)`
  display: flex;
  height: 30px;
  padding: 0 7px;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.theme.menuColor};
  &:hover {
    color: ${props => props.theme.menuColor};
    background-color: ${props => props.theme.menuBgHover};
  }
`

const Info = styled.div`
  padding: 5px 10px;
  background-color: ${props => props.theme.menuBg};
`

const InfoIcon = styled(Icon).attrs({
  className: 'info-icon',
})`
  &.info-icon {
    vertical-align: top;
    margin-left: 3px;
  }
`

const Day = styled.span``

const Time = styled.span`
  margin-left: 3px;

  @media (max-width: 1500px) {
    display: none;
  }
`

export default OrdersTableRenderer
