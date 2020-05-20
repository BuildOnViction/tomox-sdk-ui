// @flow
import { DEX_VERSION } from '../config/environment'
import storage from 'redux-persist/lib/storage'

import createReducer, { createReducerPersist } from './createReducer'
import accountBalancesActionTypes from './actions/accountBalances'
import transferTokensFormActionTypes from './actions/transferTokensForm'
import ohlcvActionTypes from './actions/ohlcv'
import tokenSearcherActionTypes from './actions/tokenSearcher'
import tokensActionTypes from './actions/tokens'
import accountActionTypes from './actions/account'
import depositActionTypes from './actions/deposit'
import depositFormActionTypes from './actions/depositForm'
import getStartedModalActionTypes from './actions/getStartedModal'
import settingsActionTypes from './actions/settings'
import createWalletActionTypes from './actions/createWallet'
import walletPageActionTypes from './actions/walletPage'
import tradingPageActionTypes from './actions/tradingPage'
import socketControllerActionTypes from './actions/socketController'
import loginPageActionTypes from './actions/loginPage'
import logoutPageActionTypes from './actions/logoutPage'
import signerSettingsActionTypes from './actions/signerSettings'
import appActionTypes from './actions/app'
import notificationsTypes from './actions/notifications'
import layoutActionTypes from './actions/layout'
import marketsTableActionTypes from './actions/marketsTable'
import orderBookActionTypes from './actions/orderBook'
import tokenPairsActionsTypes from './actions/tokenPairs'
import orderActionsTypes from './actions/orders'
import lendingTokensActionTypes from './actions/lending/lendingTokens'
import lendingOrdersActionTypes from './actions/lending/lendingOrders'
import lendingTradesActionTypes from './actions/lending/lendingTrades'
import lendingMarketsActionTypes from './actions/lending/lendingMarkets'
import lendingTradePageActionTypes from './actions/lending/lendingTradePage'
import lendingTokenSearcherActionTypes from './actions/lending/lendingTokenSearcher'
import lendingOrderBookActionTypes from './actions/lending/lendingOrderBook'

import * as accountBalancesEvents from './domains/accountBalances'
import * as transferTokensFormEvents from './domains/transferTokensForm'
import * as loginPageEvents from './domains/loginPage'
import * as orderBookEvents from './domains/orderBook'
import * as tradeEvents from './domains/trades'
import * as orderEvents from './domains/orders'
import * as ohlcvEvents from './domains/ohlcv'
import * as websocketEvents from './domains/websocket'
import * as tokensEvents from './domains/tokens'
import * as accountEvents from './domains/account'
import * as depositEvents from './domains/deposit'
import * as depositFormEvents from './domains/depositForm'
import * as getStartedModalEvents from './domains/getStartedModal'
import * as settingsEvents from './domains/settings'
import * as tokenPairsEvents from './domains/tokenPairs'
import * as signerEvents from './domains/signer'
import * as walletsEvents from './domains/wallets'
import * as notificationEvents from './domains/notifications'
import * as connectionEvents from './domains/connection'
import * as lendingOrderBookEvents from './domains/lending/lendingOrderBook'
import * as lendingTradeEvents from './domains/lending/lendingTrades'
import * as lendingPairsEvents from './domains/lending/lendingPairs'
import * as lendingTokensEvents from './domains/lending/lendingTokens'
import * as lendingOrdersEvents from './domains/lending/lendingOrders'
import * as lendingOhlcvEvents from './domains/lending/lendingOhlcv'

export const loginPage = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case loginPageActionTypes.requestLogin:
      return loginPageEvents.loginRequested()
    case loginPageActionTypes.loginError:
      return loginPageEvents.loginFailed(payload.error)
    case loginPageActionTypes.loginWithMetamask:
      return loginPageEvents.authenticated()
    case loginPageActionTypes.loginWithWallet:
      return loginPageEvents.authenticated()
    case loginPageActionTypes.loginWithTrezorWallet:
      return loginPageEvents.authenticated()
    case loginPageActionTypes.loginWithLedgerWallet:
      return loginPageEvents.authenticated()
    case loginPageActionTypes.getPublicKey:
      return loginPageEvents.getPublicKey(payload)
    case loginPageActionTypes.toggleSelectAddressModal:
      return loginPageEvents.toggleSelectAddressModal(payload)
    default:
      return loginPageEvents.initialized()
  }
})

