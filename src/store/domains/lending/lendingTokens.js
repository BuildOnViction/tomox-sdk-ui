// @flow

const INITIAL_STATE = {
    tokens: null,
    collaterals: null,
    terms: null,
}

export const initialized = () => {
  const event = (state = INITIAL_STATE) => state
  
  return event
}

export const updateLendingTokens = (tokens) => {
  const symbols = tokens.map(token => token.symbol)

  const bySymbol = tokens.reduce((result, token) => {
    result[token.symbol] = token
    return result
  }, {})

  const byAddress = tokens.reduce((result, token) => {
    token.address = token.contractAddress.toLowerCase()
    result[token.address] = token
    return result
  }, {})

  const event = (state) => ({
      ...state,
      tokens: {
        symbols,
        bySymbol,
        byAddress,
      },
  })

  return event
}

export const updateLendingCollaterals = (collaterals) => {
  const symbols = collaterals.map(token => token.symbol)

  const bySymbol = collaterals.reduce((result, token) => {
    result[token.symbol] = token
    return result
  }, {})

  const byAddress = collaterals.reduce((result, token) => {
    token.address = token.contractAddress.toLowerCase()
    result[token.address] = token
    return result
  }, {})

  const event = (state) => ({
    ...state,
    collaterals: {
      symbols,
      bySymbol,
      byAddress,
    },
  })

  return event
}

export const updateLendingTerms = (terms) => {
  const symbols = terms.map(token => token.symbol)

  const bySymbol = terms.reduce((result, term) => {
    result[term.symbol] = term
    return result
  }, {})

  const byTerm = terms.reduce((result, term) => {
    result[term.term] = term
    return result
  }, {})

  const event = (state) => ({
    ...state,
    terms: {
      symbols,
      bySymbol,
      byTerm,
    },
  })

  return event
}

export default function getLendingTokensDomain(state: TokenState) {
  return {
    // lending tokens
    tokens: _ => state.tokens ? Object.values(state.tokens.bySymbol) : null,
    tokenSymbols: _ => state.tokens ? state.tokens.symbols : [],
    tokensBySymbol: _ => state.tokens ? state.tokens.bySymbol : [],
    getTokenByAddress: address => state.tokens ? state.tokens.byAddress[address.toLowerCase()] : null,

    // lending collaterals
    collaterals: _ => state.collaterals ? Object.values(state.collaterals.bySymbol) : [],
    collateralSymbols: _ => state.collaterals ? state.collaterals.symbols : [],
    collateralsBySymbol: _ => state.collaterals ? state.collaterals.bySymbol : [],
    getCollateralByAddress: address => state.collaterals ? state.collaterals.byAddress[address] : null,

    // lending collaterals
    terms: _ => state.terms ? Object.values(state.terms.bySymbol) : null,
    termsSymbols: _ => state.terms ? state.terms.symbols : [],
    termsBySymbol: _ => state.terms ? state.terms.bySymbol : [],
    getTermByValue: value => state.terms ? state.terms.byTerm[value] : null,
  }
}
