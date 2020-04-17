// @flow
import { 
  getLendingOrderBookDomain, 
  getLendingPairsDomain,
} from '../../domains'
import type { State } from '../../../types'

export default function lendingOrderBookSelector(state: State) {
  const { bids, asks } = getLendingOrderBookDomain(state).getOrderBookData(35)
  const pairDomain = getLendingPairsDomain(state)

  const currentPair = pairDomain.getCurrentPair()
  const currentPairData = pairDomain.getCurrentPairData()

  return {
    bids,
    asks,
    currentPair,
    currentPairData,
  }
}
