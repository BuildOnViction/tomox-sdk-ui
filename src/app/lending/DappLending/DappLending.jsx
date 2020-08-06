// @flow
import React from 'react'
import styled from 'styled-components'
import { Grid, Cell } from 'styled-css-grid'
import { Icon } from '@blueprintjs/core'
import { FormattedMessage } from "react-intl"
import 'rc-tabs/assets/index.css'
import { default as RcTabs, TabPane } from 'rc-tabs'
import TabContent from 'rc-tabs/lib/TabContent'
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar'

import { Theme, TmColors } from '../../../components/Common'
import arrowDownOrangeUrl from '../../../assets/images/arrow_down_orange.svg'

import LendingTradesTable from '../../../components/lending/LendingTradesTable'
import LendingOrderBook from '../../../components/lending/LendingOrderBook'
import LendingTvChart from '../../../components/lending/LendingTvChart'

type State = {
  isShowOrderForm: boolean,
  isShowOrdersTable: boolean,
};

export default class Dapp extends React.PureComponent<Props, State> {
  state = {
    isShowHelpPanel: false,
  }

  componentDidMount() {
    if (this.props.isConnected) {
      this.props.queryTradingPageData()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if ((!prevProps.isConnected && this.props.isConnected)
      || (this.props.currentPair.pair !== prevProps.currentPair.pair)
      || (this.props.authenticated && !prevProps.authenticated)) {
      this.props.queryTradingPageData()
    }
  }

  componentWillUnmount() {
    this.props.releaseResources()
  }

  handleTabsChartChange = (tabId) => this.setState({chartTadId: tabId})

  toggleHelpPanel = (value: boolean) => this.setState({isShowHelpPanel: value})

  render() {
    const { isShowHelpPanel } = this.state

    return (
      <Grid flow="column" 
        columns={"1fr"} 
        rows={"300px 500px 55px"} 
        gap="10px" 
        height="100%">
        <ChartsCell>
          <LendingTvChart match={this.props.match} />
        </ChartsCell>

        <OrdersTradesCell>
          <OrdersTradesTabs />
        </OrdersTradesCell>

        {isShowHelpPanel && <HelpPanel togglePanel={this.toggleHelpPanel} />}
      </Grid>
    )
  }
}

const HelpPanel = ({togglePanel}) => {
  return (
    <HelpPanelContainer>
      <Instruction><FormattedMessage id="dapp.instruction" /></Instruction>
      <ExternalLinksGroup>
        <ExternalLink target="_blank" href="https://apps.apple.com/us/app/tomo-wallet/id1436476145">
          <i className="fa fa-apple" aria-hidden="true" />
          <FormattedMessage id="dapp.appStore" />
        </ExternalLink>
        <Divider><FormattedMessage id="dapp.or" /></Divider>
        <ExternalLink target="_blank" href="https://play.google.com/store/apps/details?id=com.tomochain.wallet&hl=en_US">
          <GoolgePlayIcon className="fa fa-android" aria-hidden="true" />
          <FormattedMessage id="dapp.googleStore" />
        </ExternalLink>
      </ExternalLinksGroup>
      <Close icon="cross" intent="danger" onClick={() => togglePanel(false)} />
    </HelpPanelContainer>
  )
}

const OrdersTradesTabs = _ => (
  <MainTabs
    defaultActiveKey="1"
    onChange={() => {}}
    renderTabBar={()=><ScrollableInkTabBar />}
    renderTabContent={()=><TabContent />}>            
    <TabPane tab={<FormattedMessage id="dapp.spot.book" />} key="1"><LendingOrderBook /></TabPane>  
    <TabPane tab={<FormattedMessage id="dapp.marketContracts" />} key="2"><LendingTradesTable /></TabPane>  
  </MainTabs>
)


const HelpPanelContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 110;
  background: ${props => props.theme.mainBg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Instruction = styled.div`
  padding: 0 10px;
  text-align: center;
  line-height: 1.7em;
`

const ExternalLinksGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 15px;
`

const Divider = styled.div`
  margin: 10px auto;
`

const ExternalLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 70%;
  max-width: 250px;
  color: ${TmColors.WHITE};
  background: ${TmColors.LIGHT_BLUE};
  border-radius: 10px;

  i {
    margin-right: 5px;
  }
`

const GoolgePlayIcon = styled.i`
  color: ${TmColors.LIGHT_GREEN};
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

const Close = styled(Icon)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
`



