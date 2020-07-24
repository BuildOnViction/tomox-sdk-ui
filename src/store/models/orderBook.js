// @flow
import { 
  getOrderBookDomain, 
  getTokenPairsDomain,
  getAccountDomain,
  getOrdersDomain,
} from '../domains'
import type { State } from '../../types'
import BigNumber from 'bignumber.js'

export default function orderBookSelector(state: State) {

  const orderBookDomain = getOrderBookDomain(state)
  let { bids, asks } = orderBookDomain.getOrderBookData(50)
  const decimals = orderBookDomain.getDecimals()

  const pairDomain = getTokenPairsDomain(state)
  const accountDomain = getAccountDomain(state)

  const currentPair = pairDomain.getCurrentPair()
  const currentPairData = pairDomain.getCurrentPairData()
  const referenceCurrency = accountDomain.referenceCurrency()
  const userOrderPrices = getOrdersDomain(state).current()
                        .filter(order => order.pair === currentPair.pair)
                        .map(order => BigNumber(order.price).toNumber(decimals, 1))

  bids = markUserOrder(bids, userOrderPrices)
  asks = markUserOrder(asks, userOrderPrices)

  return {
    bids,
    asks,
    currentPair,
    currentPairData,
    referenceCurrency,
    decimals,
  }
}

function markUserOrder(bidsOrAsks, orderPrices) {
  return bidsOrAsks.map(item => {
    if (orderPrices.includes(Number(item.price))) {
      item.userOrder = true
    } else {
      item.userOrder = false
    }

    return item
  })
}