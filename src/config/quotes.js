import addresses from './addresses.json'
import images from './images.json'

const getAddress = (symbol) => {
  for (const address in addresses.tokens) {
    if (addresses.tokens[address].symbol === symbol) {
      return address
    }
  }
}

const quoteSymbolTokens = []
const pairs = addresses.pairs

pairs.forEach(p => {
  const x = p.split('/')
  if (x[1] && !quoteSymbolTokens.includes(x[1])) {
    const quoteToken = x[1]
    quoteSymbolTokens.push(quoteToken)
  }
})

const quoteTokensTable = []

const quoteTokensBySymbolsTable = {}

for (const token of quoteSymbolTokens) {
  const address = getAddress(token)

  const tokenData = {
    symbol: addresses.tokens[address].symbol,
    address,
    decimals: addresses.tokens[address].decimals,
    image: images[token],
  }
  quoteTokensBySymbolsTable[token] = tokenData

  quoteTokensTable.push(tokenData)
}

export const quoteTokensBySymbols = quoteTokensBySymbolsTable
export const quoteTokenSymbols = Object.keys(quoteTokensBySymbols)
export const quoteTokens = quoteTokensTable.map(
  (m, index) => ({
    ...m,
    rank: index + 1,
  }),
)
