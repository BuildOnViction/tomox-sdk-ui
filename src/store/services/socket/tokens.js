//@flow
import type { WebsocketMessage } from '../../../types/websocket';
import { sendMessage } from './common';

export const sendGetTokenMessage = async () => {
  let message: WebsocketMessage = {
    channel: 'tokens',
    event: {
      type: 'GET_TOKENS'
    }
  };

  return sendMessage(message);
};