export const accountBalances = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case accountBalancesActionTypes.subscribeBalance:
      return accountBalancesEvents.subscribed(payload.symbol)
    case accountBalancesActionTypes.unsubscribeBalance:
      return accountBalancesEvents.unsubscribed(payload.symbol)
    case accountBalancesActionTypes.updateBalance:
    case depositFormActionTypes.updateBalance:
      return accountBalancesEvents.updated([
        {
          symbol: payload.symbol,
          balance: payload.balance,
        },
      ])
    case accountBalancesActionTypes.updateBalances:
    case depositFormActionTypes.updateBalances:
      return accountBalancesEvents.updated(payload.balances)
    case logoutPageActionTypes.resetBalances:
      return accountBalancesEvents.reset()
    case depositFormActionTypes.subscribeBalance:
      return accountBalancesEvents.subscribed(payload.symbol)
    case depositFormActionTypes.unsubscribeBalance:
      return accountBalancesEvents.unsubscribed(payload.symbol)
    default:
      return accountBalancesEvents.initialized()
  }
})

export const signer = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case signerSettingsActionTypes.requestSigner:
      return signerEvents.signerRequested()
    case signerSettingsActionTypes.updateSigner:
      return signerEvents.signerUpdated(payload.params)
    case signerSettingsActionTypes.error:
      return signerEvents.signerError(payload.message)
    default:
      return signerEvents.initialized()
  }
})

export const transferTokensForm = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case transferTokensFormActionTypes.txError:
      return transferTokensFormEvents.txError(
        payload.status,
        payload.statusMessage
      )
    case transferTokensFormActionTypes.validateTx:
      return transferTokensFormEvents.txValidated(
        payload.statusMessage,
        payload.estimatedGas
      )
    case transferTokensFormActionTypes.invalidateTx:
      return transferTokensFormEvents.txInvalidated(payload.statusMessage)
    case transferTokensFormActionTypes.revertTx:
      return transferTokensFormEvents.txReverted(
        payload.statusMessage,
        payload.receipt
      )
    case transferTokensFormActionTypes.sendTx:
      return transferTokensFormEvents.txSent(payload.hash)
    case transferTokensFormActionTypes.confirmTx:
      return transferTokensFormEvents.txConfirmed(payload.receipt)
    case transferTokensFormActionTypes.resetForm:
      return transferTokensFormEvents.resetForm()
    default:
      return transferTokensFormEvents.initialized()
  }
})

export const websocket = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case socketControllerActionTypes.openConnection:
      return websocketEvents.savedWebsocketStatus('open', payload)
    default:
      return websocketEvents.initialized()
  }
})

export const ohlcv = createReducerPersist({
    key: 'ohlcv',
    keyPrefix: `${DEX_VERSION}:tomo:`,
    storage,
    whitelist: ['currentTimeSpan', 'currentDuration'],
  },
  action => {
  const { type, payload } = action
  switch (type) {
    case socketControllerActionTypes.initOHLCV:
    case ohlcvActionTypes.saveData:
      return ohlcvEvents.savedOHLCVData(payload.data)
    case socketControllerActionTypes.updateOHLCV:
      return ohlcvEvents.updateOHLCVData(payload.data)
    case ohlcvActionTypes.saveDuration:
      return ohlcvEvents.savedDuration(payload.data)
    case ohlcvActionTypes.saveTimeSpan:
      return ohlcvEvents.savedTimeSpan(payload.data)
    case ohlcvActionTypes.saveNoOfCandles:
      return ohlcvEvents.savedNoOfCandles(payload)
    case ohlcvActionTypes.resetOHLCVData:
    case tokenSearcherActionTypes.updateCurrentPair:
    case tradingPageActionTypes.updateCurrentPair:
    case marketsTableActionTypes.updateCurrentPair:
      return ohlcvEvents.ohlcvReset()
    case tradingPageActionTypes.updateOHLCVLoading:
    case ohlcvActionTypes.updateOHLCVLoading:
    case socketControllerActionTypes.updateOHLCVLoading:
      return ohlcvEvents.updateOHLCVLoading(payload.loading)
    default:
      return ohlcvEvents.initialized()
  }
})

