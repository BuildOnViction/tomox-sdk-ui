//@flow
import { utils } from 'ethers'

// we process token, deposit in socket way
import * as appActionCreators from '../actions/app'
import * as actionCreators from '../actions/socketController'
import * as tokenActionCreators from '../actions/tokens'
import * as depositActionCreators from '../actions/deposit'
import * as tokenPairsActionCreators from '../actions/tokenPairs'
import * as notificationsActionCreators from '../actions/notifications'
import * as orderActionsCreators from '../actions/orders'

import {
  getAccountDomain,
  getTokenPairsDomain,
  getWebsocketDomain,
} from '../domains'

// import { queryBalances } from './depositForm'
import { getSigner } from '../services/signer'
import {
  parseOrder,
  parseTrade,
  parseTrades,
  parseTokens,
  parseAddressAssociation,
  parseOrderBookData,
  parseOHLCV,
  parsePriceBoardData,
  parseTokenPairsData,
} from '../../utils/parsers'

import type { State, Dispatch, GetState, ThunkAction } from '../../types/'
import type { WebsocketEvent, WebsocketMessage } from '../../types/websocket'
import { queryAccountBalance } from './accountBalances'

export default function socketControllerSelector(state: State) {
  return {
    authenticated: getAccountDomain(state).authenticated(),
    pairs: getTokenPairsDomain(state).getPairsByCode(),
    isOpened: getWebsocketDomain(state).isOpened(),
  }
}

// eslint-disable-next-line
export function openConnection(): ThunkAction {
  return (dispatch, getState, { socket }) => {
    socket.createConnection()
    dispatch(actionCreators.createConnection())

    const closeConnection = socket.openConnection(event => {
      switch (event.type) {
        case 'close':
          return handleWebsocketCloseMessage(dispatch, event, closeConnection)
        case 'error':
          return handleWebsocketErrorMessage(dispatch, event, closeConnection)
        case 'open':
          return handleWebsocketOpenMessage(dispatch, event)
        default:
          break
      }
    })

    socket.onMessage((message: WebsocketMessage) => {
      const { channel, event } = message
      // we can pass dispatch, or call dispatch to update redux
      switch (channel) {
        case 'orders':
          return handleOrderMessage(dispatch, event, getState)
        case 'orderbook':
          return dispatch(handleOrderBookMessage(event))
        case 'trades':
          return dispatch(handleTradesMessage(event))
        case 'ohlcv':
          return dispatch(handleOHLCVMessage(event))
        case 'tokens':
          return handleTokenMessage(dispatch, event, getState)
        case 'deposit':
          // update tokens balances, tokens changes
          return handleDepositMessage(dispatch, event, getState)
        case 'price_board':
          return dispatch(handlePriceMessage(dispatch, event, getState))
        case 'markets':
          return handleMarketsMessage(dispatch, event, getState)
        case 'notification':
          return handleNotificationMessage(dispatch, event, getState)
        default:
          console.log(channel, event)
          break
      }
    })

    return () => {
      //TODO currently, i believe the unsubscription is only used by SocketController/componentDidMount function
      //TODO This causes a notification to appear while we do not want to display a 'Connection lost' notification when logging out.
      //TODO Therefore i currently do not close the connection gracefully to avoid this problem. Looking for a workaround
      // closeConnection()
      dispatch(actionCreators.closeConnection())
    }
  }
}

const handleWebsocketOpenMessage = (dispatch, event) => {
  dispatch(actionCreators.openConnection())
}

const handleWebsocketCloseMessage = (
  dispatch: Dispatch,
  event,
  closeConnection,
) => {
  setTimeout(() => dispatch(openConnection()), 5000)
}

const handleWebsocketErrorMessage = (
  dispatch: Dispatch,
  event: WebsocketEvent,
  closeConnection,
) => {
  console.log(event)
}

const handleDepositMessage = (
  dispatch: Dispatch,
  event: WebsocketEvent,
  getState: GetState,
) => {
  const { type } = event
  switch (type) {
    case 'UPDATE':
      return handleDepositUpdated(dispatch, event, getState)
    // trigger updating all tokens balances
    case 'SUCCESS':
      return handleDepositSucceeded(dispatch, event, getState)
    default:
      console.log('Unknown', event)
      return
  }
}

