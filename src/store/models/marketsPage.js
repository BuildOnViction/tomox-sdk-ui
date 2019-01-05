// @flow
import { getAccountDomain, getTokenPairsDomain } from '../domains'
import * as actionCreators from '../actions/marketsPage'
import * as notifierActionCreators from '../actions/app'
import { parseQueryMarketDataError } from '../../config/errors'

import { parseTokenPairsData } from '../../utils/parsers'

import type { State, ThunkAction } from '../../types'

export default function marketsPageSelector(state: State) {
  const accountDomain = getAccountDomain(state)

  return {
    authenticated: accountDomain.authenticated(),
  }
}

export function queryMarketData(): ThunkAction {
  return async (dispatch, getState, { api, provider }) => {
    try {
      const state = getState()
      const pairDomain = getTokenPairsDomain(state)
      const pairs = pairDomain.getPairsByCode()

      let tokenPairData = await api.fetchTokenPairData()
      tokenPairData = parseTokenPairsData(tokenPairData, pairs)

      dispatch(actionCreators.updateTokenPairData(tokenPairData))
    } catch (e) {
      console.log(e)
      const message = parseQueryMarketDataError(e)
      dispatch(notifierActionCreators.addErrorNotification({ message }))
    }
  }
}
