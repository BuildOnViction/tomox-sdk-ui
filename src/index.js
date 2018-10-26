import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';
import { AppContainer } from 'react-hot-loader';
import App from './app';
import { Provider } from 'react-redux';

const { store } = configureStore();

registerServiceWorker();

const render = () => {
  return ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./app', () => {
    // const NextApp = require('./app').default;
    render();
  });
}

//TODO Reinclude PersistGate if needed:
// import { PersistGate } from 'redux-persist/integration/react';
// const { store, persistor } = configureStore();
// <PersistGate loading={null} persistor={persistor}>
// <Component />
// </PersistGate>
