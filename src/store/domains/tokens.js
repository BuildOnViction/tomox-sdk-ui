// @flow
import { tokenSymbols, tokensByAddress } from '../../config/tokens'

import type { TokenState } from '../../types/tokens'

export const initialized = () => {
  const initialState = {
    symbols: tokenSymbols,
    byAddress: tokensByAddress,
  }
  const event = (state: TokenState = initialState) => state
  return event
}

export default function getTokenDomain(state: TokenState) {
  return {
    byAddress: () => state.byAddress,
    symbols: () => state.symbols,
    tokens: () => Object.values(state.byAddress),
    rankedTokens: () =>
      (Object.values(state.byAddress): any).map((m, index) => ({
        ...m,
        rank: index + 1,
      })),
    getTokenByAddress: (address) => state.byAddress[address],
  }
}