export const trades = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case socketControllerActionTypes.updateTradesTable:
    case tradingPageActionTypes.updateTradesTable:
    case tokenSearcherActionTypes.updateTradesTable:
      return tradeEvents.tradesUpdated(payload.trades)
    case socketControllerActionTypes.initTradesTable:
    case tradingPageActionTypes.initTradesTable:
    case tokenSearcherActionTypes.initTradesTable:
      return tradeEvents.tradesInitialized(payload.trades)
    case tradingPageActionTypes.updateCurrentPair:
    case tokenSearcherActionTypes.updateCurrentPair:
    case marketsTableActionTypes.updateCurrentPair:
      return tradeEvents.tradesReset()
    case tradingPageActionTypes.updateTradesByAddress:
    case socketControllerActionTypes.updateTradesByAddress:
      return tradeEvents.tradesByAddressUpdated(payload.trades)
    case logoutPageActionTypes.resetTradesByAddress:
      return tradeEvents.resetTradesByAddress()
    default:
      return tradeEvents.initialized()
  }
})

export const orderBook = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case orderBookActionTypes.select:
      return orderBookEvents.selected(payload.order)
    case tradingPageActionTypes.updateOrderBook:
    case tokenSearcherActionTypes.updateOrderBook:
    case socketControllerActionTypes.updateOrderBook:
      return orderBookEvents.orderBookUpdated(payload.bids, payload.asks)
    case tradingPageActionTypes.initOrderBook:
    case tokenSearcherActionTypes.initOrderBook:
    case socketControllerActionTypes.initOrderBook:
      return orderBookEvents.orderBookInitialized(payload.bids, payload.asks)
    case tradingPageActionTypes.updateCurrentPair:
    case tokenSearcherActionTypes.updateCurrentPair:
    case marketsTableActionTypes.updateCurrentPair:
      return orderBookEvents.orderBookReset()
    default:
      return orderBookEvents.initialized()
  }
})

export const orders = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case tradingPageActionTypes.updateOrdersTable:
    case socketControllerActionTypes.updateOrdersTable:
      return orderEvents.ordersUpdated(payload.orders)
    case tradingPageActionTypes.initOrdersTable:
    case tokenSearcherActionTypes.initOrdersTable:
      return orderEvents.ordersInitialized(payload.orders)
    case orderActionsTypes.ordersUpdatedStatus:
      return orderEvents.ordersUpdatedStatus(payload.status)
    case logoutPageActionTypes.ordersReset:
      return orderEvents.ordersReset()
    default:
      return orderEvents.initialized()
  }
})

export const tokens = createReducer(action => {
  const { type } = action
  switch (type) {
    default:
      return tokensEvents.initialized()
  }
})

export const tokenPairs = createReducerPersist({
  key: 'tokenPairs',
  keyPrefix: `${DEX_VERSION}:tomo:`,
  storage,
  whitelist: ['favorites', 'currentPair'],
}, action => {
  const { type, payload } = action
  switch (type) {
    case tradingPageActionTypes.updateCurrentPair:
      return tokenPairsEvents.currentPairUpdated(payload.pair)
    case walletPageActionTypes.updateCurrentPair:
      return tokenPairsEvents.currentPairUpdated(payload.pair)
    case layoutActionTypes.updateTokenPairs:
      return tokenPairsEvents.tokenPairsUpdated(payload.pairs)
    case tokensActionTypes.updateTokens:
      return tokenPairsEvents.tokenPairsUpdated(payload)
    case tokensActionTypes.removeTokens:
      return tokenPairsEvents.tokenPairRemoved(payload)
    case tokenSearcherActionTypes.updateFavorite:
    case marketsTableActionTypes.updateFavorite:
      return tokenPairsEvents.tokenPairFavorited(
        payload.code,
        payload.favorite
      )
    case tokenSearcherActionTypes.updateCurrentPair:
      return tokenPairsEvents.currentPairUpdated(payload.pair)
    case socketControllerActionTypes.updateTokenPairData:
      return tokenPairsEvents.tokenPairDataUpdated(payload.tokenPairData)
    case socketControllerActionTypes.updateSmallChartsData:
      return tokenPairsEvents.updateSmallChartsData(payload.smallChartsData)
    case marketsTableActionTypes.updateCurrentPair:
      return tokenPairsEvents.currentPairUpdated(payload.pair)
    case tokenPairsActionsTypes.updateCurrentPairData:
      return tokenPairsEvents.updateCurrentPairData(payload)
    case socketControllerActionTypes.updateLoadingTokenPair:
    case layoutActionTypes.updateLoadingTokenPair:
      return tokenPairsEvents.updateLoading(payload.loading)
    default:
      return tokenPairsEvents.initialized()
  }
})

