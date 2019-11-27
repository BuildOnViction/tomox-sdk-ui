import createStore from '../../store/configureStore'

import getOrderBookModel from './orderBook'
import { getTokenPairsDomain, getAccountDomain } from '../domains'

it('checks Initial Model return', async () => {
  const { store } = createStore()
  const initialState = { asks: [], bids: [] }
  const tokenPairDomain = getTokenPairsDomain(store.getState())

  initialState['currentPair'] = tokenPairDomain.getCurrentPair()
  initialState['currentPairData'] = tokenPairDomain.getCurrentPairData()
  initialState['referenceCurrency'] = getAccountDomain(store.getState()).referenceCurrency()

  const defaultOrderBookDomain = getOrderBookModel(store.getState())
  expect(defaultOrderBookDomain).toEqual(initialState)
})
