import {
  DEFAULT_NETWORK_ID,
} from './environment'
import addresses from './addresses.json'

export const EXCHANGE_ADDRESS = {
  [DEFAULT_NETWORK_ID]: addresses[DEFAULT_NETWORK_ID]['Exchange'],
}

export const WETH_ADDRESS = {
  [DEFAULT_NETWORK_ID]: addresses[DEFAULT_NETWORK_ID]['WETH'],
}
