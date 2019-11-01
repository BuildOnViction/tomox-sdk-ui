// @flow
import { 
  getOrderBookDomain, 
  getTokenPairsDomain,
  getAccountDomain,
} from '../domains'
import type { State } from '../../types'

export default function orderBookSelector(state: State) {
  const { bids, asks } = getOrderBookDomain(state).getOrderBookData(35)
  const pairDomain = getTokenPairsDomain(state)
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
