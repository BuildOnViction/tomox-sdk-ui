import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';
import { AppContainer } from 'react-hot-loader';
import App from './app';
import { Loading } from './components/Common';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

const { store, persistor } = configureStore();

registerServiceWorker();

const render = AppComponent => {
  return ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <AppComponent />
        </PersistGate>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default;
    render(NextApp);
  });
}
