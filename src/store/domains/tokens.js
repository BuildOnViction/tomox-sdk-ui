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

export const updateBridgeTokenConfig = (tokens: Array<Object>) => {
  const event = (state: TokenState) => {
    const newByAddress = {...state.byAddress}
    
    tokens.map(token => {
      if (newByAddress[token.wrapperAddress.toLowerCase()]) {
        newByAddress[token.wrapperAddress.toLowerCase()] = {...newByAddress[token.wrapperAddress.toLowerCase()], ...token}
      }
      return null
    })

    return {
      symbols: state.symbols,
      byAddress: {
        ...state.byAddress,
        ...newByAddress,
      },
    }
  }
  return event
}

export const updateBridgeDepositAddress = (data: Object) => {
  const event = (state: TokenState) => {
    const tokens = Object.values(state.byAddress)
    let token = tokens.find(token => token.symbol === data.coin)
    if (token) token = {...token, ...data}

    return {
      symbols: state.symbols,
      byAddress: {
        ...state.byAddress,
        [token.address.toLowerCase()]: token,
      },
    }
  }
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
