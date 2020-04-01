// @flow
import type { State, ThunkAction } from '../../../types'
import { 
  getAccountDomain,
  getLendingPairsDomain,
  getLendingTokensDomain, 
} from '../../domains'
import * as actionCreators from '../../actions/lending/lendingTokenSearcher'
import { push } from 'connected-react-router'

export default function tokenSearcherSelector(state: State) {
  // const domain = getTokenPairsDomain(state)
  // const accountBalancesDomain = getAccountBalancesDomain(state)
  // const tokenPairs = domain.getTokenPairsDataArray()
  // const favoriteTokenPairs = domain.getFavoritePairs()

  // const tokenPairsByQuoteToken = {}

  // for (const quote of quotes) {
  //   tokenPairsByQuoteToken[quote] = tokenPairs
  //     .filter(({ pair }) => getQuoteToken(pair) === quote)
  //     .map(tokenPair => ({
  //       ...tokenPair,
  //       base: getBaseToken(tokenPair.pair),
  //       quote: getQuoteToken(tokenPair.pair),
  //     }))
  //     .map(tokenPair => ({
  //       ...tokenPair,
  //       favorited: favoriteTokenPairs.indexOf(tokenPair.pair) > -1,
  //     }))
  // }

  // const currentPair = domain.getCurrentPair()
  // if (currentPair) {
  //   const baseTokenBalance = accountBalancesDomain.tokenBalance(currentPair.baseTokenSymbol)
  //   const quoteTokenBalance = accountBalancesDomain.tokenBalance(currentPair.quoteTokenSymbol)

  //   return {
  //     tokenPairsByQuoteToken,
  //     currentPair,
  //     baseTokenBalance,
  //     quoteTokenBalance,
  //   }
  // }

  const accountDomain = getAccountDomain(state)
  const pairs = getLendingPairsDomain(state).getTokenPairsWithDataArray()
  const lendingTokensDomain = getLendingTokensDomain(state)
  const lendingTokens = lendingTokensDomain.tokenSymbols()

  return {
    pairs,
    lendingTokens,
    authenticated: accountDomain.authenticated(),
  }
}

export const updateCurrentPair = (pair: string): ThunkAction => {
    return async (dispatch, getState) => {
      const param = pair.replace(' ', '_').replace('/', '-')
      // let { router: { location: { pathname }}} = getState()
      // pathname = pathname.includes('dapp') ? 'dapp' : 'trade'

      dispatch(actionCreators.updateCurrentPair(pair))
      dispatch(push(`/lending/${param}`))
    }
}
