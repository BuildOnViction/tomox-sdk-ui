let ENGINE_HTTP_URL,
  ENGINE_WS_URL,
  ETHEREUM_NODE_HTTP_URL,
  ETHEREUM_NODE_WS_URL,
  DEFAULT_NETWORK_ID,
  BZZ_URL

const env = window.env || process.env

const WS_PROTOCOL = window.location.protocol.replace('http', 'ws')
const standardizeWSProtocol = url => {
  if (!url.startsWith('ws')) {
    url = `${WS_PROTOCOL}//${window.location.hostname}/${url}`
  }
  return url
}

if (env) {
  // ENGINE_HTTP_URL = 'http://engine'
  // ENGINE_WS_URL = 'ws://engine'
  // ETHEREUM_NODE_HTTP_URL = 'http://ethereum/'
  // ETHEREUM_NODE_WS_URL = 'ws://ethereum/ws/'
  ENGINE_HTTP_URL = env.REACT_APP_ENGINE_HTTP_URL
  ENGINE_WS_URL = standardizeWSProtocol(env.REACT_APP_ENGINE_WS_URL)
  ETHEREUM_NODE_HTTP_URL = env.REACT_APP_ETHEREUM_NODE_HTTP_URL
  ETHEREUM_NODE_WS_URL = standardizeWSProtocol(
    env.REACT_APP_ETHEREUM_NODE_WS_URL
  )
  DEFAULT_NETWORK_ID = env.REACT_APP_DEFAULT_NETWORK_ID || 'default'
  BZZ_URL = env.REACT_APP_ENGINE_BZZ_URL
}

export {
  ENGINE_HTTP_URL,
  ENGINE_WS_URL,
  ETHEREUM_NODE_HTTP_URL,
  ETHEREUM_NODE_WS_URL,
  DEFAULT_NETWORK_ID,
  BZZ_URL,
  WS_PROTOCOL,
}
