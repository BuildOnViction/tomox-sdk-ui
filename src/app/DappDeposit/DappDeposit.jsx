// @flow
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blueprintjs/core'

import { Theme } from '../../components/Common'

import DappWelcome from '../../components/DappWelcome'
import DappDepositContent from '../../components/DappDepositContent'

export default function DappFund({ authenticated, history }) {
  if (!authenticated) return (<OrdersTableCell><DappWelcome /></OrdersTableCell>)

  return (
    <OrdersTableCell>
      <Header>
        <BackButton 
          icon="arrow-left"
          onClick={() => history.goBack()}
        />
        <FormattedMessage id="portfolioPage.deposit" />
      </Header>
      <DappDepositContent />
    </OrdersTableCell>
  )
}

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
  padding: 45px 0 55px 0;
`


const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 10px;
  height: 35px;
  background-color: #2d3650;
  font-size: ${Theme.FONT_SIZE_MD};
`

const BackButton = styled(Icon)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
`