function handleDepositUpdated(
  dispatch: Dispatch,
  event: WebsocketEvent,
  getState,
) {
  try {
    // let state = getState();
    const parsed = parseAddressAssociation(event.payload)
    if (parsed) {
      const { chain, addressAssociation } = parsed
      // console.log(chain, addressAssociation, event.payload);
      dispatch(
        appActionCreators.addSuccessNotification({ message: 'Deposit updated' }),
      )
      dispatch(
        depositActionCreators.updateAddressAssociation(
          chain,
          addressAssociation,
        ),
      )
    }
  } catch (e) {
    console.log(e)
    dispatch(
      appActionCreators.addErrorNotification({
        message: e.message,
      }),
    )
  }
}

function handleDepositSucceeded(
  dispatch: Dispatch,
  event: WebsocketEvent,
  getState,
) {
  try {
    // let state = getState();
    if (event.payload) {
      const { chain, txEnvelopes } = event.payload
      // console.log(chain, addressAssociation, event.payload);
      dispatch(
        appActionCreators.addSuccessNotification({
          message: 'Balances updated',
        }),
      )
      dispatch(
        depositActionCreators.updateAssociationTransactions(chain, txEnvelopes),
      )
      // dispatch(queryBalances())
    }
  } catch (e) {
    console.log(e)
    dispatch(
      appActionCreators.addErrorNotification({
        message: e.message,
      }),
    )
  }
}

const handleTokenMessage = (
  dispatch: Dispatch,
  event: WebsocketEvent,
  getState: GetState,
) => {
  const { type } = event
  switch (type) {
    case 'UPDATE':
      return handleTokenListUpdated(dispatch, event, getState)
    default:
      console.log('Unknown', event)
      return
  }
}

function handleTokenListUpdated(
  dispatch: Dispatch,
  event: WebsocketEvent,
  getState,
) {
  try {
    // let state = getState();
    if (event.payload) {
      const tokens = parseTokens(event.payload)

      dispatch(
        appActionCreators.addSuccessNotification({ message: 'Tokens updated' }),
      )
      dispatch(tokenActionCreators.updateTokensList(tokens))
    }
  } catch (e) {
    console.log(e)
    dispatch(
      appActionCreators.addErrorNotification({
        message: e.message,
      }),
    )
  }
}

const handleOrderMessage = async (dispatch, event: WebsocketEvent, getState): ThunkAction => {
  const { type } = event

  if (type !== 'ORDER_CANCELLED') dispatch(orderActionsCreators.ordersUpdatedStatus(false))
  dispatch(queryAccountBalance())

  switch (type) {
    case 'ORDER_ADDED':
      return dispatch(handleOrderAdded(event))
    case 'ORDER_CANCELLED':
      return dispatch(handleOrderCancelled(event))
    case 'ORDER_REJECTED':
      return dispatch(handleOrderRejected(event))
    case 'ORDER_MATCHED':
      return dispatch(handleOrderMatched(event))
    case 'ORDER_SUCCESS':
      return dispatch(handleOrderSuccess(event))
    case 'ORDER_PENDING':
      return dispatch(handleOrderPending(event))
    case 'ERROR':
      return dispatch(handleOrderError(event))
    default:
      console.log('Unknown', event)
      return
  }
}

function handleOrderAdded(event: WebsocketEvent): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      const state = getState()
      const {orders: {byHash}} = state
      let order = event.payload
      const { pairs } = socketControllerSelector(state)
      const pairInfo = pairs[order.pairName]
      order = parseOrder(order, pairInfo)
      dispatch(actionCreators.updateOrdersTable([order]))
      
      if (!byHash[order.hash]) {
        dispatch(appActionCreators.addOrderAddedNotification())
      }
    } catch (e) {
      console.log(e)
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
    }

  }
}

