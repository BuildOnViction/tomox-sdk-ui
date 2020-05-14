import data from './addresses.json'

let quoteTokensBySymbols = null
let quoteTokenSymbols = null
let quoteTokens = null

export function generateQuotes(addresses) {
  const getAddress = (symbol) => {
    for (const address in addresses.tokens) {
      if (addresses.tokens[address].symbol === symbol) {
        return address
      }
    }
  }

  const quoteSymbolTokens = []
  const pairs = Object.keys(addresses.pairs)

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
      image: null,
    }
    quoteTokensBySymbolsTable[token] = tokenData

    quoteTokensTable.push(tokenData)
  }

  quoteTokensBySymbols = quoteTokensBySymbolsTable
  quoteTokenSymbols = Object.keys(quoteTokensBySymbols)
  quoteTokens = quoteTokensTable.map(
    (m, index) => ({
      ...m,
      rank: index + 1,
    }),
  )
}

generateQuotes(data)

export { quoteTokensBySymbols, quoteTokenSymbols, quoteTokens }
