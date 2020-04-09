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
  Menu,
  MenuItem,
} from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import { List, AutoSizer } from 'react-virtualized'
import { Link as InternalLink } from 'react-router-dom'

import { TOMOSCAN_URL } from '../../../config/environment'
import { Colors, Loading, TmColors, Theme, Link, Centered, Text, UtilityIcon } from '../../Common'
import { formatDate, capitalizeFirstLetter } from '../../../utils/helpers'
import tickUrl from '../../../assets/images/tick.svg'
import FundsTable from '../../FundsTable'

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

const rowHeight = 45
const overscanRowCount = 5
const widthColumns = ['15%', '15%', '8%', '8%', '13%', '13%', '13%', '15%']
const widthColumnsOrderHistory = ['12%', '10%', '10%', '8%', '15%', '12%', '15%', '18%']
const columnsTradeHistory = {
  openDate: '12%', 
  closeDate: '12%',
  pair: '15%', 
  type: '10%', 
  interest: '10%', 
  filled: '10%',
  liqPrice: '13%',
  collateral: '13%',
  status: '9%',
}
const columnsOpenTrades = {
  openDate: '12%',
  closeDate: '12%',
  pair: '18%',
  type: '10%',
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
        <Cell width={widthColumns[0]} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
          {formatDate(order.time, 'LL-dd HH:mm:ss')}
        </Cell>
        <Cell width={widthColumns[1]} title={order.pair} muted>
          <Link href={`${TOMOSCAN_URL}/orders/${order.hash}`} target="_blank">{`${order.termSymbol}/${order.lendingTokenSymbol}`}</Link>
        </Cell>
        <Cell width={widthColumns[2]} muted>
          {ORDERTYPES[order.type]}
        </Cell>
        <Cell width={widthColumns[3]} className={`${order.side && order.side.toLowerCase() === "borrow" ? "up" : "down"}`} muted>
          {order.side && capitalizeFirstLetter(order.side)}
        </Cell>
        <Cell width={widthColumns[4]} muted>
          {BigNumber(order.interest).toFormat(2)}&#37;
        </Cell>
        <Cell width={widthColumns[5]} muted>
          {BigNumber(order.amount).toFormat()}
        </Cell>
        <Cell width={widthColumns[6]} muted>
          {order.filled && BigNumber(order.filledPercent).toFormat(2)}%
        </Cell>
        <Cell width={widthColumns[7]} muted>
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
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label="Hide other pairs" />

      <ListHeader style={{paddingRight: hasScrollBar ? '16px' : '10px'}}>
        <HeaderCell width={widthColumns[0]}><FormattedMessage id="exchangePage.date" /></HeaderCell>
        <HeaderCell width={widthColumns[1]}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={widthColumns[2]}><FormattedMessage id="exchangePage.type" /></HeaderCell>
        <HeaderCell width={widthColumns[3]}><FormattedMessage id="exchangePage.side" /></HeaderCell>
        <HeaderCell width={widthColumns[4]}><FormattedMessage id="exchangeLendingPage.orders.interest" /></HeaderCell>
        <HeaderCell width={widthColumns[5]}><FormattedMessage id="exchangePage.amount" /></HeaderCell>
        {/* <HeaderCell width={widthColumns[6]}><FormattedMessage id="exchangePage.total" /></HeaderCell>           */}
        <HeaderCell width={widthColumns[6]}><FormattedMessage id="exchangePage.filled" /></HeaderCell>
        <HeaderCell width={widthColumns[7]}></HeaderCell>
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
          <Link href={`${TOMOSCAN_URL}/orders/${order.hash}`} target="_blank">{`${order.termSymbol}/${order.lendingTokenSymbol}`}</Link>
        </Cell>
        <Cell width={widthColumnsOrderHistory[2]} muted>
          {ORDERTYPES[order.type]}
        </Cell>
        <Cell width={widthColumnsOrderHistory[3]} className={`${order.side && order.side.toLowerCase() === "borrow" ? "up" : "down"}`} muted>
          {order.side && capitalizeFirstLetter(order.side)}
        </Cell>
        <Cell width={widthColumnsOrderHistory[4]} muted>
          {BigNumber(order.interest).toFormat(2)}&#37;
        </Cell>
        <Cell width={widthColumnsOrderHistory[5]} muted>
          {BigNumber(order.amount).toFormat()}
        </Cell>
        <Cell width={widthColumnsOrderHistory[6]} muted>
          {order.filled && BigNumber(order.filledPercent).toFormat(2)}%
        </Cell>
        <Cell width={widthColumnsOrderHistory[7]} muted>
          {STATUS[order.status]}
        </Cell>
      </Row>
    )
  }
  
  return (
    <ListContainer className="list-container">
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label="Hide other pairs" />

      <ListHeader style={{paddingRight: hasScrollBar ? '16px' : '10px'}}>
        <HeaderCell width={widthColumnsOrderHistory[0]}><FormattedMessage id="exchangePage.date" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[1]}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[2]}><FormattedMessage id="exchangePage.type" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[3]}><FormattedMessage id="exchangePage.side" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[4]}><FormattedMessage id="exchangeLendingPage.orders.interest" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[5]}><FormattedMessage id="exchangePage.amount" /></HeaderCell>
        {/* <HeaderCell width={widthColumnsOrderHistory[6]}><FormattedMessage id="exchangePage.total" /></HeaderCell>           */}
        <HeaderCell width={widthColumnsOrderHistory[6]}><FormattedMessage id="exchangePage.filled" /></HeaderCell>
        <HeaderCell width={widthColumnsOrderHistory[7]}><FormattedMessage id="exchangePage.status" /></HeaderCell>
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
        <Cell width={columnsTradeHistory['openDate']} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
          {formatDate(order.time, 'LL-dd HH:mm:ss')}
        </Cell>
        <Cell width={columnsTradeHistory['closeDate']} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
          {formatDate(order.updatedAt, 'LL-dd HH:mm:ss')}
        </Cell>
        <Cell width={columnsTradeHistory['pair']} title={`${order.termSymbol}/${order.lendingTokenSymbol}`} muted>
          <Link href={`${TOMOSCAN_URL}/trades/${order.hash}`} target="_blank">{`${order.termSymbol}/${order.lendingTokenSymbol}`}</Link>
        </Cell>
        <Cell width={columnsTradeHistory['type']} muted>
          {ORDERTYPES[order.type]}
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
          {BigNumber(order.collateralLockedAmount).toFormat()} {order.collateralTokenSymbol}
        </Cell>
        <Cell width={columnsTradeHistory['status']} muted>
          {TRADE_STATUS[order.status]}
        </Cell>
      </Row>
    )
  }  

  return (
    <ListContainer>
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label="Hide other pairs" />

      <ListHeader style={{paddingRight: hasScrollBar ? '16px' : '10px'}}>
        <HeaderCell width={columnsTradeHistory['openDate']}><FormattedMessage id="exchangeLendingPage.orders.openDate" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['openDate']}><FormattedMessage id="exchangeLendingPage.orders.closeDate" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['pair']}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['type']}><FormattedMessage id="exchangePage.type" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['interest']}><FormattedMessage id="exchangeLendingPage.orders.interest" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['filled']}><FormattedMessage id="exchangePage.filledAmount" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['liqPrice']}><FormattedMessage id="exchangeLendingPage.orders.liqPrice" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['collateral']}><FormattedMessage id="exchangeLendingPage.orders.collateral" /></HeaderCell>
        <HeaderCell width={columnsTradeHistory['status']}><FormattedMessage id="exchangeLendingPage.orders.status" /></HeaderCell>
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
      <Row key={index} style={style} onClick={() => onSelectTrade(order.hash)}>
        <Cell width={columnsOpenTrades['openDate']} title={formatDate(order.time, 'LL-dd HH:mm:ss')} muted>
          {formatDate(order.time, 'LL-dd HH:mm:ss')}
        </Cell>
        <Cell width={columnsOpenTrades['closeDate']} muted>
          {formatDate(Number(order.liquidationTime)*1000, 'LL-dd HH:mm:ss')}
        </Cell>
        <Cell width={columnsOpenTrades['pair']} title={order.pair} muted>
          <Link href={`${TOMOSCAN_URL}/trades/${order.hash}`} target="_blank">{`${order.termSymbol}/${order.lendingTokenSymbol}`}</Link>
        </Cell>
        <Cell width={columnsOpenTrades['type']} muted>
          {ORDERTYPES[order.type]}
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
          {BigNumber(order.collateralLockedAmount).toFormat()} {order.collateralTokenSymbol}
        </Cell>
        <Cell width={columnsOpenTrades['actions']} muted>
          {
            order.isBorrower && (
              <ActionsPopover 
                content={
                  <ActionsMenu 
                    toggleRepayModal={toggleRepayModal}
                    toggleTopUpModal={toggleTopUpModal}
                  />
                } 
                position={Position.TOP}
                usePortal={false}
              >
                <MoreButton icon="more" />
              </ActionsPopover>
            )
          }
          
        </Cell>
      </Row>
    )
  }  

  return (
    <ListContainer>
      <CheckboxHidePairs checked={isHideOtherPairs} onChange={handleChangeHideOtherPairs} label="Hide other pairs" />

      <ListHeader style={{paddingRight: hasScrollBar ? '16px' : '10px'}}>
        <HeaderCell width={columnsOpenTrades['openDate']}><FormattedMessage id="exchangeLendingPage.orders.openDate" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['closeDate']}><FormattedMessage id="exchangeLendingPage.orders.closeDate" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['pair']}><FormattedMessage id="exchangePage.pair" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['type']}><FormattedMessage id="exchangePage.type" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['interest']}><FormattedMessage id="exchangeLendingPage.orders.interest" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['filled']}><FormattedMessage id="exchangePage.filledAmount" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['liqPrice']}><FormattedMessage id="exchangeLendingPage.orders.liqPrice" /></HeaderCell>
        <HeaderCell width={columnsOpenTrades['collateral']}><FormattedMessage id="exchangeLendingPage.orders.collateral" /></HeaderCell>  
        <HeaderCell width={columnsOpenTrades['actions']}><FormattedMessage id="exchangeLendingPage.orders.actions" /></HeaderCell>          
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

const ActionsMenu = ({ toggleRepayModal, toggleTopUpModal }) => {
  
  return (
    <Menu>
      <MenuItem text="Top up" onClick={() => toggleTopUpModal(true)} />
      <MenuItem text="Repay" onClick={() => toggleRepayModal(true)} />
    </Menu>
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

const MoreButton = styled(Icon)`
  cursor: pointer;
`

const ActionsPopover = styled(Popover)`
  .bp3-menu {
    color: ${props => props.theme.menuColor};
    background-color: ${props => props.theme.menuBg};
  }

  .bp3-menu-item:hover {
    background-color: ${props => props.theme.menuBgHover};
  }

  & .bp3-popover .bp3-popover-arrow-fill {
    fill: ${props => props.theme.menuBg};
  }
`

export default OrdersTableRenderer
