import createStore from '../../store/configureStore'

import getOrderFormModel from './orderForm'
import { getTokenPairsDomain, getOrderBookDomain, getAccountBalancesDomain } from '../domains'

it('checks Initial Model return', async () => {
  const { store } = createStore()
  const state = store.getState()

  const tokenPairDomain = getTokenPairsDomain(state)
  const orderBookDomain = getOrderBookDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)

  const currentPair = tokenPairDomain.getCurrentPair()
  const baseToken = currentPair.baseTokenSymbol
  const quoteToken = currentPair.quoteTokenSymbol
  const baseTokenBalance = accountBalancesDomain.get(baseToken)
  const quoteTokenBalance = accountBalancesDomain.get(quoteToken)
  const askPrice = orderBookDomain.getAskPrice()
  const bidPrice = orderBookDomain.getBidPrice()
  const defaultOrderFormDomain = getOrderFormModel(state)

  expect(defaultOrderFormDomain).toEqual({
    currentPair,
    baseToken,
    quoteToken,
    baseTokenBalance,
    quoteTokenBalance,
    askPrice,
    bidPrice,
  })
})
