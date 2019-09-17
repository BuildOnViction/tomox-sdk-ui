let ENGINE_HTTP_URL,
  ENGINE_WS_URL,
  TOMOCHAIN_NODE_HTTP_URL,
  TOMOCHAIN_NODE_WS_URL,
  TOMOSCAN_URL,
  TOMOTOKENS_URL,
  DEFAULT_NETWORK_ID,
  REACT_APP_DEX_VERSION

const env = window.env || process.env

const WS_PROTOCOL = window.location.protocol.replace('http', 'ws')
const standardizeWSProtocol = url => {
  if (!url.startsWith('ws')) {
    url = `${WS_PROTOCOL}//${window.location.hostname}/${url.replace(
      /^\/+/,
      ''
    )}`
  }
  return url
}

if (env) {
  ENGINE_HTTP_URL = env.REACT_APP_ENGINE_HTTP_URL
  ENGINE_WS_URL = standardizeWSProtocol(env.REACT_APP_ENGINE_WS_URL)
  TOMOCHAIN_NODE_HTTP_URL = env.REACT_APP_TOMOCHAIN_NODE_HTTP_URL
  TOMOCHAIN_NODE_WS_URL = standardizeWSProtocol(
    env.REACT_APP_TOMOCHAIN_NODE_WS_URL
  )
  TOMOSCAN_URL = env.REACT_APP_TOMOSCAN_URL
  TOMOTOKENS_URL = env.REACT_APP_TOMOTOKENS_URL
  DEFAULT_NETWORK_ID = env.REACT_APP_DEFAULT_NETWORK_ID || 'default'
  REACT_APP_DEX_VERSION = env.REACT_APP_DEX_VERSION || 'ALPHA'
}

export {
  ENGINE_HTTP_URL,
  ENGINE_WS_URL,
  TOMOCHAIN_NODE_HTTP_URL,
  TOMOCHAIN_NODE_WS_URL,
  TOMOSCAN_URL,
  TOMOTOKENS_URL,
  DEFAULT_NETWORK_ID,
  WS_PROTOCOL,
  REACT_APP_DEX_VERSION,
}
