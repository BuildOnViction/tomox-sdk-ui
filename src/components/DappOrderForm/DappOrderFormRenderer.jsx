// @flow
import React from 'react'
import styled from 'styled-components'
import {
  Tabs,
  Tab,
  Button,
  MenuItem,
  Position,
} from '@blueprintjs/core'
import { Select } from "@blueprintjs/select"
import { FormattedMessage } from "react-intl"

import type { Side, OrderType } from '../../types/orders'
import {
  Theme,
  SpinnerContainer,
  TmColors,
} from '../Common'
import { DappBuyLimitOrderForm, DappSellLimitOrderForm } from '../LimitOrderForms'
import { DappBuyMarketOrderForm, DappSellMarketOrderForm } from '../MarketOrderForms'

type Props = {
  selectedTabId: OrderType,
  side: Side,
  fraction: number,
  priceType: string,
  buyPrice: string,
  sellPrice: string,
  stopPrice: string,
  limitPrice: string,
  buyAmount: string,
  sellAmount: string,
  maxAmount: string,
  buyTotal: string,
  sellTotal: string,
  makeFee: string,
  takeFee: string,
  baseTokenSymbol: string,
  quoteTokenSymbol: string,
  baseTokenDecimals: number,
  quoteTokenDecimals: number,
  isOpen: boolean,
  authenticated: boolean,
  onInputChange: Object => void,
  handleChangeOrderType: string => void,
  handleUnlockPair: (string, string) => void,
  toggleCollapse: (SyntheticEvent<>) => void,
  handleSendOrder: void => void,
  handleSideChange: SIDE => void,
}

const ORDER_TYPES = {
  lo: {id: 'LO', title: 'Limit'}, 
  mo: {id: 'MO', title: 'Market'},
}

const renderCollateral = (type, { handleClick, modifiers }) => {
  
  return (
      <MenuItem
        key={type.id}
        onClick={(item) => handleClick(item.id)}
        text={type.title}
      />
  )
} 

const OrderFormRenderer = (props: Props) => {
  const {
    selectedTabId,
    loading,
    handleChangeOrderType,
  } = props

  return (
    <Container>
      <StyledSelect 
        itemRenderer={renderCollateral} 
        items={Object.values(ORDER_TYPES)} 
        onItemSelect={handleChangeOrderType}
        filterable={false}
        popoverProps={{minimal: true, usePortal: false, position: Position.BOTTOM_LEFT}}>

        <StyledButton 
          rightIcon="caret-down"
          text={ORDER_TYPES[selectedTabId.toLowerCase()].title} />
      </StyledSelect>
      { (selectedTabId === 'LO') && <LimitOrderPanel {...props} /> }
      { (selectedTabId === 'MO') && <MarketOrderPanel {...props} /> }
      {loading && <SpinnerContainer />}
    </Container>
  )
}

const LimitOrderPanel = props => {
  return (
    <Tabs id="lo-order-tabs">
      <Tab id="lo-buy" title={<FormattedMessage id="exchangePage.buy" />} panel={<DappBuyLimitOrderForm {...props} />} />
      <Tab id="lo-sell" title={<FormattedMessage id="exchangePage.sell" />} panel={<DappSellLimitOrderForm {...props} />} />
    </Tabs>
  )
}

const MarketOrderPanel = props => {
  return (
    <Tabs id="mo-order-tabs">
      <Tab id="mo-buy" title={<FormattedMessage id="exchangePage.buy" />} panel={<DappBuyMarketOrderForm {...props} />} />
      <Tab id="mo-sell" title={<FormattedMessage id="exchangePage.sell" />} panel={<DappSellMarketOrderForm {...props} />} />
    </Tabs>
  )
}

export default OrderFormRenderer

const Container = styled.div`
  position: relative;
  padding: 0 10px;

  .spinner-container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    cursor: not-allowed;
    background-color: rgba(31, 37, 56, .3);
  }

  .bp3-tab-list .bp3-tab {
    font-size: ${Theme.FONT_SIZE_SM};
    padding-right: 60px !important;
    margin-bottom: 7px;
  }
`

const StyledSelect = styled(Select)`
    &.bp3-popover-wrapper,
    .bp3-popover-target {
      display: block;
      width: 100%;
    }

    .bp3-menu {
      color: ${props => props.theme.selectColor};
      background-color: ${props => props.theme.selectBackground} !important;

      > li:not(:last-child) {
        border-bottom: 1px solid ${TmColors.DARK_BLUE};
      }
    }

    .bp3-menu-item {
      padding: 7px;
    }
`

const StyledButton = styled(Button)`
  &.bp3-button {
    display: flex;
    justify-content: space-between;
    color: ${TmColors.ORANGE} !important;
    font-size: ${Theme.FONT_SIZE_SM};
    padding: 0 !important;
    margin-bottom: 10px;
    min-height: unset;
    box-shadow: none !important;
    background-image: none !important;
    background-color: transparent !important;
  }
`

