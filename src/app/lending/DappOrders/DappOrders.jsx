// @flow
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from "react-intl"
import 'rc-tabs/assets/index.css'
import { Link, Redirect } from "react-router-dom"
import { Icon } from '@blueprintjs/core'

import { isTomoWallet, isWeb3 } from '../../../utils/helpers'
import { Theme, TmColors } from '../../../components/Common'
import DappLendingOrdersTable from '../../../components/lending/DappLendingOrdersTable'

type State = {
  chartTadId: string,
};

export default class DappOrders extends React.PureComponent<Props, State> {
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
    if (!isTomoWallet() && !isWeb3()) return <Redirect to={`/dapp/${currentPairName.replace('/', '-')}`} />

    return (      
      <OrdersTableCell>
        <DappLendingOrdersTable />
        {/* <OrdersTableTitle><FormattedMessage id="dapp.orders" /></OrdersTableTitle> */}
        {currentPairName && <BackButton to={`/dapp/lending/${currentPairName.replace(' ', '_').replace('/', '-')}`}><Icon icon="arrow-left" color={TmColors.WHITE} /></BackButton>}
      </OrdersTableCell>
    )
  }
}

const BackButton = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  padding: 10px;
`

// const OrdersTableTitle = styled.div`
//   position: absolute;
//   top: 5px;
//   left: 50%;
//   padding: 5px 0;
//   transform: translateX(-50%);
//   font-size: ${Theme.FONT_SIZE_MD};
// `

const OrdersTableCell = styled.div`
  overflow: auto;
  font-size: ${Theme.FONT_SIZE_SM};
  position: fixed;
  background-color: ${props => props.theme.mainBg};
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 15;
  padding: 0 5px 5px 5px;
`



