export type WebsocketMessage = {
  channel: 'orders' | 'orderbook' | 'trades' | 'ohlcv',
  event: WebsocketEvent,
};

export type WebsocketEvent = {
  type: string,
  hash: ?string,
  payload: Object,
};
