//@flow

export type WebsocketEvent = {
  type: string,
  hash?: string,
  payload?: any // can be object or array, string | number | boolean | {} | []
};

export type WebsocketMessage = {
  channel: 'orders' | 'orderbook' | 'trades' | 'ohlcv' | 'tokens' | 'deposit',
  event: WebsocketEvent
};

export type WebsocketState = {
  status: string
};
