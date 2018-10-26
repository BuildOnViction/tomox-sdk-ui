import addresses from './addresses.json'

const networkID = process.env.REACT_APP_DEFAULT_NETWORK_ID || 'default'

const quoteTokensTable = {
  '8888': [{ symbol: 'WETH', address: addresses['8888']['WETH'] }, { symbol: 'MKR', address: addresses['8888']['MKR'] }]
}

const quoteTokensBySymbolsTable = {
  '8888': {
    WETH: {
      symbol: 'WETH',
      address: addresses['8888']['WETH']
    },
    MKR: {
      symbol: 'MKR',
      address: addresses['8888']['MKR']
    }
  }
}

export const quoteTokensBySymbols = quoteTokensBySymbolsTable[networkID]
export const quoteTokenSymbols = Object.keys(quoteTokensBySymbols)
export const quoteTokens = quoteTokensTable[process.env.REACT_APP_DEFAULT_NETWORK_ID].map((m, index) => ({
  ...m,
  rank: index + 1
}))
