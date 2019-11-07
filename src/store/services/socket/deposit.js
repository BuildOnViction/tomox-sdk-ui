//@flow
import type { WebsocketMessage } from '../../../types/websocket'
import type { Chain } from '../../../types/deposit'
import type { PairAddresses } from '../../../types/pairs'
import { sendMessage } from './common'

export const sendNewDepositMessage = async (
  chain: Chain,
  associatedAddress: string,
  pairAddresses: PairAddresses
) => {
  const message: WebsocketMessage = {
    channel: 'deposit',
    event: {
      type: 'NEW_DEPOSIT',
      payload: {
        chain,
        associatedAddress,
        pairAddresses,
      },
    },
  }

  return sendMessage(message)
}
