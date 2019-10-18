import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import Layout from './Layout'
import LoginPage from './LoginPage'
import CreateWalletPage from './CreateWalletPage'
import WalletPage from './WalletPage'
import LogoutPage from './LogoutPage'
import TradingPage from './TradingPage'
import MarketsPage from './MarketsPage'
import Dapp from './Dapp'

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
            <Route exact path="/unlock" component={LoginPage} />
            <Route exact path="/wallet" component={WalletPage} />
            <Route exact path="/markets" component={MarketsPage} />
            <Route exact path="/trade/:pair?" component={TradingPage} /> 
            <Route exact path="/dapp/:pair?" component={Dapp} />           
            <Route exact path="/logout" component={LogoutPage} />
            <Route exact path="/create" component={CreateWalletPage} />
            <Route render={() => <Redirect to="/markets" />} />
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
