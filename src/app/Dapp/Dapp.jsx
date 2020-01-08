// @flow
import React from 'react'
import styled from 'styled-components'
import { Grid, Cell } from 'styled-css-grid'
import { Tabs, Tab, Icon } from '@blueprintjs/core'
import { FormattedMessage } from "react-intl"
import 'rc-tabs/assets/index.css'
import { default as RcTabs, TabPane } from 'rc-tabs'
import TabContent from 'rc-tabs/lib/TabContent'
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar'
import { Link } from "react-router-dom"

import TradesTable from '../../components/TradesTable'
import OrderBook from '../../components/OrderBook'
import TVChartRenderer from '../../components/TVChartContainer'
import DepthChart from '../../components/DepthChart'
import { Theme, TmColors } from '../../components/Common'
import arrowDownOrangeUrl from '../../assets/images/arrow_down_orange.svg'

type State = {
  chartTadId: string,
  isShowOrderForm: boolean,
  isShowOrdersTable: boolean,
};

export default class Dapp extends React.PureComponent<Props, State> {
  state = {
    chartTadId: 'tvchart',
    isShowOrderForm: false,
    isShowOrdersTable: false,
  }

  componentDidMount() {
    if (this.props.isConnected) {
      this.props.queryTradingPageData()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if ((!prevProps.isConnected && this.props.isConnected)
      || (this.props.currentPairName !== prevProps.currentPairName)
      || (this.props.authenticated && !prevProps.authenticated)) {
      this.props.queryTradingPageData()
    }
  }

  componentWillUnmount() {
    this.props.releaseResources()
  }

  handleTabsChartChange = (tabId) => this.setState({chartTadId: tabId})

  render() {
    const { quoteTokenSymbol, currentPairName } = this.props

    return (      
      <Grid flow="column" 
        columns={"1fr"} 
        rows={"300px 500px 55px"} 
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

        <OrdersTradesCell>
          <OrdersTradesTabs />
        </OrdersTradesCell>

        <FooterCell>
          {<ButtonGroup pair={currentPairName} />}
        </FooterCell>
      </Grid>
    )
  }
}

const OrdersTradesTabs = _ => (
  <MainTabs
    defaultActiveKey="1"
    onChange={() => {}}
    renderTabBar={()=><ScrollableInkTabBar />}
    renderTabContent={()=><TabContent />}>            
    <TabPane tab='Book' key="1"><OrderBook /></TabPane>  
    <TabPane tab='Market Trades' key="2"><TradesTable /></TabPane>  
  </MainTabs>
)

const ButtonGroup = (props) => {
  const { pair } = props

  return (
    <ButtonGroupBox>
      <OrdersButton to="/dapp/orders">
        <Icon icon="document" />
        <span>Orders</span>
      </OrdersButton>
      <OrderFormButtonGroup>
        <BuyButton to={`/dapp/trade/${pair.replace('/', '-')}`}><FormattedMessage id="exchangePage.buy" /></BuyButton>
        <SellButton to={`/dapp/trade/${pair.replace('/', '-')}`}><FormattedMessage id="exchangePage.sell" /></SellButton>
      </OrderFormButtonGroup>
    </ButtonGroupBox>
  )
}

const StyledButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40px;
  user-select: none;
  height: 40px;
  min-width: 45%;
  color: ${TmColors.WHITE};
`

const BuyButton = styled(StyledButton)`
  background: ${TmColors.GREEN};
`

const SellButton = styled(StyledButton)`
  background: ${TmColors.RED};
`

const OrderFormButtonGroup = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  width: 230px;
`

const OrdersButton = styled(Link)`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-flow: column;
  flex-grow: 2;
  padding: 0 10px;
  font-size: ${Theme.FONT_SIZE_SM};
  color: ${TmColors.GRAY};

  span {
    user-select: none;
  }

  span:first-child {
    margin-bottom: 3px;
  }
`

const ButtonGroupBox = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 50px;
  background-color: ${props => props.theme.menuBgHover};
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 20;
  padding: 0 5px; 
`

const FooterCell = styled.div`
  height: 55px;
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

const OrdersTradesCell = styled(Cell).attrs({
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
    padding: 8px 25px;
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



