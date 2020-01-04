import React, { Suspense, lazy } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

// import Layout from './Layout'
// import LoginPage from './LoginPage'
// import CreateWalletPage from './CreateWalletPage'
// import WalletPage from './WalletPage'
// import LogoutPage from './LogoutPage'
// import TradingPage from './TradingPage'
// import MarketsPage from './MarketsPage'
// import Dapp from './Dapp'

import { ConnectedRouter } from 'connected-react-router'
import history from '../store/history'
import '../styles/css/index.css'

import createSelector from '../store/models/app'
import { Centered, Loading } from '../components/Common'

const Layout = lazy(_ => import('./Layout'))
const LoginPage = lazy(_ => import('./LoginPage'))
const CreateWalletPage = lazy(_ => import('./CreateWalletPage'))
const WalletPage = lazy(_ => import('./WalletPage'))
const LogoutPage = lazy(_ => import('./LogoutPage'))
const TradingPage = lazy(_ => import('./TradingPage'))
const MarketsPage = lazy(_ => import('./MarketsPage'))
const Dapp = lazy(_ => import('./Dapp'))
class App extends React.PureComponent {

  render() {
    return (
      <ConnectedRouter history={history}>
        <Suspense fallback={<Centered><Loading/></Centered>}>
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
        </Suspense>
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
