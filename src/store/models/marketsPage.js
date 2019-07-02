// @flow
import { 
  getAccountDomain,
  getWebsocketDomain,
  getTokenPairsDomain,
} from '../domains'
import * as notifierActionCreators from '../actions/app'
import { parseQueryMarketDataError } from '../../config/errors'

import type { State, ThunkAction } from '../../types'

export default function marketsPageSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const webSocketDomain = getWebsocketDomain(state)
  const smallChartsData = getTokenPairsDomain(state).getSmallChartsData()

  return {
    authenticated: accountDomain.authenticated(),
    webSocketIsOpened: webSocketDomain.isOpened(),
    smallChartsData,
  }
}

export function queryMarketData(): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      socket.unSubscribeMarkets()
      socket.subscribeMarkets()
    } catch (e) {
      console.log(e)
      const message = parseQueryMarketDataError(e)
      dispatch(notifierActionCreators.addErrorNotification({ message }))
    }
  }
}

export function releaseResources(): ThunkAction {
  return async (dispatch, getState, { socket }) => {
    try {
      socket.unSubscribeMarkets()
    } catch (e) {
      console.log(e)
      const message = parseQueryMarketDataError(e)
      dispatch(notifierActionCreators.addErrorNotification({ message }))
    }
  }
}
