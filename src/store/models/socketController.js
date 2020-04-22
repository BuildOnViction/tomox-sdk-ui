//@flow
import { utils } from 'ethers'

// we process token, deposit in socket way
import * as appActionCreators from '../actions/app'
import * as actionCreators from '../actions/socketController'
import * as tokenPairsActionCreators from '../actions/tokenPairs'
import * as orderActionsCreators from '../actions/orders'
import * as lendingOrdersActionsCreators from '../actions/lending/lendingOrders'

import {
  getAccountDomain,
  getTokenPairsDomain,
  getWebsocketDomain,
  getTokenDomain,
  getLendingOrdersDomain,
} from '../domains'

import { getSigner } from '../services/signer'
import {
  parseOrder,
  parseTrade,
  parseTrades,
  parseOrderBookData,
  parseOHLCV,
  parsePriceBoardData,
  parseTokenPairsData,
  parseLendingOrderBookData,
  parseLendingTrades,
  parseLendingPairsData,
  parseLendingOrders,
  parseLendingTradesByAddress,
  parseLendingPriceBoard,
  parseLendingOHLCV,
} from '../../utils/parsers'

import type { State, Dispatch, GetState, ThunkAction } from '../../types/'
import type { WebsocketEvent, WebsocketMessage } from '../../types/websocket'
import { queryAccountBalance } from './accountBalances'
import { pricePrecision as defaultPricePrecision, amountPrecision as defaultAmountPrecision } from '../../config/tokens'

