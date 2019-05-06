import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import Layout from './Layout'
import LandingPage from './LandingPage'
import LoginPage from './LoginPage'
import WalletPage from './WalletPage'
import FaqPage from './FaqPage'
import SettingsPage from './SettingsPage'
import LogoutPage from './LogoutPage'
import TradingPage from './TradingPage'
import MarketsPage from './MarketsPage'

import SocketController from '../components/SocketController'
import { ConnectedRouter } from 'connected-react-router'
import history from '../store/history'
import '../styles/css/index.css'

const App = () => (
  <ConnectedRouter history={history}>
    <SocketController>
      <Layout>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/wallet" component={WalletPage} />
          <Route path="/markets" component={MarketsPage} />
          <Route path="/trade" component={TradingPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/faq" component={FaqPage} />
          <Route path="/logout" component={LogoutPage} />
        </Switch>
      </Layout>
    </SocketController>
  </ConnectedRouter>
)

// export default App;
// update when url change
export default connect(state => {
  return {
    location: state.router.location.pathname,
  }
})(App)
