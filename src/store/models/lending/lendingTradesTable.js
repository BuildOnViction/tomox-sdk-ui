// @flow
import {
  getLendingTradesDomain,
  getTokenPairsDomain,
  getAccountDomain,
} from "../../domains"
import type { State } from "../../../types"

export default function lendingTradesTableSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const userAddress = accountDomain.address()
  const tradeDomain = getLendingTradesDomain(state)
  const tokenPairDomain = getTokenPairsDomain(state)
  return {
    trades: n => tradeDomain.marketTrades(n),
    userTrades: () => tradeDomain.userTrades(userAddress),
    currentPair: () => tokenPairDomain.getCurrentPair(),
  }
}
