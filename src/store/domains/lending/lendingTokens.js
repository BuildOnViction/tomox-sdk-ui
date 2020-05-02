// @flow
const INITIAL_STATE = {
    tokens: {
      symbols: [],
      byAddress: {},
    },
    collaterals: {
      symbols: [],
      byAddress: {},
    },
    terms: {
      symbols: [],
      byTerm: {},
    },
}

export const initialized = () => {
  const event = (state = INITIAL_STATE) => state
  
  return event
}

export const updateLendingTokens = (tokens) => {
  const symbols = tokens.map(token => token.symbol)

  const byAddress = tokens.reduce((result, token) => {
    token.address = token.contractAddress.toLowerCase()
    result[token.address] = token
    return result
  }, {})

  const event = (state) => ({
      ...state,
      tokens: {
        symbols,
        byAddress,
      },
  })

  return event
}

export const updateLendingCollaterals = (collaterals) => {
  const symbols = collaterals.map(token => token.symbol)

  const byAddress = collaterals.reduce((result, token) => {
    token.address = token.contractAddress.toLowerCase()
    result[token.address] = token
    return result
  }, {})

  const event = (state) => ({
    ...state,
    collaterals: {
      symbols,
      byAddress,
    },
  })

  return event
}

export const updateLendingTerms = (terms) => {
  const symbols = terms.map(token => token.symbol)

  const byTerm = terms.reduce((result, term) => {
    result[term.term] = term
    return result
  }, {})

  const event = (state) => ({
    ...state,
    terms: {
      symbols,
      byTerm,
    },
  })

  return event
}

export default function getLendingTokensDomain(state: TokenState) {
  return {
    // lending tokens
    tokens: _ => state.tokens ? Object.values(state.tokens.byAddress) : [],
    tokenSymbols: _ => state.tokens ? state.tokens.symbols : [],
    tokensByAddress: _ => state.tokens ? state.tokens.byAddress : {},
    getTokenByAddress: address => state.tokens ? state.tokens.byAddress[address.toLowerCase()] : {},

    // lending collaterals
    collaterals: _ => state.collaterals ? Object.values(state.collaterals.byAddress) : [],
    collateralSymbols: _ => state.collaterals ? state.collaterals.symbols : [],
    collateralsByAddress: _ => state.collaterals ? state.collaterals.byAddress : {},
    getCollateralByAddress: address => state.collaterals ? state.collaterals.byAddress[address] : {},

    // lending terms
    terms: _ => state.terms ? Object.values(state.terms.byValue) : [],
    termsSymbols: _ => state.terms ? state.terms.symbols : [],
    termsByValue: _ => state.terms ? state.terms.byValue : {},
    getTermByValue: value => state.terms ? state.terms.byTerm[value] : {},
  }
}
