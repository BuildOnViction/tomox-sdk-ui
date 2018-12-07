// @flow
import {
  getTradesDomain,
  getTokenPairsDomain,
  getAccountDomain
} from '../domains';
import type { State } from '../../types';

export default function tradesTableSelector(state: State) {
  let accountDomain = getAccountDomain(state);
  let userAddress = accountDomain.address();
  let tradeDomain = getTradesDomain(state);
  let tokenPairDomain = getTokenPairsDomain(state);
  return {
    trades: () => tradeDomain.marketTrades(50),
    userTrades: () => tradeDomain.userTrades(userAddress),
    currentPair: () => tokenPairDomain.getCurrentPair()
  };
}
