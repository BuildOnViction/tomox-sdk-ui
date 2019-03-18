import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import history from './history'
import thunk from 'redux-thunk'
import * as reducers from './reducers'
import * as services from './services'
import '../styles/css/index.css'
import storage from 'redux-persist/lib/storage'
import { DEFAULT_NETWORK_ID } from '../config/environment'
import { createLocalWalletSigner } from './services/signer'

let composeEnhancers = compose

// persist this store, each time state change it will rehydrate the store
// use localforage wrapper when WEBSQL is ready on all browsers
// we save only audioTrack from bookReducer and all from loginReducer
const accountTransform = createTransform(
  // transform state coming form redux on its way to being serialized and stored
  // such as {key1}=>{key1.tolower} means store into localStorage as lower case
  inboundState => inboundState,
  // transform state coming from storage, on its way to be rehydrated into redux
  // such as {key1}=>{key1:key1.toupper} means get from localStorage and transform it to uppercase in store
  outboundState => {
    if (outboundState.privateKey) {
      // create a local wallet when rehydrate
      createLocalWalletSigner({
          privateKey: outboundState.privateKey,
        },
        +DEFAULT_NETWORK_ID
      )
      return outboundState
    }
    // reset if logged by metamask
    return {
      ...outboundState,
      address: null,
    }
  },
  // apply creating window.signer from account
  {
    whitelist: ['account'],
  }
)

const persistConfig = {
  key: 'root',
  keyPrefix: 'tomo:',
  storage,
  transforms: [accountTransform],
  whitelist: ['account', 'accountBalances'], // only information related to account will be persisted
}

const initialStore = {}

if (
  process.env.NODE_ENV !== 'production' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
}

const middlewares = [
  thunk.withExtraArgument(services),
  routerMiddleware(history),
]
const enhancers = [applyMiddleware(...middlewares)]
const storeEnhancer = composeEnhancers(...enhancers)
const rootReducer = combineReducers(reducers)

// eslint-disable-next-line
const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = preloadedState => {
  const store = createStore(
    connectRouter(history)(persistedReducer),
    preloadedState,
    storeEnhancer
  )
  const persistor = persistStore(store, initialStore)

  if (module.hot) {
    module.hot.accept(() => {
      const nextReducers = require('./reducers')
      const nextRootReducer = combineReducers(nextReducers)
      const nextPersistedReducer = persistReducer(
        persistConfig,
        nextRootReducer
      )
      // store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
      store.replaceReducer(connectRouter(history)(nextPersistedReducer))
    })
  }

  return {
    store,
    persistor,
  }
}

export default configureStore()
