//@flow
import aes from 'crypto-js/aes'
import CryptoJS from 'crypto-js'
import { push } from 'connected-react-router'

import { DEFAULT_NETWORK_ID } from '../../config/environment'
import { createLocalWalletSigner } from '../services/signer'
import { quoteTokens } from '../../config/quotes'
import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'
import { convertTermsToObjects } from '../../utils/helpers'

import {
  getAccountDomain,
  getAccountBalancesDomain,
  getTokenDomain,
  getSettingsDomain,
  getTokenPairsDomain,
  getNotificationsDomain,
  getLendingPairsDomain,
} from '../domains'

import * as actionCreators from '../actions/walletPage'
import * as notifierActionCreators from '../actions/app'
import * as settingsActionCreators from '../actions/settings'
import * as accountBalancesCreators from '../actions/accountBalances'
import * as layoutCreators from '../actions/layout'
import * as lendingTokensCreators from '../actions/lending/lendingTokens'

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
  const typeUnlock = accountDomain.type()
  const locale = settingsDomain.getLocale()
  const mode = settingsDomain.getMode()
  const currentPair = tokenPairs.getCurrentPair()
  const currentPairData = tokenPairs.getCurrentPairData()
  const { router: { location: { pathname }}} = state

  const lendingPairsDomain = getLendingPairsDomain(state)
  const lendingCurrentPair = lendingPairsDomain.getCurrentPair()
  const lendingCurrentPairData = lendingPairsDomain.getCurrentPairData()

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
    lendingCurrentPair,
    lendingCurrentPairData,
    typeUnlock,
  }
}

export function queryAppData(): ThunkAction {
  return async (dispatch, getState, { socket, api }) => {
    const state = getState()
    const { pair } = getTokenPairsDomain(state).getCurrentPair() || {}
    const { router: { location: { pathname }}} = state
    const pairParam = pathname.match(/.*\/(trade|dapp)\/?(.*)$/i)
    let currentPairName = (pairParam && pairParam[2]) ? pairParam[2].replace('-', '/').toUpperCase() : pair ? pair.pair : ''

    try {
      const addresses = JSON.parse(sessionStorage.getItem('addresses'))
      if (!addresses) throw new Error('Cannot get tokens or pairs')

      socket.subscribeMarkets()
      socket.subscribeLendingMarkets()
      dispatch(layoutCreators.updateLoadingTokenPair(true))

      let tokens = getTokenDomain(state).tokens() // eslint-disable-line
      const quotes = quoteTokens

      tokens = quotes
        .concat(tokens)
        .filter((token: Token) => token.symbol !== NATIVE_TOKEN_SYMBOL)

      const pairs = await api.fetchPairs()
      dispatch(layoutCreators.updateTokenPairs(pairs))

      const {exchangeAddress, fee} = await api.fetchInfo()
      dispatch(layoutCreators.updateExchangeAddress(exchangeAddress))
      dispatch(layoutCreators.updateExchangeFee(fee))

      const tokensPairs = addresses.pairs
      if (tokensPairs[currentPairName]) dispatch(actionCreators.updateCurrentPair(tokensPairs[currentPairName]))
      
      const lendingPairs = await api.fetchLendingPairs()
      dispatch(layoutCreators.updateLendingPairs(lendingPairs))

      const lendingTokens = await api.fetchLendingTokens()
      dispatch(lendingTokensCreators.updateLendingTokens(lendingTokens))

      const lendingCollaterals = await api.fetchLendingCollaterals()
      dispatch(lendingTokensCreators.updateLendingCollaterals(lendingCollaterals))

      let lendingTerms = await api.fetchLendingTerms()
      lendingTerms = convertTermsToObjects(lendingTerms)
      dispatch(lendingTokensCreators.updateLendingTerms(lendingTerms))
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
    const privateKeyEncrypted = getAccountDomain(state).privateKey()	
    const time = getAccountDomain(state).time()
    const signer = getSigner()

    try {
      const addresses = JSON.parse(sessionStorage.getItem('addresses'))
      if (!addresses) return

      if (!signer && !privateKeyEncrypted) return dispatch(push('/logout'))
      if (!signer && privateKeyEncrypted) {
        if (window.getBalancesInterval) clearInterval(window.getBalancesInterval)	
        const bytes = aes.decrypt(privateKeyEncrypted, time)
        const privateKey = bytes.toString(CryptoJS.enc.Utf8)

        await createLocalWalletSigner({
            privateKey,
          },
          +DEFAULT_NETWORK_ID
        )
      }

      let tokens = getTokenDomain(state).tokens() //eslint-disable-line
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
      
      socket.subscribeLendingOrders(accountAddress)
      const { tokenBalances } = await api.fetchAccountInfo(accountAddress)
      dispatch(accountBalancesCreators.updateBalances(tokenBalances))
      window.getBalancesInterval = setInterval(async _ => {
        const { tokenBalances } = await api.fetchAccountInfo(accountAddress)
        dispatch(accountBalancesCreators.updateBalances(tokenBalances))
      }, 2000)
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

export function releaseResource(): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    socket.unSubscribeMarkets()
    socket.unSubscribeLendingMarkets()
    socket.unSubscribeLendingOrders()
    if (window.getBalancesInterval) clearInterval(window.getBalancesInterval)
  }
}
