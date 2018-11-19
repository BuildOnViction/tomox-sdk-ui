export const BACKEND_URL = '127.0.0.1:8080';
export const WEBSOCKET_URL = `ws://${BACKEND_URL}/socket`;
export const NETWORK_URL =
  process.env.REACT_APP_ETHEREUM_NODE_HTTP_URL || 'http://127.0.0.1:8545';
export const BZZ_URL = 'http://127.0.0.1:8542';
