// @flow
import React from 'react'
import styled from 'styled-components'
import { Grid, Cell } from 'styled-css-grid'
import 'rc-tabs/assets/index.css'
import { Link } from "react-router-dom"
import { Icon } from '@blueprintjs/core'

import { Theme } from '../../../components/Common'

import DappLendingOrderForm from '../../../components/lending/DappLendingOrderForm'
import LendingTradesTable from '../../../components/lending/LendingTradesTable'
import DappLendingOrderBook from '../../../components/lending/DappLendingOrderBook'
import { FormattedMessage } from 'react-intl'

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

    return (     
      <OrderFormCell isShow={true}>
        <Grid flow="column" 
          columns={"1fr"} 
          rows={"400px 500px"} 
          gap="10px" 
          height="100%">
            <Grid flow="row" 
              columns={"6fr 5fr"} 
              gap="0px" 
              height="100%">
              <Cell><DappLendingOrderForm /></Cell>
              <Cell><DappLendingOrderBook /></Cell>
            </Grid>
          <Cell>
            <Title><FormattedMessage id="dapp.marketContracts" /></Title>
            <LendingTradesTable />
          </Cell>
        </Grid>

        {currentPairName && 
          (<Header>
            <Pair to="/dapp/lending/pairs">
              <PairName>{currentPairName}</PairName>
              <Icon icon="caret-down" />
            </Pair>

            <OrdersLink to="/dapp/lending/orders">
              <i className="fa fa-file-text-o" aria-hidden="true"></i>
              <Typo><FormattedMessage id="dapp.orders" /></Typo>
            </OrdersLink>
          </Header>)}
      </OrderFormCell>
    )
  }
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
  padding: 0 10px;
  height: 40px;
  background-color: #1f2538;
`

const Pair = styled(Link)`
  font-size: ${Theme.FONT_SIZE_SM};
  font-weight: bold;
  color: #6e7793;
`

const PairName = styled.span`
  margin-right: 5px;
`

const OrdersLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #6e7793;
`

const Typo = styled.span`
  margin-left: 3px;
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
  z-index: 15;
  padding-top: 45px;

  .bp3-tab {
    line-height: initial;
  }

  .bp3-tab-list {
    margin-bottom: 12px;
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

const Title = styled.div`
  color: #fff;  
  padding: 12px 10px;
  margin-bottom: 5px;
  background-color: #1f2538;
`



