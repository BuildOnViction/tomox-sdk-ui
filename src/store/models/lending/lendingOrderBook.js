// @flow
import { 
  getLendingOrderBookDomain, 
  getAccountDomain,
  getLendingPairsDomain,
} from '../../domains'
import type { State } from '../../../types'

export default function lendingOrderBookSelector(state: State) {
  const { bids, asks } = getLendingOrderBookDomain(state).getOrderBookData(35)
  const pairDomain = getLendingPairsDomain(state)
  const accountDomain = getAccountDomain(state)

  const currentPair = pairDomain.getCurrentPair()
  const currentPairData = pairDomain.getCurrentPairData()
  const referenceCurrency = accountDomain.referenceCurrency()

  return {
    bids,
    asks,
    currentPair,
    currentPairData,
    referenceCurrency,
  }
}
