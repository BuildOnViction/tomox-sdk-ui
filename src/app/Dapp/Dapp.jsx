// @flow
import React from 'react'
import styled from 'styled-components'
import { Grid, Cell } from 'styled-css-grid'
import { Tabs, Tab, Button, Icon } from '@blueprintjs/core'
import { FormattedMessage } from "react-intl"
import 'rc-tabs/assets/index.css'
import { default as RcTabs, TabPane } from 'rc-tabs'
import TabContent from 'rc-tabs/lib/TabContent'
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar'

import OrdersTableMobile from '../../components/OrdersTableMobile'
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

export default class Dapp extends React.PureComponent<Props, State> {
  state = {
    chartTadId: 'tvchart',
    isShowOrderForm: false,
  }

  componentDidMount() {
    if (this.props.isConnected) {
      this.props.queryTradingPageData()
    }
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

  handleTabsChartChange = (tabId) => this.setState({chartTadId: tabId})

  toggleOrderForm = () => {
    this.setState({
      isShowOrderForm: !this.state.isShowOrderForm,
    })
  }

  render() {
    const { quoteTokenSymbol } = this.props
    const { isShowOrderForm } = this.state
    // if (!isInitiated) return null

    return (      
      <Grid flow="row" 
        columns={"1fr"} 
        rows={"340px 480px"} 
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

        <OrdersTableCell>
          <MainTabs
            defaultActiveKey="1"
            onChange={() => {}}
            renderTabBar={()=><ScrollableInkTabBar />}
            renderTabContent={()=><TabContent />}>            
            <TabPane tab='Orderbook' key="1"><OrderBook /></TabPane>  
            <TabPane tab='Trades History' key="2"><TradesTable /></TabPane>  
            <TabPane tab='Orders' key="3"><OrdersTableMobile /></TabPane>       
          </MainTabs>
        </OrdersTableCell>

        { isShowOrderForm && (
          <OrderFormCell>
            <OrderForm />
            <Close icon="cross" intent="danger" onClick={this.toggleOrderForm} />
          </OrderFormCell>
        )}

        { !isShowOrderForm && (<ButtonGroup onClick={this.toggleOrderForm} />) }
      </Grid>
    )
  }
}

const ButtonGroup = (props) => {
  return (
    <ButtonGroupBox>
      <BuyButton 
        intent="success"
        text={<FormattedMessage id="exchangePage.buy" />}
        name="order"
        onClick={props.onClick}
      />
      <SellButton
        intent="danger"
        text={<FormattedMessage id="exchangePage.sell" />}
        name="order"
        onClick={props.onClick}
      />
    </ButtonGroupBox>
  )
}

const StyledButton = styled(Button)`
  padding: 0 50px;
  box-shadow: unset !important;
  background-image: unset !important;
  border-radius: 0 !important;
  min-height: 40px;
`

const BuyButton = styled(StyledButton).attrs({
  className: "buy-btn",
})``

const SellButton = styled(StyledButton).attrs({
  className: "sell-btn",
})``

const ButtonGroupBox = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 50px;
  background-color: ${props => props.theme.mainBg};
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 20;
`

const Close = styled(Icon)`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  padding: 10px;
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
  padding: 10px 0 0 0 !important;
  margin-bottom: 53px;
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
  overflow: auto;
  font-size: ${Theme.FONT_SIZE_SM};
  position: fixed;
  background-color: ${props => props.theme.mainBg};
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 30;

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

const MainTabs = styled(RcTabs)`
  &.rc-tabs-top {
    border-bottom: none;
    height: 100%;
  }

  .rc-tabs-content {
    margin-top: 12px;
    height: calc(100% - 40px);
  }

  .rc-tabs-nav-wrap .rc-tabs-tab-active {
    color: ${props => props.theme.active};
  }

  .rc-tabs-nav-wrap .rc-tabs-tab {
    font-size: ${Theme.FONT_SIZE_MD};
    padding: 8px 10px;
    margin-right: 0;
    user-select: none;
  }

  .rc-tabs-nav-wrap .rc-tabs-ink-bar {
    background-color: ${props => props.theme.active};
  }

  .rc-tabs-bar {
    border-bottom: 1px solid ${props => props.theme.border} !important;
  }
`



