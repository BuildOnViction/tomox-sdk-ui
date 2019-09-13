import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import configureStore from './store/configureStore'
// import registerServiceWorker from './registerServiceWorker'
import { AppContainer } from 'react-hot-loader'
import SocketController from './components/SocketController'
import App from './app'
import { Loading } from './components/Common'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'

import { messsages } from './locales'
import { getAddresses } from './config/addresses.js'
import { generateQuotes } from './config/quotes'
import { generateTokens } from './config/tokens'

// registerServiceWorker()

const ConnectedIntlProvider = connect(state => {
  const { settings: {locale} } = state

  return { locale, key: locale, messages: messsages[locale] }
})(IntlProvider)

const render = async (AppComponent) => {
  // After refactor the flow, we get tokens and pairs from the API instead the addresses.json file but when app render,
  // tokens.js & quotes.js run before at all so variables relative tokens and pairs export from them are in addresss.json
  // we will change them with data from the API before create store
  const {addresses, err} = await getAddresses()
  if (!err) {
    generateQuotes(addresses)
    generateTokens(addresses)
  }
  const { store, persistor } = configureStore()
  window.store = store // for services of TVchart component

  return ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <SocketController>
            <ConnectedIntlProvider>              
              <AppComponent />              
            </ConnectedIntlProvider>
          </SocketController>
        </PersistGate>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default
    render(NextApp)
  })
}
