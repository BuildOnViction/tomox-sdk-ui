// @flow
import React from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import { Grid, Cell } from 'styled-css-grid'
import { Tabs, Tab } from '@blueprintjs/core'

import OrdersTable from '../../components/OrdersTable'
import OrderForm from '../../components/OrderForm'
// import { CloseableCallout } from '../../components/Common'
import TradesTable from '../../components/TradesTable'
// import TokenSearcher from '../../components/TokenSearcher'
import OrderBook from '../../components/OrderBook'
import TVChartRenderer from '../../components/TVChartContainer'
import DepthChart from '../../components/DepthChart'
import { DarkMode } from '../../components/Common';
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
  ohlcvData: Array<Object>,
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
    if (!this.props.isConnected
      || this.props.currentPairName === prevProps.currentPairName) {
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
    const { authenticated, isInitiated, quoteTokenSymbol } = this.props
    if (!authenticated) return <Redirect to="/login" />
    if (!isInitiated) return null
    // const { calloutOptions, calloutVisible } = this.state

    return (
      <Grid flow="row dense" 
        columns={"7.5fr minmax(520px, 4.5fr)"} 
        rows={"minmax(200px, 6fr) minmax(270px, 3fr)"} 
        gap="10px" 
        height="100%">
        <Cell className="charts-cell">
          <ChartTabs
            id="tabs-chart"
            onChange={this.handleTabsChartChange}
            selectedTabId={this.state.chartTadId}
          >
              <Tab id="tvchart" title="TradingView" panel={quoteTokenSymbol && <TVChartRenderer />} />
              <Tab id="depth" title="Depth" panel={<DepthChart />} />
          </ChartTabs>
        </Cell>
        <OrderBooxTrades>
          <Grid columns={2} height="100%" gap="20px">
            <Cell width={1}><OrderBook /></Cell>
            <Cell width={1}><TradesTable /></Cell>
          </Grid>
        </OrderBooxTrades>
        <Cell className="orders-table-cell"><OrdersTable /></Cell>
        <Cell className="order-form-cell"><OrderForm /></Cell>
      </Grid>
    )
  }
}

const OrderBooxTrades = styled(Cell).attrs({
  className: 'orderbook-trades',
})`
  box-shadow: 0 0 0 1px ${DarkMode.LIGHT_BLUE};
  padding: 10px 0;
`

const ChartTabs = styled(Tabs)`
  .bp3-tab-list {
    position: absolute;
    right: 0;
  }
`



