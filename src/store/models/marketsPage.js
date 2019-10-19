// @flow
import { 
  getAccountDomain,
  getWebsocketDomain,
  getTokenPairsDomain,
} from '../domains'
import type { State } from '../../types'

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
