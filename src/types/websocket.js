//@flow

export type WebsocketEvent = {
  type: string,
  hash: ? string,
  payload: any, // can be object or array
};

export type WebsocketMessage = {
  channel: 'orders' | 'orderbook' | 'trades' | 'ohlcv',
  event: WebsocketEvent,
};

export type WebsocketState = {
  status: string,
}