function handleOrderCancelled(event: WebsocketEvent): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      const state = getState()
      const { pairs } = socketControllerSelector(state)
      let order = event.payload
      const pairInfo = pairs[order.pairName]

      order = parseOrder(order, pairInfo)

      dispatch(appActionCreators.addOrderCancelledNotification())
      dispatch(actionCreators.updateOrdersTable([order]))
    } catch (e) {
      console.log(e)
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

function handleOrderRejected(event: WebsocketEvent): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      const state = getState()
      const { pairs } = socketControllerSelector(state)
      let order = event.payload
      const pairInfo = pairs[order.pairName]

      order = parseOrder(order, pairInfo)

      dispatch(appActionCreators.addOrderRejectedNotification())
      dispatch(actionCreators.updateOrdersTable([order]))
    } catch (e) {
      console.log(e)
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

function handleOrderMatched(event: WebsocketEvent): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      const state = getState()
      const { pairs } = socketControllerSelector(state)
      const { matches } = event.payload
      const takerOrder = matches.takerOrder
      const pairInfo = pairs[takerOrder.pairName]

      const order = parseOrder(takerOrder, pairInfo)

      dispatch(appActionCreators.addOrderMatchedNotification())
      dispatch(actionCreators.updateOrdersTable([order]))
    } catch (e) {
      console.log(e)
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

function handleOrderSuccess(event: WebsocketEvent): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      const state = getState()
      const { pairs } = socketControllerSelector(state)
      const signer = getSigner()
      const signerAddress = await signer.getAddress()
      const matches = event.payload.matches
      const trades = matches.trades
      const txHash = trades[0].txHash
      const pairName = trades[0].pairName
      let userOrders = []
      let userTrades = []
      const userIsTaker = utils.getAddress(matches.takerOrder.userAddress) === signerAddress
      const pairInfo = pairs[pairName]

      if (userIsTaker) {
        const parsedOrder = parseOrder(matches.takerOrder, pairInfo)
        userOrders = [parsedOrder]

        userTrades = matches.trades.map(trade => parseTrade(trade, pairInfo))
        const { price, amount, side, filled, pair } = parsedOrder
        dispatch(appActionCreators.addOrderSuccessNotification({ txHash, pair, price, amount, filled, side }))


      } else {
        matches.makerOrders.forEach(order => {
          if (utils.getAddress(order.userAddress) === signerAddress) {
            const parsedOrder = parseOrder(order, pairInfo)
            userOrders.push(parsedOrder)
            const { price, amount, filled, side, pair } = parsedOrder
            dispatch(appActionCreators.addOrderSuccessNotification({ txHash, pair, price, amount, filled, side }))
          }
        })

        matches.trades.forEach(trade => {
          if (utils.getAddress(trade.maker) === signerAddress) {
            const tradeParsed = parseTrade(trade, pairInfo)
            tradeParsed.side = tradeParsed.side === 'BUY' ? 'SELL' : 'BUY'
            userTrades.push(tradeParsed)
          }
        })
      }
      
      if (userOrders.length > 0) dispatch(actionCreators.updateOrdersTable(userOrders))
      if (userTrades.length > 0) dispatch(actionCreators.updateTradesByAddress(userTrades))
    } catch (e) {
      console.log(e)
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

function handleOrderPending(event: WebsocketEvent): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      const signer = getSigner()
      const state = getState()
      const { pairs } = socketControllerSelector(state)
      const signerAddress = await signer.getAddress()
      const matches = event.payload.matches
      const trades = matches.trades
      const txHash = trades[0].txHash
      const pairName = trades[0].pairName
      let userOrders = []
      let userTrades = []
      const userIsTaker = utils.getAddress(matches.takerOrder.userAddress) === signerAddress
      const pairInfo = pairs[pairName]

      if (userIsTaker) {
        const parsedOrder = parseOrder(matches.takerOrder, pairInfo)
        userOrders = [parsedOrder]
        userTrades = matches.trades.map(trade => parseTrade(trade, pairInfo))
        const { price, amount, side, filled, pair } = parsedOrder
        dispatch(appActionCreators.addOrderPendingNotification({ txHash, pair, price, amount, filled, side }))


      } else {
        matches.makerOrders.forEach(order => {
          if (utils.getAddress(order.userAddress) === signerAddress) {
            const parsedOrder = parseOrder(order, pairInfo)

            userOrders.push(parsedOrder)
            const { price, amount, filled, side, pair } = parsedOrder
            dispatch(appActionCreators.addOrderPendingNotification({ txHash, pair, price, amount, filled, side }))
          }
        })

        matches.trades.forEach(trade => {
          if (utils.getAddress(trade.maker) === signerAddress || utils.getAddress(trade.maker) === signerAddress) {
            userTrades.push(parseTrade(trade, pairInfo))
          }
        })
      }

      if (userOrders.length > 0) dispatch(actionCreators.updateOrdersTable(userOrders))
      if (userTrades.length > 0) dispatch(actionCreators.updateTradesByAddress(userTrades))
    } catch (e) {
      console.log(e)
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

function handleOrderError(event: WebsocketEvent): ThunkAction {
  return async dispatch => {
    if (event.payload) {
      const { message } = event.payload
      dispatch(appActionCreators.addErrorNotification({ message: `Error: ${message}` }))
    }
  }
}

const handleOrderBookMessage = (event: WebsocketEvent): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    const state = getState()
    const { pairs } = socketControllerSelector(state)

    if (event.type === 'ERROR' || !event.payload) return
    // if (event.payload.length === 0) return

    const { pairName } = event.payload
    const pairInfo = pairs[pairName]
    let bids, asks, orderBookData

    try {
      switch (event.type) {
        case 'INIT':
          orderBookData = parseOrderBookData(event.payload, pairInfo)
          bids = orderBookData.bids
          asks = orderBookData.asks
          dispatch(actionCreators.initOrderBook(bids, asks))
          break

        case 'UPDATE':
          orderBookData = parseOrderBookData(event.payload, pairInfo)
          bids = orderBookData.bids
          asks = orderBookData.asks
          dispatch(actionCreators.updateOrderBook(bids, asks))
          break

        default:
          return
      }
    } catch (e) {
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
      console.log(e)
    }
  }
}

