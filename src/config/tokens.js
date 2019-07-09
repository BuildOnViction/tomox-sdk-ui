import addresses from './addresses.json'
import images from './images.json'

export const defaultDecimals = 18

const tokensBySymbolTable = {}

for (const token in addresses.tokens) {
    tokensBySymbolTable[addresses.tokens[token].symbol] = {
      symbol: addresses.tokens[token].symbol,
      address: token,
      decimals: addresses.tokens[token].decimals,
      image: images[addresses.tokens[token].symbol],
    }
}

export const tokensBySymbol = tokensBySymbolTable
export const tokenSymbols = Object.keys(tokensBySymbol)
export const tokens = Object.values(tokensBySymbol)
export const NATIVE_TOKEN_SYMBOL = 'TOMO'
export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000001'
export const pricePrecision = 7
export const pricePrecisionsList = [1, 2, 3, 4, 5, 6, 7]
export const amountPrecision = 7
