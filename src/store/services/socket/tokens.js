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

export const subscribeMarkets = () => {
  const message: WebsocketMessage = {
    channel: 'markets',
    event: {
      type: 'SUBSCRIBE',
    },
  }

  return sendMessage(message)
}

export const unSubscribeMarkets = () => {
  const message: WebsocketMessage = {
    channel: 'markets',
    event: {
      type: 'UNSUBSCRIBE',
    },
  }

  return sendMessage(message)
}
