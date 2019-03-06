import './env'
import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import configureStore from './store/configureStore'
import registerServiceWorker from './registerServiceWorker'
import { AppContainer } from 'react-hot-loader'
import App from './app'
import { Loading } from './components/Common'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'

import * as messagesData from './locales'

const { store, persistor } = configureStore

registerServiceWorker()

const ConnectedIntlProvider = connect(state => {
  const { locale } = state.settings
  // const locale = 'vi';
  if (locale === 'en') return { locale }
  return { locale, key: locale, messages: messagesData[locale] }
})(IntlProvider)

const render = AppComponent => {
  return ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <ConnectedIntlProvider>
            <AppComponent />
          </ConnectedIntlProvider>
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
