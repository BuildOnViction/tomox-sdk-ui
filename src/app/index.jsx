import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import Layout from './Layout'
import LoginPage from './LoginPage'
import CreateWalletPage from './CreateWalletPage'
import WalletPage from './WalletPage'
import SettingsPage from './SettingsPage'
import LogoutPage from './LogoutPage'
import TradingPage from './TradingPage'
import MarketsPage from './MarketsPage'

import { ConnectedRouter } from 'connected-react-router'
import history from '../store/history'
import '../styles/css/index.css'

import createSelector from '../store/models/app'
class App extends React.PureComponent {

  render() {
    return (
      <ConnectedRouter history={history}>
        <Layout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/markets" />} />
            <Route path="/unlock" component={LoginPage} />
            <Route path="/wallet" component={WalletPage} />
            <Route path="/markets" component={MarketsPage} />
            <Route path="/trade/:pair?" component={TradingPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/logout" component={LogoutPage} />
            <Route path="/create" component={CreateWalletPage} />
          </Switch>
        </Layout>
      </ConnectedRouter>
    )
  }
} 

const mapStateToProps = (state) => {
  const selector = createSelector(state)
  return {
    location: selector.location,
  }
}

export default connect(mapStateToProps)(App)
