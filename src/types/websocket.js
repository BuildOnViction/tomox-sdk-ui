//@flow

export type WebsocketEvent = {
  type: string,
  hash: ? string,
  payload: Object,
};

export type WebsocketMessage = {
  channel: 'orders' | 'orderbook' | 'trades' | 'ohlcv',
  event: WebsocketEvent,
};

export type WebsocketState = {
  status: string,
}