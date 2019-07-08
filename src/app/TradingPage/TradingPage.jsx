// @flow
import React from 'react'
import styled from 'styled-components'
// import { Redirect } from 'react-router-dom'
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
import { Theme } from '../../components/Common'
import arrowDownOrangeUrl from '../../assets/images/arrow_down_orange.svg'
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
    if ((!prevProps.isConnected && this.props.isConnected)
      || (this.props.currentPairName !== prevProps.currentPairName)) {
      this.props.queryTradingPageData()
    }
  }

  componentWillUnmount() {
    this.props.releaseResources()
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
    const { quoteTokenSymbol } = this.props
    // if (!authenticated) return <Redirect to="/unlock" />
    // if (!isInitiated) return null
    // const { calloutOptions, calloutVisible } = this.state

    return (
      <Grid flow="row dense" 
        columns={"7.5fr minmax(520px, 4.5fr)"} 
        rows={"minmax(200px, 6fr) minmax(270px, 3fr)"} 
        gap="10px" 
        height="100%">
        <ChartsCell>
          <ChartTabs
            id="tabs-chart"
            onChange={this.handleTabsChartChange}
            selectedTabId={this.state.chartTadId}
          >
              <Tab id="tvchart" title="TradingView" panel={quoteTokenSymbol && <TVChartRenderer />} />
              <Tab id="depth" title="Depth" panel={<DepthChart />} />
          </ChartTabs>
        </ChartsCell>
        <OrderBooxTrades>
          <Grid columns={2} height="100%" gap="20px">
            <Cell width={1}><OrderBook /></Cell>
            <Cell width={1}><TradesTable /></Cell>
          </Grid>
        </OrderBooxTrades>
        <OrdersTableCell><OrdersTable /></OrdersTableCell>
        <OrderFormCell><OrderForm /></OrderFormCell>
      </Grid>
    )
  }
}

const OrderBooxTrades = styled(Cell).attrs({
  className: 'orderbook-trades',
})`
  box-shadow: 0 0 0 1px ${props => props.theme.border};
  padding: 10px 0;
`

const ChartsCell = styled(Cell).attrs({
  className: 'charts-cell',
})`
  box-shadow: 0 0 0 1px ${props => props.theme.border};

  .bp3-tabs {
    height: 100%;
    position: relative;
  }

  .bp3-tab {
    font-size: $tm-font-size-sm;
    margin-right: 30px;
    &:last-child {
      margin-right: 0;
    }
  }

  .bp3-tab-list {
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
    padding: 0 20px;
  }

  .bp3-tab-panel {
    margin-top: 0;
    height: 100%;
  }

  #bp3-tab-panel_tabs-chart_depth {
    padding-top: 30px;
  }

  .bp3-tab[aria-selected=true], 
  .bp3-tab:not([aria-disabled=true]):hover {
    color: ${props => props.theme.active};
  }
`

const OrdersTableCell = styled(Cell).attrs({
  className: 'orders-table-cell',
})`
  padding: 10px 0;
  box-shadow: 0 0 0 1px ${props => props.theme.border};
  font-size: ${Theme.FONT_SIZE_SM};

  .bp3-tabs {
    height: 100%;
  }

  .bp3-tab-list {
    padding: 0 10px;
  }

  .bp3-tab-panel {
    margin-top: 0;
    padding-top: 15px;
    height: calc(100% - 19px);
  }

  .bp3-tab {
    line-height: initial;
  }

  .bp3-tab-list > *:not(:last-child) {
    margin-right: 0;
    padding-right: 50px;
  }

  .bp3-tab[aria-selected=true], 
  .bp3-tab:not([aria-disabled=true]):hover {
    color: ${props => props.theme.orderTableTabActive};
  }

  .list-container {
    height: 100%;
    .header {
      box-shadow: 0 1px 0 0 ${props => props.theme.border};
      padding: 0 10px 10px 10px;
      .cancel-btn {
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover {
          color: ${props => props.theme.active};
          .arrow-down {
            margin-bottom: 0;
            background: url(${arrowDownOrangeUrl}) no-repeat center center;
          }
        }   
      }
    }
  } 
`

const OrderFormCell = styled(Cell).attrs({
  className: 'order-form-cell',
})`
  box-shadow: 0 0 0 1px ${props => props.theme.border};
  padding: 10px;
  overflow: auto;
  font-size: ${Theme.FONT_SIZE_SM};

  .bp3-tab {
    line-height: initial;
  }

  .bp3-tab-list > *:not(:last-child) {
    margin-right: 0;
    padding-right: 40px;
  }

  .bp3-input {
    border-radius: initial;
    box-shadow: initial;
    background: ${props => props.theme.subBg};
    color: ${props => props.theme.textTable};
  }

  .buy-btn,
  .sell-btn {
    border-radius: initial;
    box-shadow: initial;
  }

  .buy-btn {
    background: #00c38c;
  }

  .sell-btn {
    background: #f94d5c;
  }

  .order-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;

    label.bp3-label {
      margin-top: -5px;
      margin-bottom: 0;
    }

    &:after {
      content: "";
      position: absolute;
      top: 5px;
      right: 50%;
      height: 80%;
      border-right: 1px solid ${props => props.theme.border};
    }

    .buy-side,
    .sell-side {
      width: calc(50% - 12px);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .base-token {
        font-size: ${Theme.FONT_SIZE_MD};
      }
    }
  }
`

const ChartTabs = styled(Tabs)`
  .bp3-tab-list {
    position: absolute;
    right: 0;
  }
`



