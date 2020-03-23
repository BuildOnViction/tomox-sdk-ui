// @flow
import BigNumber from 'bignumber.js'

import * as appActionCreators from '../../actions/app'
import { getLendingOrdersDomain, getLendingTradesDomain, getAccountDomain, getTokenPairsDomain } from '../../domains'
import type { State, ThunkAction } from '../../types'

import { 
  getTopupLendingHash,
  getRepayLendingHash,
} from '../../../utils/crypto'
import { parseCancelOrderError } from '../../../config/errors'
import { getSigner } from '../../services/signer'

export default function ordersTableSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const address = accountDomain.address()
  const authenticated = accountDomain.authenticated()
  const orders = getLendingOrdersDomain(state).lastOrders(100)
  const trades = getLendingTradesDomain(state).userTrades(address)
  const currentPair = getTokenPairsDomain(state).getCurrentPair()
  const currentPairData = getTokenPairsDomain(state).getCurrentPairData()

  return {
    orders,
    trades,
    currentPair,
    currentPairData,
    authenticated,
  }
}

export const cancelLendingOrder = (hash): ThunkAction => {
  return async (dispatch, getState, { socket, api }) => {
    try {
      const state = getState()
      const order = getLendingOrdersDomain(state).getOrderByHash(hash)
      const accountDomain = getAccountDomain(state)
      const userAddress = accountDomain.address()
      const exchangeAddress = accountDomain.exchangeAddress()
      const nonce = await api.getLendingOrderNonce(userAddress)

      let params = {
        userAddress,
        relayerAddress: exchangeAddress,
        lendingToken: order.lendingToken,
        term: order.term,
        lendingId: order.lendingId,
        status: 'CANCELLED',
        hash: order.hash,
        nonce,
      }

      const orderSigned = await getSigner().signCancelLendingOrder(params)

      api.cancelLendingOrder(orderSigned)
      dispatch(appActionCreators.addSuccessNotification({ message: `Cancelling lending order...` }))
    } catch (error) {
      const message = parseCancelOrderError(error)
      return dispatch(appActionCreators.addErrorNotification({ message }))
    }
  }
}

export const topUpLendingOrder = ({hash, collateralToken}): ThunkAction => {
  return async (dispatch, getState, { socket, api }) => {
    try {
      const state = getState()
      const order = getLendingOrdersDomain(state).getOrderByHash(hash)
      const accountDomain = getAccountDomain(state)
      const userAddress = accountDomain.address()
      const exchangeAddress = accountDomain.exchangeAddress()
      const nonce = await api.getLendingOrderNonce(userAddress)

      let params = {
        userAddress,
        relayerAddress: exchangeAddress,
        lendingToken: order.lendingToken,
        term: order.term,
        quantity: order.quantity,
        tradeId: order.tradeId,
        status: 'TOPUP',
      }

      params.quantity = BigNumber(collateralToken.amount)
                    .multipliedBy(10 ** collateralToken.decimals).toString(10)

      params.nonce = String(nonce)
      params.hash = getTopupLendingHash(params)
      const orderSigned = await getSigner().signLendingOrder(params)

      api.topUpLendingOrder(orderSigned)
      dispatch(appActionCreators.addSuccessNotification({ message: `Top up lending order...` }))
    } catch (error) {
      const message = parseCancelOrderError(error)
      return dispatch(appActionCreators.addErrorNotification({ message }))
    }
  }
}

export const repayLendingOrder = (hash): ThunkAction => {
  return async (dispatch, getState, { socket, api }) => {
    try {      
      const state = getState()
      const accountDomain = getAccountDomain(state)
      const exchangeAddress = accountDomain.exchangeAddress()
      const userAddress = accountDomain.address()
      const trade = getLendingTradesDomain(state).byAddress()[hash]
      const nonce = await api.getLendingOrderNonce(userAddress)      

      let params = {
        userAddress,
        relayerAddress: exchangeAddress,
        lendingToken: trade.lendingToken,
        term: trade.term,
        tradeId: trade.tradeID,
        status: 'REPAY',
      }

      params.nonce = String(nonce)    
      params.hash = getRepayLendingHash(params)
      const orderSigned = await getSigner().signLendingOrder(params)

      await api.repayLendingOrder(orderSigned)
      dispatch(appActionCreators.addSuccessNotification({ message: `Repaying lending order...` }))
    } catch (e) {
      console.log(e)
      const message = parseCancelOrderError(e)
      return dispatch(appActionCreators.addErrorNotification({ message }))
    }
  }
}
