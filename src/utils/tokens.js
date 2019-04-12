// import { NATIVE_TOKEN_SYMBOL } from '../config/tokens'

export const getPairSymbol = (baseTokenSymbol, quoteTokenSymbol) => {
  return `${baseTokenSymbol}/${quoteTokenSymbol}`
}

export const getBaseToken = pairSymbol => {
  return pairSymbol.split('/')[0]
}

export const getQuoteToken = pairSymbol => {
  return pairSymbol.split('/')[1]
}

export const generateTokenPairs = (quoteTokens, tokens) => {
  const tokenPairs = {}
  tokens.forEach(token => {
    // if (token.symbol === NATIVE_TOKEN_SYMBOL) return
    quoteTokens.forEach(quoteToken => {
      if (token.symbol !== quoteToken.symbol) {
        const pairSymbol = getPairSymbol(token.symbol, quoteToken.symbol)
        tokenPairs[pairSymbol] = {
          pair: pairSymbol,
          baseTokenSymbol: token.symbol,
          quoteTokenSymbol: quoteToken.symbol,
          baseTokenAddress: token.address,
          quoteTokenAddress: quoteToken.address,
          baseTokenDecimals: token.decimals,
          quoteTokenDecimals: quoteToken.decimals,
          pricepointMultiplier: 1e9,
        }
      }
    })
  })

  return tokenPairs
}
