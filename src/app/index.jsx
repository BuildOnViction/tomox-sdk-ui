import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import Layout from './Layout'
// import LandingPage from './LandingPage'
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

import { queryAccountData } from '../store/models/accountInit'
import createSelector from '../store/models/app'
class App extends React.PureComponent {
  componentDidMount() {
    const { authenticated, queryAccountData } = this.props
    if(authenticated) {
      queryAccountData()
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const nextAuthenticated = nextProps.authenticated
    const { authenticated, queryAccountData } = this.props
    
    if(nextAuthenticated && nextAuthenticated !== authenticated) {
      queryAccountData()
    }
  }

  render() {
    return (
      <ConnectedRouter history={history}>
        <SocketController>
          <Layout>
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/markets" />} />
              <Route path="/login" component={LoginPage} />
              <Route path="/wallet" component={WalletPage} />
              <Route path="/markets" component={MarketsPage} />
              <Route path="/trade/:pair" component={TradingPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="/faq" component={FaqPage} />
              <Route path="/logout" component={LogoutPage} />
            </Switch>
          </Layout>
        </SocketController>
      </ConnectedRouter>
    )
  }
} 

const mapStateToProps = (state) => {
  const selector = createSelector(state)
  return {
    location: selector.location,
    authenticated: selector.authenticated,
  }
}

const mapDispatchToProps = {
  queryAccountData,
}

// export default App;
// update when url change
export default connect(mapStateToProps, mapDispatchToProps)(App)
