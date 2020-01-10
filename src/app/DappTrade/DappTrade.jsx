// @flow
import React from 'react'
import styled from 'styled-components'
import { Grid, Cell } from 'styled-css-grid'
import { Icon } from '@blueprintjs/core'
import 'rc-tabs/assets/index.css'
import { default as RcTabs, TabPane } from 'rc-tabs'
import TabContent from 'rc-tabs/lib/TabContent'
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar'
import { Link, Redirect } from "react-router-dom"

import { isTomoWallet } from '../../utils/helpers'
import { Theme, TmColors } from '../../components/Common'
import OrderForm from '../../components/OrderForm'
import TradesTable from '../../components/TradesTable'
import OrderBook from '../../components/OrderBook'

type State = {
  chartTadId: string,
};

export default class DappOrderPlace extends React.PureComponent<Props, State> {
  state = {
    chartTadId: 'tvchart',
  }

  componentDidMount() {
    if (this.props.isConnected) {
      this.props.queryDappTradePageData()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if ((!prevProps.isConnected && this.props.isConnected)
      || (this.props.currentPairName !== prevProps.currentPairName)
      || (this.props.authenticated && !prevProps.authenticated)) {
      this.props.queryDappTradePageData()
    }
  }

  componentWillUnmount() {
    this.props.releaseResources()
  }

  handleTabsChartChange = (tabId) => this.setState({chartTadId: tabId})

  render() {
    const { currentPairName } = this.props
    if (!isTomoWallet()) return <Redirect to={`/dapp/${currentPairName.replace('/', '-')}`} />

    return (     
      <OrderFormCell isShow={true}>
        <Grid flow="column" 
          columns={"1fr"} 
          rows={"auto 500px"} 
          gap="10px" 
          height="100%">
          <Cell><OrderForm /></Cell>
          <OrdersTradesCell><OrdersTradesTabs /></OrdersTradesCell>
        </Grid>
        <BackButton to={`/dapp/${currentPairName.replace('/', '-')}`}><Icon icon="arrow-left" color={TmColors.WHITE} /></BackButton>
      </OrderFormCell>
    )
  }
}

const OrdersTradesTabs = _ => (
  <TabsStyled
    defaultActiveKey="1"
    onChange={() => {}}
    renderTabBar={()=><ScrollableInkTabBar />}
    renderTabContent={()=><TabContent />}>            
    <TabPane tab='Book' key="1"><OrderBook /></TabPane>  
    <TabPane tab='Market Trades' key="2"><TradesTable /></TabPane>  
  </TabsStyled>
)

const BackButton = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  padding: 10px;
`

const OrderFormCell = styled(Cell).attrs({
  className: 'order-form-cell',
})`
  display: ${props => props.isShow ? 'block' : 'none'};
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

  .bp3-tab-list {
    justify-content: flex-end;
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

const TabsStyled = styled(RcTabs)`
  box-shadow: 0 0 0 1px ${props => props.theme.border};

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

const OrdersTradesCell = styled(Cell)`
  padding: 10px;
`



