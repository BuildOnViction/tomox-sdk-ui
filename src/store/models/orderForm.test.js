import createStore from '../../store/configureStore'

import getOrderFormModel from './orderForm'
import { 
  getTokenPairsDomain, 
  getOrderBookDomain, 
  getAccountBalancesDomain,
  getOrdersDomain,
  getAccountDomain,
} from '../domains'

it('checks Initial Model return', async () => {
  const { store } = createStore()
  const state = store.getState()

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
  const defaultOrderFormDomain = getOrderFormModel(state)

  expect(defaultOrderFormDomain).toEqual({
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
  })
})
