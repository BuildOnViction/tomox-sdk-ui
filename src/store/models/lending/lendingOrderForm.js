// @flow
import { push } from 'connected-react-router'
import { BigNumber } from 'bignumber.js'

import { getSigner } from '../../services/signer'
import { parseNewOrderError } from '../../../config/errors'
import { getNewLendingOrderHash } from '../../../utils/crypto'

import * as notifierActionCreators from '../../actions/app'
import * as lendingOrdersActionCreators from '../../actions/lending/lendingOrders'

import {
  getTokenPairsDomain,
  getOrderBookDomain,
  getAccountBalancesDomain,
  getAccountDomain,
  getLendingOrdersDomain,
  getLendingTokensDomain,
  getLendingPairsDomain,
} from '../../domains/'

export default function getOrderFormSelector(state: State) {
  // const tokenPairsDomain = getTokenPairsDomain(state)
  const orderBookDomain = getOrderBookDomain(state)
  const lendingOrderDomain = getLendingOrdersDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const accountDomain = getAccountDomain(state)
  const currentPair = getLendingPairsDomain(state).getCurrentPair()
  currentPair.lendingTokenBalance = accountBalancesDomain.tokenBalance(currentPair.lendingTokenSymbol)
  // const currentPairData = tokenPairsDomain.getCurrentPairData()
  const lendingTokensDomain = getLendingTokensDomain(state)
  let collateralTokens = lendingTokensDomain.collaterals()
  collateralTokens = accountBalancesDomain.getBalancesAndAllowances(collateralTokens)

  const selectedOrder = orderBookDomain.getSelectedOrder()

  const authenticated = accountDomain.authenticated()
  const loading = lendingOrderDomain.loading()
  const fee = accountDomain.fee()
  console.log(currentPair, '=================================================')
  return {
    selectedOrder,
    currentPair,
    // currentPairData,
    authenticated,
    loading,
    fee,
    collateralTokens,
  }
}

export const sendNewLendingOrder = (order): ThunkAction => {
  return async (dispatch, getState, { socket, api }) => {
    try {
      dispatch(lendingOrdersActionCreators.lendingOrdersUpdateLoading(true))
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
        collateralToken: order.collateralToken,
        lendingToken: order.lendingToken,
        term: order.term,
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

      const orderSigned = await signer.signLendingOrder(params)
      socket.sendNewLendingOrderMessage(orderSigned)
    } catch (e) {
      console.log(e)
      dispatch(lendingOrdersActionCreators.lendingOrdersUpdateLoading(false))
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