const handleTradesMessage = (event: WebsocketEvent): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    const state = getState()
    const { pairs } = socketControllerSelector(state)

    if (event.type === 'ERROR' || !event.payload) return
    if (event.payload.length === 0) return

    let trades = event.payload
    const { pairName } = trades[0]
    const pair = pairs[pairName]

    try {
      switch (event.type) {
        case 'INIT':
          trades = parseTrades(trades, pair)
          dispatch(actionCreators.initTradesTable(trades))
          break
        case 'UPDATE':
          trades = parseTrades(trades, pair)
          dispatch(actionCreators.updateTradesTable(trades))
          break
        default:
          return
      }
    } catch (e) {
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
      console.log(e)
    }
  }
}

const handleOHLCVMessage = (event: WebsocketEvent): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    const state = getState()
    const { pairs } = socketControllerSelector(state)

    if (event.type === 'ERROR' || !event.payload) return
    if (event.payload.length === 0) {
      dispatch(actionCreators.initOHLCV([]))
      return
    }

    let ohlcv = event.payload
    if (!Array.isArray(ohlcv)) {
      // In case of INIT OHLCV, the payload is an array
      // But in case of UPDATE OHLCV, the payload is an object
      ohlcv = [ohlcv]
    }
    const { pairName } = ohlcv[0].pair
    const pair = pairs[pairName]

    try {
      switch (event.type) {
        case 'INIT':
          ohlcv = parseOHLCV(ohlcv, pair)
          dispatch(actionCreators.initOHLCV(ohlcv))
          break
        case 'UPDATE':
          ohlcv = parseOHLCV(ohlcv, pair)
          dispatch(actionCreators.updateOHLCV(ohlcv))
          break
        default:
          return
      }
    } catch (e) {
      console.log(e)
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

const handlePriceMessage = (
  dispatch: Dispatch,
  event: WebsocketEvent,
  getState: GetState
): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    const state = getState()
    const pairDomain = getTokenPairsDomain(state)
    const data = event.payload
    const currentPair = pairDomain.getCurrentPair()
    const currentPairData = parsePriceBoardData(data, currentPair)
    dispatch(tokenPairsActionCreators.updateCurrentPairData(currentPairData))
  }
}

const handleMarketsMessage = (
    dispatch: Dispatch, 
    event: WebsocketEvent,
    getState: GetState,
  ) => {
  let { payload: { pairData, smallChartsData }} = event
  const state = getState()
  const pairDomain = getTokenPairsDomain(state)
  const pairs = pairDomain.getPairsByCode()

  pairData = parseTokenPairsData(pairData, pairs)

  dispatch(actionCreators.updateTokenPairData(pairData))
  dispatch(actionCreators.updateSmallChartsData(smallChartsData))
}

const handleNotificationMessage = (
    dispatch,
    event: WebsocketEvent,
    getState: GetState,
  ) => {
  const { type, payload } = event
  // Todo: need handle in case ERROR
  if (type === 'INIT' || type === 'ERROR') return
  dispatch(notificationsActionCreators.updateNewNotifications(payload))
}