import accountDomain from './account'
import accountBalancesDomain from './accountBalances'
import depositFormDomain from './depositForm'
import getStartedModalDomain from './getStartedModal'
import tomoBalanceDomain from './tomoBalance'
import transferTokensFormDomain from './transferTokensForm'
import loginPageDomain from './loginPage'
import ohlcvDomain from './ohlcv'
import websocketDomain from './websocket'
import orderBookDomain from './orderBook'
import orderFormDomain from './orderForm'
import settingsDomain from './settings'
import signerDomain from './signer'
import tokenPairsDomain from './tokenPairs'
import tokenDomain from './tokens'
import walletsDomain from './wallets'
import notificationsDomain from './notifications'
import tradesDomain from './trades'
import ordersDomain from './orders'
import depositDomain from './deposit'
import connectionDomain from './connection'
import lendingOrderBookDomain from './lending/lendingOrderBook'
import lendingTradesDomain from './lending/lendingTrades'
import lendingPairsDomain from './lending/lendingPairs'

export const getAccountDomain = state => accountDomain(state.account)
export const getAccountBalancesDomain = state =>
  accountBalancesDomain(state.accountBalances)
export const getDepositFormDomain = state =>
  depositFormDomain(state.depositForm)
export const getGetStartedModalDomain = state =>
  getStartedModalDomain(state.getStartedModal)
export const getTomoBalanceDomain = state =>
  tomoBalanceDomain(state.tomoBalance)
export const getTransferTokensFormDomain = state =>
  transferTokensFormDomain(state.transferTokensForm)
export const getLoginPageDomain = state => loginPageDomain(state.loginPage)
export const getOhlcvDomain = state => ohlcvDomain(state.ohlcv)
export const getWebsocketDomain = state => websocketDomain(state.websocket)
export const getOrderBookDomain = state => orderBookDomain(state.orderBook)
export const getOrderFormDomain = state => orderFormDomain(state.orderForm)
export const getOrdersDomain = state => ordersDomain(state.orders)
export const getDepositDomain = state => depositDomain(state.deposit)
export const getTradesDomain = state => tradesDomain(state.trades)
export const getSettingsDomain = state => settingsDomain(state.settings)
export const getSignerDomain = state => signerDomain(state.signer)
export const getTokenPairsDomain = state => tokenPairsDomain(state.tokenPairs)
export const getTokenDomain = state => tokenDomain(state.tokens)
export const getWalletsDomain = state => walletsDomain(state.wallets)
export const getNotificationsDomain = state =>
  notificationsDomain(state.notifications)
export const getConnectionDomain = state => connectionDomain(state.connection)
export const getLendingOrderBookDomain = state => lendingOrderBookDomain(state.lendingOrderBook)
export const getLendingTradesDomain = state => lendingTradesDomain(state.lendingTrades)
export const getLendingPairsDomain = state => lendingPairsDomain(state.lendingPairs)
