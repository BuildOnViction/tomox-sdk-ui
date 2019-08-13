import addressesFromFile from './addresses'

const addressesFromSession = JSON.parse(sessionStorage.getItem('addresses'))
const addresses = addressesFromSession ? addressesFromSession : addressesFromFile

const tokensBySymbolTable = {}

for (const token in addresses.tokens) {
    tokensBySymbolTable[addresses.tokens[token].symbol] = {
      symbol: addresses.tokens[token].symbol,
      address: token,
      decimals: addresses.tokens[token].decimals,
      image: null,
    }
}

export const tokensBySymbol = tokensBySymbolTable
export const tokenSymbols = Object.keys(tokensBySymbol)
export const tokens = Object.values(tokensBySymbol)
export const NATIVE_TOKEN_SYMBOL = 'TOMO'
export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000001'
export const defaultDecimals = 18
export const pricePrecision = 7
export const pricePrecisionsList = [1, 2, 3, 4, 5, 6, 7]
export const amountPrecision = 7