export const account = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case accountActionTypes.updateAccount:
      return accountEvents.accountUpdated(payload.address, '')
    case signerSettingsActionTypes.updateSigner:
      return accountEvents.accountUpdated(payload.address, '')
    case loginPageActionTypes.loginWithMetamask:
      return accountEvents.accountUpdated(payload.address, '')
    case loginPageActionTypes.loginWithWallet:
      return accountEvents.accountUpdated(payload.address, payload.privateKey)
    case loginPageActionTypes.loginWithTrezorWallet:
      return accountEvents.accountUpdated(payload.address, '')
    case loginPageActionTypes.loginWithLedgerWallet:
      return accountEvents.accountUpdated(payload.address, '')
    case walletPageActionTypes.updateShowHelpModal:
      return accountEvents.showHelpModalUpdated(payload.showHelpModal)
    case layoutActionTypes.updateExchangeAddress:
      return accountEvents.exchangeAddressUpdated(payload.exchangeAddress)
    case layoutActionTypes.updateExchangeFee:
      return accountEvents.exchangeFeeUpdated(payload.exchangeFee)
    case layoutActionTypes.updateReferenceCurrency:
      return accountEvents.referenceCurrencyUpdated(payload.referenceCurrency)
    case layoutActionTypes.showSessionPasswordModal:
      return accountEvents.showSessionPasswordModalUpdated(payload.showSessionPasswordModal)
    case logoutPageActionTypes.logout:
      return accountEvents.accountRemoved()
    case accountActionTypes.updateCurrentBlock:
      return accountEvents.currentBlockUpdated(payload.currentBlock)
    default:
      return accountEvents.initialized()
  }
})

export const deposit = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case depositActionTypes.updateAddressAssociation:
      return depositEvents.addressAssociationUpdated(
        payload.chain,
        payload.addressAssociation
      )
    case depositActionTypes.updateAssociationTransactions:
      return depositEvents.associationTransactionsUpdated(
        payload.chain,
        payload.txEnvelopes
      )
    default:
      return depositEvents.initialized()
  }
})

export const depositForm = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case depositFormActionTypes.deposit:
      return depositFormEvents.deposited()
    case depositFormActionTypes.confirm:
      return depositFormEvents.confirmed()
    case depositFormActionTypes.sendConvertTx:
      return depositFormEvents.convertTxSent(payload.hash)
    case depositFormActionTypes.revertConvertTx:
      return depositFormEvents.convertTxReverted(payload.receipt)
    case depositFormActionTypes.confirmConvertTx:
      return depositFormEvents.convertTxConfirmed(payload.receipt)
    case depositFormActionTypes.sendAllowTx:
      return depositFormEvents.allowTxSent(payload.hash)
    case depositFormActionTypes.revertAllowTx:
      return depositFormEvents.allowTxReverted(payload.receipt)
    case depositFormActionTypes.confirmAllowTx:
      return depositFormEvents.allowTxConfirmed(payload.receipt)
    default:
      return depositFormEvents.initialized()
  }
})

