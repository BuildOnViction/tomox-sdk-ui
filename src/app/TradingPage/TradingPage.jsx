// @flow
import React from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import { Grid } from 'styled-css-grid'

import OHLCV from '../../components/OHLCV'
import OrdersTable from '../../components/OrdersTable'
import OrderForm from '../../components/OrderForm'
import { CloseableCallout } from '../../components/Common'
import TradesTable from '../../components/TradesTable'
import TokenSearcher from '../../components/TokenSearcher'
import OrderBook from '../../components/OrderBook'

type Props = {
  authenticated: boolean,
  isConnected: boolean,
  isInitiated: boolean,
  balancesLoading: boolean,
  baseTokenBalance: string,
  quoteTokenBalance: string,
  baseTokenAllowance: string,
  quoteTokenAllowance: string,
  baseTokenSymbol: string,
  quoteTokenSymbol: string,
  pairIsAllowed: boolean,
  pairName: string,
  queryTradingPageData: () => void,
  makeFee: string,
  takeFee: string,
  toggleAllowances: (baseTokenSymbol: string, quoteTokenSymbol: string) => void,
}

type State = {
  calloutVisible: boolean,
  calloutOptions: Object
};

export default class TradingPage extends React.PureComponent<Props, State> {
  state = {
    calloutVisible: false,
    calloutOptions: {},
  }

  callouts = {
    notAuthenticated: () => ({
      title: 'Authenticated Required',
      intent: 'danger',
      message: 'Please authenticate to start trading',
    }),
    fundsLocked: (symbol: string) => ({
      title: `${symbol} Tokens locked`,
      intent: 'danger',
      message:
        'To start trading, you need to unlock funds and allow Tomochain to settle transactions when a match is found',
    }),
    quoteTokensLocked: (quoteTokenSymbol: string) => ({
      title: `Unlock tokens to start trading`,
      intent: 'danger',
      message: `To start trading, unlock trading for ${quoteTokenSymbol} tokens on your wallet page.`,
    }),
    baseTokensLocked: (baseTokenSymbol: string) => ({
      title: `Unlock tokens to start trading`,
      intent: 'danger',
      message: `To start trading, unlock trading for ${baseTokenSymbol} tokens on your wallet page.`,
    }),
    tokensLocked: (baseTokenSymbol: string, quoteTokenSymbol: string) => ({
      title: `Unlock tokens to start trading`,
      intent: `danger`,
      message: `To start trading a currency pair, unlock trading for both tokens (${baseTokenSymbol} and ${quoteTokenSymbol}) on your wallet page.`,
    }),
  }

  componentDidMount() {
    if (this.props.isConnected) {
      this.props.queryTradingPageData()
    }

    this.checkIfCalloutRequired()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isConnected || !this.props.isConnected) {
      return
    }

    this.props.queryTradingPageData()
  }

  checkIfCalloutRequired = () => {
    const {
      authenticated,
      baseTokenBalance,
      quoteTokenBalance,
      baseTokenAllowance,
      quoteTokenAllowance,
      baseTokenSymbol,
      quoteTokenSymbol,
    } = this.props

    if (!authenticated) {
      const calloutOptions = this.callouts.notAuthenticated()
      return this.setState({ calloutVisible: true, calloutOptions })
    }

    if (baseTokenBalance === '0.0' && quoteTokenBalance === '0.0') {
      return
    }

    if (baseTokenBalance !== '0.0' && baseTokenAllowance === '0.0') {
      const calloutOptions = this.callouts.fundsLocked(baseTokenSymbol)
      return this.setState({ calloutVisible: true, calloutOptions })
    }

    if (quoteTokenBalance !== '0.0' && quoteTokenAllowance === '0.0') {
      const calloutOptions = this.callouts.fundsLocked(quoteTokenSymbol)
      return this.setState({ calloutVisible: true, calloutOptions })
    }

    // TODO update when moving balances in redux from string to numbers
    if (baseTokenAllowance === '0.0') {
      const calloutOptions = this.callouts.baseTokensLocked(baseTokenSymbol)
      return this.setState({ calloutVisible: true, calloutOptions })
    }

    if (quoteTokenAllowance === '0.0') {
      const calloutOptions = this.callouts.quoteTokensLocked(quoteTokenSymbol)
      return this.setState({ calloutVisible: true, calloutOptions })
    }
  }

  closeCallout = () => {
    this.setState({ calloutVisible: false })
  }

  render() {
    const { authenticated, isInitiated } = this.props
    if (!authenticated) return <Redirect to="/login" />
    if (!isInitiated) return null
    const { calloutOptions, calloutVisible } = this.state

    return (
      <TradingPageLayout>
        <SidePanel>
          <Grid columns={1} alignContent="start">
            <CloseableCallout
              visible={calloutVisible}
              handleClose={this.closeCallout}
              {...calloutOptions}
            />
            <TokenSearcher />
            <OrderForm />
          </Grid>
        </SidePanel>

        <MainPanel>
          <Grid columns={1} alignContent="start">
            <OHLCV />
            <OrdersTableBox />
            <OrdersAndTradesTableBox>
              <OrderBookBox />
              <TradesTableBox />
            </OrdersAndTradesTableBox>
          </Grid>
        </MainPanel>
      </TradingPageLayout>
    )
  }
}

const TradingPageLayout = styled.div.attrs({
  className: 'trading-page-layout',
})``

const SidePanel = styled.div.attrs({
  className: 'trading-page-side-panel',
})``

const MainPanel = styled.div.attrs({
  className: 'trading-page-main-panel',
})``

const OrderBookBox = styled(OrderBook).attrs({
  className: 'trading-page-orderbook',
})``

const TradesTableBox = styled(TradesTable).attrs({
  className: 'trading-page-tradestable',
})``

const OrdersTableBox = styled(OrdersTable).attrs({
  className: 'trading-page-orderstable',
})``

const OrdersAndTradesTableBox = styled.div.attrs({
  className: 'trading-page-orders-and-trades-tables',
})``
