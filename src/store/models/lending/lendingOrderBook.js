// @flow
import BigNumber from 'bignumber.js'

import { 
  getLendingOrderBookDomain, 
  getLendingPairsDomain,
  getLendingOrdersDomain,
} from '../../domains'
import type { State } from '../../../types'

export default function lendingOrderBookSelector(state: State) {
  let { bids, asks } = getLendingOrderBookDomain(state).getOrderBookData(35)
  const pairDomain = getLendingPairsDomain(state)

  const currentPair = pairDomain.getCurrentPair()
  const currentPairData = pairDomain.getCurrentPairData()
  const userOrderInterests = getLendingOrdersDomain(state).current()
                            .filter(order => order.term === currentPair.termValue 
                                            && order.lendingToken.toLowerCase() === currentPair.lendingTokenAddress.toLowerCase())
                            .map(order => BigNumber(order.interest).toNumber(2, 1))

  bids = markUserOrder(bids, userOrderInterests)
  asks = markUserOrder(asks, userOrderInterests)

  return {
    bids,
    asks,
    currentPair,
    currentPairData,
  }
}

function markUserOrder(bidsOrAsks, orderInterests) {
  return bidsOrAsks.map(item => {
    if (orderInterests.includes(Number(item.interest))) {
      item.userOrder = true
    } else {
      item.userOrder = false
    }

    return item
  })
}