export const getStartedModal = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case getStartedModalActionTypes.sendConvertTx:
      return getStartedModalEvents.convertTxSent(payload.hash)
    case getStartedModalActionTypes.revertConvertTx:
      return getStartedModalEvents.convertTxReverted(payload.receipt)
    case getStartedModalActionTypes.confirmConvertTx:
      return getStartedModalEvents.convertTxConfirmed(payload.receipt)
    case getStartedModalActionTypes.sendApproveTx:
      return getStartedModalEvents.approveTxSent(payload.hash)
    case getStartedModalActionTypes.revertApproveTx:
      return getStartedModalEvents.approveTxReverted(payload.receipt)
    case getStartedModalActionTypes.confirmApproveTx:
      return getStartedModalEvents.approveTxConfirmed(payload.receipt)
    default:
      return getStartedModalEvents.initialized()
  }
})

export const settings = createReducerPersist({
  key: 'settings',
  keyPrefix: 'tomo:',
  storage,
  whitelist: ['locale', 'mode', 'version'],
}, action => {
  const { type, payload } = action
  switch (type) {
    case settingsActionTypes.togglePvtKeyLock:
      return settingsEvents.pvtKeyLockToggled()
    case settingsActionTypes.setDefaultGasLimit:
      return settingsEvents.defaultGasLimitSet()
    case settingsActionTypes.setDefaultGasPrice:
      return settingsEvents.defaultGasPriceSet()
    case settingsActionTypes.changeLocale:
      return settingsEvents.changeLocale(payload)
    case settingsActionTypes.changeMode:
      return settingsEvents.changeMode(payload)
    default:
      return settingsEvents.initialized()
  }
})

export const wallets = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case createWalletActionTypes.createWallet:
      return walletsEvents.walletAdded(
        payload.address,
        payload.encryptedWallet
      )
    case createWalletActionTypes.addWallet:
      return walletsEvents.walletAdded(
        payload.address,
        payload.encryptedWallet
      )
    case createWalletActionTypes.removeWallet:
      return walletsEvents.walletRemoved(payload)
    case loginPageActionTypes.createWallet:
      return walletsEvents.walletAdded(
        payload.address,
        payload.encryptedWallet
      )
    default:
      return walletsEvents.initialized()
  }
})

export const notifications = createReducer(action => {
  const { type, payload } = action
  switch (type) {    
    case appActionTypes.addNotification:
    case appActionTypes.addSuccessNotification:
    case appActionTypes.addErrorNotification:
    case appActionTypes.copyDataSuccessNotification:    
      return notificationEvents.updateToaster(payload)
    case appActionTypes.removeNotification:
      return notificationEvents.removeToaster()
    case notificationsTypes.updateNotificationsLoading: 
      return notificationEvents.updateNotificationsLoading(payload.status)
    case notificationsTypes.addNotifications: 
      return notificationEvents.addNotifications(payload.data)
    case socketControllerActionTypes.updateNewNotifications:
      return notificationEvents.updateNewNotifications()
    case notificationsTypes.resetNotifications:
    case logoutPageActionTypes.resetNotifications:
      return notificationEvents.resetNotifications()
    case notificationsTypes.resetNewNotifications:
        return notificationEvents.resetNewNotifications()
    case notificationsTypes.markNotificationRead:
        return notificationEvents.updateNotifications(payload.data)
    default:
      return notificationEvents.initialized()
  }
})

export const connection = createReducer(({ type }) => {
  switch (type) {
    case socketControllerActionTypes.createConnection:
      return connectionEvents.initiated()
    case socketControllerActionTypes.closeConnection:
    case socketControllerActionTypes.connectionError:
      return connectionEvents.closed()
    case socketControllerActionTypes.openConnection:
      return connectionEvents.opened()
    default:
      return connectionEvents.initialized()
  }
})

export const lendingOrderBook = createReducer(({ type, payload }) => {
 
  switch (type) {
    case socketControllerActionTypes.initLendingOrderBook:
      return lendingOrderBookEvents.orderBookInitialized(payload.bids, payload.asks)
    case socketControllerActionTypes.updateLendingOrderBook:
      return lendingOrderBookEvents.orderBookUpdated(payload.bids, payload.asks)
    case lendingOrderBookActionTypes.selectOrder:
      return lendingOrderBookEvents.selectedOrder(payload)
    case lendingTokenSearcherActionTypes.resetOrderbook:
      return lendingOrderBookEvents.orderBookReset()
    default:
      return lendingOrderBookEvents.initialized()
  }
})

