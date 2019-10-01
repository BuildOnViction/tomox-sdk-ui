//@flow
import aes from 'crypto-js/aes'
import CryptoJS from 'crypto-js'
import { DEFAULT_NETWORK_ID } from '../../config/environment'
import { createLocalWalletSigner } from '../services/signer'
import {
  getAccountDomain,
  getAccountBalancesDomain,
  getTokenDomain,
  getSettingsDomain,
  getTokenPairsDomain,
  getNotificationsDomain,
} from '../domains'

import { quoteTokens } from '../../config/quotes'
import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'

import * as actionCreators from '../actions/walletPage'
import * as notifierActionCreators from '../actions/app'
import * as settingsActionCreators from '../actions/settings'
import * as accountBalancesCreators from '../actions/accountBalances'
import * as notificationsCreators from '../actions/notifications'
import * as layoutCreators from '../actions/layout'
import * as accountBalancesService from '../services/accountBalances'

import type { State, ThunkAction } from '../../types'
import type { Token } from '../../types/tokens'
import { getSigner } from '../services/signer'

export default function createSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const settingsDomain = getSettingsDomain(state)
  const tokenPairs = getTokenPairsDomain(state)
  const newNotifications = getNotificationsDomain(state).getNewNotifications()

  const TomoBalance = accountBalancesDomain.tomoBalance()
  const authenticated = accountDomain.authenticated()
  const address = accountDomain.address()
  const currentBlock = accountDomain.currentBlock()
  const accountLoading = !TomoBalance
  const referenceCurrency = accountDomain.referenceCurrency()
  const showSessionPasswordModal = accountDomain.showSessionPasswordModal()
  const locale = settingsDomain.getLocale()
  const mode = settingsDomain.getMode()
  const currentPair = tokenPairs.getCurrentPair()
  const currentPairData = tokenPairs.getCurrentPairData()
  const { router: { location: { pathname }}} = state

  return {
    TomoBalance,
    authenticated,
    address,
    accountLoading,
    currentBlock,
    locale,
    mode,
    currentPair,
    currentPairData,
    pathname,
    referenceCurrency,
    newNotifications,
    showSessionPasswordModal,
  }
}

export function queryAppData(): ThunkAction {
  return async (dispatch, getState, { api }) => {
    const state = getState()
    const { router: { location: { pathname }}} = state
    const pairParam = pathname.match(/.*trade\/?(.*)$/)
    let currentPair = pairParam ? pairParam[1].replace('-', '/') : ''

    try {
      const addresses = JSON.parse(sessionStorage.getItem('addresses'))
      if (!addresses) throw new Error('Cannot get tokens or pairs')

      let tokens = getTokenDomain(state).tokens() // eslint-disable-line
      const quotes = quoteTokens

      tokens = quotes
        .concat(tokens)
        .filter((token: Token) => token.symbol !== NATIVE_TOKEN_SYMBOL)


      const pairs = await api.fetchPairs()
      const tokenPairData = await api.fetchTokenPairData()
      const exchangeAddress = await api.getExchangeAddress()
      
      const availablePairs = tokenPairData.map(pairData => pairData.pair.pairName)
      currentPair = availablePairs.includes(currentPair) ? currentPair : availablePairs[0]

      dispatch(actionCreators.updateCurrentPair(currentPair))
      dispatch(actionCreators.updateTokenPairs(pairs))
      dispatch(actionCreators.updateExchangeAddress(exchangeAddress))
    } catch (e) {
      const message = e.message ? e.message : "Could not connect to Tomochain network"

      dispatch(
        notifierActionCreators.addErrorNotification({
          message,
        })
      )
      console.log(e)
    }
  }
}

export function queryAccountData(): ThunkAction {
  return async (dispatch, getState, { api, socket }) => {
    const state = getState()
    const accountAddress = getAccountDomain(state).address()
    const privatekey = getAccountDomain(state).privateKey()
    const notificationsDomain = getNotificationsDomain(state)
    const offset = notificationsDomain.getOffset()
    const limit = notificationsDomain.getLimit()
    const signer = getSigner()

    try {
      const addresses = JSON.parse(sessionStorage.getItem('addresses'))
      if (!addresses) return

      if (!signer && privatekey) return dispatch(dispatch(layoutCreators.showSessionPasswordModal(true)))

      socket.subscribeNotification(accountAddress)

      let tokens = getTokenDomain(state).tokens()
      const quotes = quoteTokens

      tokens = quotes
        .concat(tokens)
        .filter((token: Token) => token.symbol !== NATIVE_TOKEN_SYMBOL)
        .reduce((newTokens, currentToken) => { // remove duplicate tokens
          const x = newTokens.find(item => item.symbol === currentToken.symbol)

          if (!x) {
            return [...newTokens, currentToken]
          }

          return newTokens
        }, [])

      if (!accountAddress) throw new Error('Account address is not set')

      const notifications = await api.fetchNotifications({ address: accountAddress, offset, limit })
      dispatch(notificationsCreators.addNotifications(notifications))

      const tomoBalance: TokenBalance = await accountBalancesService.queryTomoBalance(
        accountAddress
      )
      
      const tokenBalances: TokenBalances = await accountBalancesService.queryTokenBalances(
        accountAddress,
        tokens
      )

      const balancesInOders = await api.getBalancesInOrders(accountAddress, tokens)
      const balances = [tomoBalance].concat(tokenBalances)

      for (let i = 0; i < balances.length; i++) {
        balances[i]['inOrders'] = balancesInOders[balances[i].symbol]
      }

      dispatch(accountBalancesCreators.updateBalances(balances))

      await accountBalancesService.subscribeTokenBalances(
        accountAddress,
        tokens,
        balance => dispatch(accountBalancesCreators.updateBalance(balance.symbol, balance.balance))
      )

      await accountBalancesService.subscribeTomoBalance(
        accountAddress,
        balance => dispatch(accountBalancesCreators.updateBalance(NATIVE_TOKEN_SYMBOL, balance))
      )
    } catch (e) {
      dispatch(
        notifierActionCreators.addErrorNotification({
          message: 'Could not connect to Tomochain network',
        })
      )
      console.log(e)
    }
  }
}

export function createProvider(): ThunkAction {
  return async (dispatch, getState, { provider }) => {
    provider.createConnection()
  }
}

export function changeLocale(locale: string): ThunkAction {
  return async (dispatch, getstate) => {
    dispatch(settingsActionCreators.changeLocale(locale))
  }
}

export function changeMode(mode: string): ThunkAction {
  return async (dispatch, getstate) => {
    dispatch(settingsActionCreators.changeMode(mode))
  }
}

export function closeSessionPasswordModal(status: Boolean): ThunkAction {
  return async (dispatch, getstate) => {
    dispatch(layoutCreators.showSessionPasswordModal(false))
  }
}

export function unlockWalletWithSessionPassword(password): ThunkAction {
  return async (dispatch, getstate) => {
    const state = getstate()
    const privateKeyEncrypted = getAccountDomain(state).privateKey()

    try {
      const bytes = aes.decrypt(privateKeyEncrypted, password)
      const privateKey = bytes.toString(CryptoJS.enc.Utf8)

      if (!privateKey) return {error: 'Wrong password!'}

      await createLocalWalletSigner({
          privateKey,
        },
        +DEFAULT_NETWORK_ID
      )   

      dispatch(layoutCreators.showSessionPasswordModal(false))
      return {error: null}
    } catch(e) {
      return {error: e}
    }
  }
}

export function releaseResource(): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    const state = getState()
    const authenticated = getAccountDomain(state).authenticated()
    if (authenticated) socket.unSubscribeNotification()
  }
}
