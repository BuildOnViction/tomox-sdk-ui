//@flow
import type { TokenPair } from '../../../types/tokens';
import type { WebsocketMessage } from '../../../types/websocket';
import { sendMessage } from './common';

import { addMonths } from 'date-fns';

export const subscribeChart = (
  pair: TokenPair,
  from: number,
  to: number,
  duration: number,
  units: string
) => {
  let message: WebsocketMessage;
  let now = Date.now();
  duration = duration || 1;
  units = units || 'hour';
  from = from || Math.floor(addMonths(new Date(now), -2).getTime() / 1000);
  to = to || Math.floor(new Date(now).getTime() / 1000);

  message = {
    channel: 'ohlcv',
    event: {
      type: 'SUBSCRIBE',
      payload: {
        name: pair.pair,
        baseToken: pair.baseTokenAddress,
        quoteToken: pair.quoteTokenAddress,
        from: from,
        to: to,
        units: units,
        duration: duration
      }
    }
  };

  return sendMessage(message).then(() => unsubscribeChart());
};

export const unsubscribeChart = () => {
  let message: WebsocketMessage;

  message = {
    channel: 'ohlcv',
    event: {
      type: 'UNSUBSCRIBE'
    }
  };

  return sendMessage(message);
};

export const subscribeOrderBook = (pair: TokenPair) => {
  let message: WebsocketMessage = {
    channel: 'orderbook',
    event: {
      type: 'SUBSCRIBE',
      payload: {
        name: pair.pair,
        baseToken: pair.baseTokenAddress,
        quoteToken: pair.quoteTokenAddress
      }
    }
  };

  return sendMessage(message).then(() => unsubscribeOrderBook());
};

export const unsubscribeOrderBook = () => {
  let message: WebsocketMessage;

  message = {
    channel: 'orderbook',
    event: { type: 'UNSUBSCRIBE' }
  };

  return sendMessage(message);
};

export const subscribeTrades = (pair: TokenPair) => {
  let message: WebsocketMessage;

  message = {
    channel: 'trades',
    event: {
      type: 'SUBSCRIBE',
      payload: {
        name: pair.pair,
        baseToken: pair.baseTokenAddress,
        quoteToken: pair.quoteTokenAddress
      }
    }
  };

  return sendMessage(message).then(() => unsubscribeTrades());
};

export const unsubscribeTrades = () => {
  let message: WebsocketMessage;

  message = {
    channel: 'trades',
    event: { type: 'UNSUBSCRIBE' }
  };

  return sendMessage(message);
};