export const lendingTrades = createReducer(action => {
  const { type, payload } = action
  switch (type) {
    case socketControllerActionTypes.initLendingTradesTable:
      return lendingTradeEvents.tradesInitialized(payload.trades)
    case socketControllerActionTypes.updateLendingTradesTable:
      return lendingTradeEvents.tradesUpdated(payload.trades)
    case socketControllerActionTypes.updateLendingTradesByAddress:
    case lendingTradesActionTypes.updateTradesByAddress:
      return lendingTradeEvents.tradesByAddressUpdated(payload)
    case logoutPageActionTypes.resetTradesByAddress:
      return lendingTradeEvents.resetTradesByAddress()
    case lendingTokenSearcherActionTypes.resetTradesHistory:
    case lendingMarketsActionTypes.updateCurrentPair:
      return lendingTradeEvents.tradesReset()
    default:
      return lendingTradeEvents.initialized()
  }
})

export const lendingPairs = createReducerPersist({
  key: 'lendingPairs',
  keyPrefix: `${DEX_VERSION}:tomo:lending:`,
  storage,
  whitelist: ['favorites', 'currentLendingPair'],
}, action => {
  const { type, payload } = action
  switch (type) {
    case layoutActionTypes.updateLendingPairs:
      return lendingPairsEvents.updatePairs(payload)
    case lendingTokenSearcherActionTypes.updateCurrentPair:
    case lendingMarketsActionTypes.updateCurrentPair:
    case lendingTradePageActionTypes.updateCurrentPair:
      return lendingPairsEvents.updateCurrentPair(payload)
    case socketControllerActionTypes.updateLendingCurrentPairData:
      return lendingPairsEvents.updateCurrentPairData(payload)
    case lendingTokenSearcherActionTypes.updateFavorite:
    case lendingMarketsActionTypes.updateFavorite:
      return lendingPairsEvents.tokenPairFavorited(
        payload.code,
        payload.favorite
      )
    case socketControllerActionTypes.updateLendingPairsData:
      return lendingPairsEvents.lendingPairsDataUpdated(payload.lendingPairsData)
    default:
      return lendingPairsEvents.initialized()
  }
})

export const lendingTokens = createReducer(action => {
  const { type, payload } = action

  switch (type) {
    case lendingTokensActionTypes.updateLendingTokens:
      return lendingTokensEvents.updateLendingTokens(payload)
    case lendingTokensActionTypes.updateLendingCollaterals:
      return lendingTokensEvents.updateLendingCollaterals(payload)
    case lendingTokensActionTypes.updateLendingTerms:
      return lendingTokensEvents.updateLendingTerms(payload)
    default:
      return lendingTokensEvents.initialized()
  }
})

export const lendingOrders = createReducer(action => {
  const { type, payload } = action

  switch (type) {
    case lendingOrdersActionTypes.lendingOrdersUpdateLoading:
      return lendingOrdersEvents.lendingOrdersUpdateLoading(payload)
    case lendingOrdersActionTypes.ordersInitialized:
      return lendingOrdersEvents.ordersInitialized(payload)
    case socketControllerActionTypes.updateLendingOrders:
      return lendingOrdersEvents.updateOrders(payload)
    case logoutPageActionTypes.ordersReset:
      return lendingOrdersEvents.ordersReset()
    default:
      return lendingOrdersEvents.initialized()
  }
})

export const lendingOhlcv = createReducerPersist({
  key: 'ohlcv',
  keyPrefix: `${DEX_VERSION}:tomo:lending:`,
  storage,
  whitelist: ['currentTimeSpan', 'currentDuration'],
},
action => {
  const { type, payload } = action
  switch (type) {
    case lendingTokenSearcherActionTypes.updateOhlcvLoading:
    case lendingTradePageActionTypes.updateOHLCVLoading:
      return lendingOhlcvEvents.loading(payload)
    default:
      return lendingOhlcvEvents.initialized()
  }
})
