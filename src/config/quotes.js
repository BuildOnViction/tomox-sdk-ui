import {
  DEFAULT_NETWORK_ID
} from './environment.js'
import addresses from './addresses.json'
import {
  defaultTokenDecimals
} from './tokens'
import images from './images.json'

const quoteTokensTable = {
  [DEFAULT_NETWORK_ID]: []
}


let quoteTokensBySymbolsTable = {
  [DEFAULT_NETWORK_ID]: {}
}
export const quoteSymbolTokens = ['BTC', 'ETH', 'USDT', 'TOMO', 'TOMOS']
for (let token of quoteSymbolTokens) {
  const tokenData = {
    symbol: token,
    address: addresses[DEFAULT_NETWORK_ID][token],
    decimals: defaultTokenDecimals[token] || 18,
    image: images[DEFAULT_NETWORK_ID][token]
  }
  quoteTokensBySymbolsTable[DEFAULT_NETWORK_ID][token] = tokenData

  quoteTokensTable[DEFAULT_NETWORK_ID].push(tokenData)
}

export const quoteTokensBySymbols = quoteTokensBySymbolsTable[DEFAULT_NETWORK_ID];
export const quoteTokenSymbols = Object.keys(quoteTokensBySymbols);
export const quoteTokens = quoteTokensTable[DEFAULT_NETWORK_ID].map((m, index) => ({
  ...m,
  rank: index + 1
}));