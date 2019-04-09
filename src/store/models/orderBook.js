// @flow
import { getOrderBookDomain, getTokenPairsDomain } from '../domains'
import type { State } from '../../types'

export default function orderBookSelector(state: State) {
  const { bids, asks } = getOrderBookDomain(state).getOrderBookData(25)
  const currentPair = getTokenPairsDomain(state).getCurrentPair()

  return {
    bids,
    asks,
    currentPair,
  }
}
