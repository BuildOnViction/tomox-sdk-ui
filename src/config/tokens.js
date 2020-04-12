import data from './addresses.json'

let tokensByAddress = null
let tokensBySymbol = null
let tokenSymbols = null
let tokens = null

export function generateTokens(addresses) {

  const tokensBySymbolTable = {}

  for (const token in addresses.tokens) {
    tokensBySymbolTable[addresses.tokens[token].symbol] = {
      symbol: addresses.tokens[token].symbol,
      address: token,
      decimals: addresses.tokens[token].decimals,
      verified: addresses.tokens[token].verified,
    }
  }

  tokensByAddress = addresses.tokens
  tokensBySymbol = tokensBySymbolTable
  tokenSymbols = Object.keys(tokensBySymbol)
  tokens = Object.values(tokensBySymbol)
}

generateTokens(data)

export { tokensByAddress, tokensBySymbol, tokenSymbols, tokens }
export const NATIVE_TOKEN_SYMBOL = 'TOMO'
export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000001'
export const defaultDecimals = 18
export const pricePrecision = 8
export const amountPrecision = 8