export default function socketControllerSelector(state: State) {
  return {
    authenticated: getAccountDomain(state).authenticated(),
    pairs: getTokenPairsDomain(state).getPairsByCode(),
    isOpened: getWebsocketDomain(state).isOpened(),
    currentPairData: getTokenPairsDomain(state).getCurrentPairData(),
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
        case 'price_board':
          return dispatch(handlePriceMessage(dispatch, event, getState))
        case 'markets':
          return handleMarketsMessage(dispatch, event, getState)
        
        // Lending
        case 'lending_orderbook':
          return dispatch(handleLendingOrderBookMessage(event))
        case 'lending_trades':
          return dispatch(handleLendingTradesMessage(event))
        case 'lending_markets':
          return dispatch(handleLendingMarketsMessage(event))
        case 'lending_orders':
          return handleLendingOrderMessage(dispatch, event, getState)
        case 'lending_price_board':
          return dispatch(handleLendingPriceMessage(dispatch, event, getState))
        case 'lending_ohlcv':
          return dispatch(handleLendingOHLCVMessage(event))
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

const handleOrderMessage = async (dispatch, event: WebsocketEvent, getState): ThunkAction => {
  dispatch(queryAccountBalance()) // Get the balance of tokens
  const { type } = event

  if (type !== 'ORDER_CANCELLED') dispatch(orderActionsCreators.ordersUpdatedStatus(false)) // Remove loading screen in OrderForm
  dispatch(actionCreators.updateNewNotifications()) 

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
      const userIsTaker = utils.getAddress(matches.takerOrder.userAddress).toLowerCase() === signerAddress.toLowerCase()
      const pairInfo = pairs[pairName]

      if (userIsTaker) {
        const parsedOrder = parseOrder(matches.takerOrder, pairInfo)
        userOrders = [parsedOrder]

        userTrades = matches.trades.map(trade => parseTrade(trade, pairInfo))
        const { price, amount, side, filled, pair } = parsedOrder
        dispatch(appActionCreators.addOrderSuccessNotification({ txHash, pair, price, amount, filled, side }))
      } else {
        matches.makerOrders.forEach(order => {
          if (utils.getAddress(order.userAddress).toLowerCase() === signerAddress.toLowerCase()) {
            const parsedOrder = parseOrder(order, pairInfo)
            userOrders.push(parsedOrder)
            const { price, amount, filled, side, pair } = parsedOrder
            dispatch(appActionCreators.addOrderSuccessNotification({ txHash, pair, price, amount, filled, side }))
          }
        })

        matches.trades.forEach(trade => {
          if (utils.getAddress(trade.maker).toLowerCase() === signerAddress.toLowerCase()) {
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
    const { pairs, currentPairData } = socketControllerSelector(state)

    if (event.type === 'ERROR' || !event.payload) return
    // if (event.payload.length === 0) return

    const { pairName } = event.payload
    const pairInfo = pairs[pairName]
    let bids, asks, orderBookData, pricePrecision = defaultPricePrecision, amountPrecision = defaultAmountPrecision

    if (currentPairData) {
      pricePrecision = currentPairData.pricePrecision
      amountPrecision = currentPairData.amountPrecision
    }

    try {
      switch (event.type) {
        case 'INIT':
          orderBookData = parseOrderBookData(event.payload, pairInfo, amountPrecision, pricePrecision)
          bids = orderBookData.bids
          asks = orderBookData.asks
          dispatch(actionCreators.initOrderBook(bids, asks))
          break

        case 'UPDATE':
          orderBookData = parseOrderBookData(event.payload, pairInfo, amountPrecision, pricePrecision)
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
      if (window.onHistoryCallback) window.onHistoryCallback([], {noData: true})
      dispatch(actionCreators.initOHLCV([]))
      dispatch(actionCreators.updateOHLCVLoading(false))
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
          if (window.onHistoryCallback) {
            window.onHistoryCallback(ohlcv, {noData: false})
            window.ohlcvLastBar = ohlcv.slice(-1)[0]
          }
          dispatch(actionCreators.initOHLCV(ohlcv))
          dispatch(actionCreators.updateOHLCVLoading(false))
          break
        case 'UPDATE':
          ohlcv = parseOHLCV(ohlcv, pair)
          if (window.onRealtimeCallback && (ohlcv[0].time >= window.ohlcvLastBar.time)) {
            window.onRealtimeCallback(ohlcv[0])
            window.ohlcvLastBar = ohlcv[0]
          }
          dispatch(actionCreators.updateOHLCV(ohlcv))
          break
        default:
          return
      }
    } catch (e) {
      // We reject error when calling Mozilla APIs . Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Errors
      if (e.name !== 'NS_ERROR_NOT_INITIALIZED') {
        console.log(e)
        dispatch(appActionCreators.addErrorNotification({ message: e.message }))
      }
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
  //eslint-disable-next-line
  let { payload: { pairData, smallChartsData }} = event
  const state = getState()
  const pairDomain = getTokenPairsDomain(state)
  const pairs = pairDomain.getPairsByCode()

  pairData = parseTokenPairsData(pairData, pairs)

  dispatch(actionCreators.updateTokenPairData(pairData))
  dispatch(actionCreators.updateSmallChartsData(smallChartsData))
  dispatch(actionCreators.updateLoadingTokenPair(false))
}

const handleLendingOrderBookMessage = (event: WebsocketEvent): ThunkAction => {
  return async (dispatch, getState, { socket }) => {

    if (event.type === 'ERROR' || !event.payload) return
    if (event.payload.length === 0) return

    const tokenAddress = event.payload.name.split('::').pop()
    const state = getState()
    const token = getTokenDomain(state).getTokenByAddress(tokenAddress)
    const decimals = token ? token.decimals : 18

    let bids, asks, lendingOrderBookData

    try {
      switch (event.type) {
        case 'INIT':
          lendingOrderBookData = parseLendingOrderBookData(event.payload, decimals)
          bids = lendingOrderBookData.bids
          asks = lendingOrderBookData.asks
          dispatch(actionCreators.initLendingOrderBook(bids, asks))
          break

        case 'UPDATE':
          lendingOrderBookData = parseLendingOrderBookData(event.payload, decimals)
          bids = lendingOrderBookData.bids
          asks = lendingOrderBookData.asks
          dispatch(actionCreators.updateLendingOrderBook(bids, asks))
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

const handleLendingTradesMessage = (event: WebsocketEvent): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    if (event.type === 'ERROR' || !event.payload) return
    if (event.payload.length === 0) return

    const tokenAddress = event.payload[0].lendingToken.toLowerCase()
    const state = getState()
    const token = getTokenDomain(state).getTokenByAddress(tokenAddress)
    const decimals = token ? token.decimals : 18
    let lendingTrades = event.payload
    
    try {
      switch (event.type) {
        case 'INIT':
          lendingTrades = parseLendingTrades(lendingTrades, decimals)
          dispatch(actionCreators.initLendingTradesTable(lendingTrades))
          break
        case 'UPDATE':
          lendingTrades = parseLendingTrades(lendingTrades, decimals)
          dispatch(actionCreators.updateLendingTradesTable(lendingTrades))
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

const handleLendingMarketsMessage = (event: WebsocketEvent) => {
  return async (dispatch, getState) => {
    const state = getState()
    const lendingTokensObj = getTokenDomain(state).byAddress()

    let { payload: { pairData }} = event

    pairData = parseLendingPairsData(pairData, lendingTokensObj)
    dispatch(actionCreators.updateLendingPairsData(pairData))
  }
}

const handleLendingOrderMessage = async (dispatch, event: WebsocketEvent, getState): ThunkAction => {
  dispatch(queryAccountBalance()) // Get the balance of tokens
  const { type } = event

  if (type === 'INIT') return
  if (type !== 'LENDING_ORDER_CANCELLED') dispatch(lendingOrdersActionsCreators.lendingOrdersUpdateLoading(false))
  dispatch(actionCreators.updateNewNotifications()) 

  switch (type) {
    case 'LENDING_ORDER_ADDED':
      return dispatch(handleLendingOrderAdded(event))
    case 'LENDING_ORDER_CANCELLED':
      return dispatch(handleLendingOrderCancelled(event))
    // case 'LENDING_ORDER_REJECTED':
    //   return dispatch(handleOrderRejected(event))
    // case 'LENDING_ORDER_MATCHED':
    //   return dispatch(handleOrderMatched(event))
    case 'LENDING_ORDER_SUCCESS':
      return dispatch(handleLendingOrderSuccess(event))
    case 'LENDING_ORDER_REPAYED':
    case 'LENDING_ORDER_TOPUPED':
      return dispatch(handleLendingOrderRepayedTopUped(event))
    case 'ERROR':
      return dispatch(handleOrderError(event))
    default:
      console.log('Unknown', event)
      return
  }
}

function handleLendingOrderAdded(event: WebsocketEvent): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      const state = getState()
      const byHash = getLendingOrdersDomain(state).byHash()
      const order: Array<Object> = parseLendingOrders([event.payload])

      dispatch(actionCreators.updateLendingOrders(order))
      
      if (!byHash[order.hash]) {
        dispatch(appActionCreators.addOrderAddedNotification())
      }
    } catch (e) {
      console.log(e)
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
    }

  }
}

function handleLendingOrderCancelled(event: WebsocketEvent): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      const order: Array<Object> = parseLendingOrders([event.payload])

      dispatch(actionCreators.updateLendingOrders(order))
      dispatch(appActionCreators.addOrderCancelledNotification())
    } catch (e) {
      console.log(e)
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

function handleLendingOrderSuccess(event: WebsocketEvent): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      const state = getState()
      const userAddress = getAccountDomain(state).address()
      const pairs = getTokenPairsDomain(state).getPairsArray()
      const matches = event.payload.matches
      let userOrders = []
      let userTrades = []
      const userIsBorrower = matches.borrowing.userAddress.toLowerCase() === userAddress.toLowerCase()

      userOrders  = userIsBorrower 
        ? parseLendingOrders([matches.borrowing]) 
        : parseLendingOrders(matches.investing)
      userTrades = parseLendingTradesByAddress(userAddress, matches.lendingTrades, pairs)
      
      if (userOrders.length > 0) dispatch(actionCreators.updateLendingOrders(userOrders))
      if (userTrades.length > 0) dispatch(actionCreators.updateLendingTradesByAddress(userTrades))
    } catch (e) {
      console.log(e)
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

function handleLendingOrderRepayedTopUped(event: WebsocketEvent): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      const state = getState()
      const userAddress = getAccountDomain(state).address()
      const pairs = getTokenPairsDomain(state).getPairsArray()
      const trade = event.payload
      let userTrades = []
      userTrades = parseLendingTradesByAddress(userAddress, [trade], pairs)
      if (userTrades.length > 0) dispatch(actionCreators.updateLendingTradesByAddress(userTrades))
    } catch (e) {
      console.log(e)
      dispatch(appActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

const handleLendingPriceMessage = (
  dispatch: Dispatch,
  event: WebsocketEvent,
  getState: GetState
): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    const state = getState()
    const { lendingToken } = event.payload.lendingID
    const { decimals } = getTokenDomain(state).getTokenByAddress(lendingToken.toLowerCase())

    const dataParsed = parseLendingPriceBoard(event.payload, decimals)
    dispatch(actionCreators.updateLendingCurrentPairData(dataParsed))
  }
}

const handleLendingOHLCVMessage = (event: WebsocketEvent): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    if (event.type === 'ERROR' || !event.payload) return
    if (event.payload.length === 0) {
      if (window.lendingOnHistoryCallback) window.lendingOnHistoryCallback([], {noData: true})
      // dispatch(actionCreators.initOHLCV([]))
      // dispatch(actionCreators.updateOHLCVLoading(false))
      return
    }

    let ohlcv = event.payload
    if (!Array.isArray(ohlcv)) {
      // In case of INIT OHLCV, the payload is an array
      // But in case of UPDATE OHLCV, the payload is an object
      ohlcv = [ohlcv]
    }

    const state = getState()
    const { lendingToken } = ohlcv[0].lendingID
    const { decimals } = getTokenDomain(state).getTokenByAddress(lendingToken.toLowerCase())

    try {
      switch (event.type) {
        case 'INIT':
          ohlcv = parseLendingOHLCV(ohlcv, decimals)
          if (window.lendingOnHistoryCallback) {
            window.lendingOnHistoryCallback(ohlcv, {noData: false})
            window.lendingOhlcvLastBar = ohlcv.slice(-1)[0]
          }
          // dispatch(actionCreators.initOHLCV(ohlcv))
          // dispatch(actionCreators.updateOHLCVLoading(false))
          break
        case 'UPDATE':
          ohlcv = parseLendingOHLCV(ohlcv, decimals)
          if (window.lendinOnRealtimeCallback && (ohlcv[0].time >= window.lendingOhlcvLastBar.time)) {
            window.lendinOnRealtimeCallback(ohlcv[0])
            window.lendingOhlcvLastBar = ohlcv[0]
          }
          // dispatch(actionCreators.updateOHLCV(ohlcv))
          break
        default:
          return
      }
    } catch (e) {
      // We reject error when calling Mozilla APIs . Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Errors
      if (e.name !== 'NS_ERROR_NOT_INITIALIZED') {
        console.log(e)
        dispatch(appActionCreators.addErrorNotification({ message: e.message }))
      }
    }
  }
}