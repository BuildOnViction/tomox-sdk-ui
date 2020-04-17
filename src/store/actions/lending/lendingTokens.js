//@flow
const actionTypes = {
  updateLendingTokens: "lendingTokens/UPDATE_LENDING_TOKENS",
  updateLendingCollaterals: "lendingTokens/UPDATE_LENDING_COLLATERALS",
  updateLendingTerms: "lendingTokens/UPDATE_LENDING_TERMS",
}

export function updateLendingTokens(tokens) {
  return {
    type: actionTypes.updateLendingTokens,
    payload: tokens,
  }
}

export function updateLendingCollaterals(collaterals) {
  return {
    type: actionTypes.updateLendingCollaterals,
    payload: collaterals,
  }
}

export function updateLendingTerms(terms) {
  return {
    type: actionTypes.updateLendingTerms,
    payload: terms,
  }
}

export default actionTypes
