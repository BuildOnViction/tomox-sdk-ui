// @flow
import { 
  getOrderBookDomain, 
  getTokenPairsDomain,
  getAccountDomain,
} from '../domains'
import type { State } from '../../types'

export default function orderBookSelector(state: State) {

  const orderBookDomain = getOrderBookDomain(state)
  const { bids, asks } = orderBookDomain.getOrderBookData(50)
  const decimals = orderBookDomain.getDecimals()

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
    decimals,
  }
}
