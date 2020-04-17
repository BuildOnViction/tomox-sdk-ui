import React, { Suspense, lazy } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { ConnectedRouter } from 'connected-react-router'
import history from '../store/history'
import '../styles/css/index.css'

import appSelector from '../store/models/app'
import { Centered, Loading, DarkMode, LightMode } from '../components/Common'

const Layout = lazy(_ => import('./Layout'))
const LoginPage = lazy(_ => import('./LoginPage'))
const LogoutPage = lazy(_ => import('./LogoutPage'))
const CreateWalletPage = lazy(_ => import('./CreateWalletPage'))
const WalletPage = lazy(_ => import('./WalletPage'))

const TradingPage = lazy(_ => import('./trading/TradingPage'))
const MarketsPage = lazy(_ => import('./trading/MarketsPage'))
const Dapp = lazy(_ => import('./trading/Dapp'))
const DappTrade = lazy(_ => import('./trading/DappTrade'))
const DappOrders = lazy(_ => import('./trading/DappOrders'))

const LendingTradingPage = lazy(_ => import('./lending/TradingPage'))
const LendingMarketsPage = lazy(_ => import('./lending/MarketsPage'))
const DappLending = lazy(_ => import('./lending/DappLending'))

const theme = {
  dark: DarkMode,
  light: LightMode,
}

class App extends React.PureComponent {
  render() {
    const { mode } = this.props

    return (
      <ConnectedRouter history={history}>
        <ThemeProvider theme={theme[mode]}>
          <Suspense fallback={<Centered><Loading/></Centered>}>
            <Layout>          
              <Switch>
                <Route exact path="/unlock" component={LoginPage} />
                <Route exact path="/logout" component={LogoutPage} />
                <Route exact path="/create" component={CreateWalletPage} />
                <Route exact path="/wallet" component={WalletPage} />

                <Route exact path="/markets/trading" component={MarketsPage} />
                <Route exact path="/trade/:pair?" component={TradingPage} />  

                <Route exact path="/markets/lending" component={LendingMarketsPage} /> 
                <Route exact path="/lending/:pair?" component={LendingTradingPage} />                 
                
                <Route exact path="/dapp/orders" component={DappOrders} />
                <Route exact path="/dapp/:pair?" component={Dapp} />               
                <Route exact path="/dapp/trade/:pair?" component={DappTrade} />

                <Route exact path="/dapp/lending/:pair?" component={DappLending} /> 

                <Route render={() => <Redirect to="/markets/trading" />} />
              </Switch>          
            </Layout>
          </Suspense>
        </ThemeProvider>
      </ConnectedRouter>
    )
  }
}

const mapStateToProps = (state) => {
  const { location, mode } = appSelector(state)

  return {
    location,
    mode,
  }
}

export default connect(mapStateToProps)(App)
