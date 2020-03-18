// @flow
import { push } from 'connected-react-router'
import { BigNumber } from 'bignumber.js'

import { getSigner } from '../../services/signer'
import { parseNewOrderError } from '../../../config/errors'
import { getNewLendingOrderHash } from '../../../utils/crypto'

import * as notifierActionCreators from '../../actions/app'
import * as ordersActionCreators from '../../actions/orders'

import {
  getTokenPairsDomain,
  getOrderBookDomain,
  getAccountBalancesDomain,
  getAccountDomain,
  getOrdersDomain,
} from '../../domains/'

export default function getOrderFormSelector(state: State) {
  const tokenPairsDomain = getTokenPairsDomain(state)
  const orderBookDomain = getOrderBookDomain(state)
  const orderDomain = getOrdersDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const accountDomain = getAccountDomain(state)
  const currentPair = tokenPairsDomain.getCurrentPair()
  const currentPairData = tokenPairsDomain.getCurrentPairData()

  const {
    baseTokenSymbol,
    quoteTokenSymbol,
    baseTokenDecimals,
    quoteTokenDecimals,
  } = currentPair

  const selectedOrder = orderBookDomain.getSelectedOrder()

  const [baseToken, quoteToken] = accountBalancesDomain.getBalancesAndAllowancesBySymbol([baseTokenSymbol, quoteTokenSymbol])
  const authenticated = accountDomain.authenticated()
  const loading = orderDomain.loading()
  const baseTokenBalance = baseToken.availableBalance || 0
  const quoteTokenBalance = quoteToken.availableBalance || 0
  const fee = accountDomain.fee()

  return {
    selectedOrder,
    currentPair,
    currentPairData,
    baseTokenSymbol,
    quoteTokenSymbol,
    baseTokenBalance,
    quoteTokenBalance,
    baseTokenDecimals,
    quoteTokenDecimals,
    authenticated,
    loading,
    fee,
  }
}

export const sendNewLendingOrder = (order): ThunkAction => {
  return async (dispatch, getState, { socket, api }) => {
    try {
      // dispatch(ordersActionCreators.loading(true))
      const state = getState()
      const accountDomain = getAccountDomain(state)
      const userAddress = accountDomain.address()
      const exchangeAddress = accountDomain.exchangeAddress()

      const signer = getSigner()
      const nonce = await api.getLendingOrderNonce(userAddress)
      const interest = new BigNumber(order.interest)
        .multipliedBy(10 ** 8).toString(10)

      const params = {
        userAddress,
        relayerAddress: exchangeAddress,
        collateralToken: order.collateralToken || '0xc2fa1ba90b15e3612e0067a0020192938784d9c5',
        lendingToken: order.lendingToken || '0x45c25041b8e6cbd5c963e7943007187c3673c7c9',
        term: order.term || '60',
        interest,
        side: order.side || 'BORROW',
        type: order.type || 'LO',
        status: 'NEW',
        autoTopUp: order.autoTopUp || '1',
      }
      params.quantity = new BigNumber(order.amount)
        .multipliedBy(10 ** 8).toString(10) //TODO: remove hardecode 8 to lendingToken decimal
      params.nonce = String(nonce)
      params.hash = getNewLendingOrderHash(params)

      const orderSigned = await signer.signNewLendingOrder(params)
      socket.sendNewLendingOrderMessage(orderSigned)
    } catch (e) {
      console.log(e)
      // dispatch(ordersActionCreators.loading(false))
      const message = parseNewOrderError(e)
      return dispatch(notifierActionCreators.addErrorNotification({ message }))
    }
  }
}

export const redirectToLoginPage = (): ThunkAction => {
  return async (dispatch, getState) => {
    dispatch(push('/unlock'))
  }
}
