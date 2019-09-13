import data from './addresses.json'

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
        image: null,
      }
  }

  tokensBySymbol = tokensBySymbolTable
  tokenSymbols = Object.keys(tokensBySymbol)
  tokens = Object.values(tokensBySymbol)
}

generateTokens(data)

export { tokensBySymbol, tokenSymbols, tokens }
export const NATIVE_TOKEN_SYMBOL = 'TOMO'
export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000001'
export const defaultDecimals = 18
export const pricePrecision = 7
export const pricePrecisionsList = [1, 2, 3, 4, 5, 6, 7]
export const amountPrecision = 7
