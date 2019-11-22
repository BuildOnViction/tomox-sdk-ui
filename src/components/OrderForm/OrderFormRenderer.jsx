// @flow
import React from 'react'
import styled from 'styled-components'
import {
  Tabs,
  Tab,
  Button,
  InputGroup,
  Colors,
} from '@blueprintjs/core'
import { utils } from 'ethers'
import { FormattedMessage } from 'react-intl'

import type { Side, OrderType } from '../../types/orders'
import {
  MutedText,
  Theme,
  TmColors,
  SpinnerContainer,
} from '../Common'
import { BuyLimitOrderForm, SellLimitOrderForm } from '../LimitOrderForms'
import { BuyMarketOrderForm, SellMarketOrderForm } from '../MarketOrderForms'

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

const OrderFormRenderer = (props: Props) => {
  const {
    selectedTabId,
    side,
    fraction,
    priceType,
    buyPrice,
    sellPrice,
    stopPrice,
    limitPrice,
    buyAmount,
    sellAmount,
    buyMaxAmount,
    sellMaxAmount,
    buyTotal,
    sellTotal,
    makeFee,
    takeFee,
    baseTokenSymbol,
    quoteTokenSymbol,
    baseTokenDecimals,
    quoteTokenDecimals,
    baseTokenBalance,
    quoteTokenBalance,
    onInputChange,
    onInputFocus,
    onInputBlur,
    handleChangeOrderType,
    handleUnlockPair,
    handleSendOrder,
    handleDecreasePrice,
    handleIncreasePrice,
    handleDecreaseAmount,
    handleIncreaseAmount,
    errorBuy,
    errorSell,
    isShowBuyMaxAmount,
    isShowSellMaxAmount,
    buyPriceInput,
    sellPriceInput,
    buyAmountInput,
    sellAmountInput,
    authenticated,
    redirectToLoginPage,
    loading,
  } = props

  return (
    <Container>
      <OrderFormTabs 
          selectedTabId={selectedTabId} 
          onChange={handleChangeOrderType}
          renderActiveTabPanelOnly={true}>
            <Tab
              id="LO"
              title={<FormattedMessage id="exchangePage.limit" />}
              panel={
                <LimitOrderPanel
                  side={side}
                  baseTokenSymbol={baseTokenSymbol}
                  quoteTokenSymbol={quoteTokenSymbol}
                  fraction={fraction}
                  priceType={priceType}
                  buyPrice={buyPrice}
                  sellPrice={sellPrice}
                  stopPrice={stopPrice}
                  limitPrice={limitPrice}
                  buyAmount={buyAmount}
                  sellAmount={sellAmount}
                  buyMaxAmount={buyMaxAmount}
                  sellMaxAmount={sellMaxAmount}
                  buyTotal={buyTotal}
                  sellTotal={sellTotal}
                  makeFee={makeFee}
                  takeFee={takeFee}
                  baseTokenDecimals={baseTokenDecimals}
                  quoteTokenDecimals={quoteTokenDecimals}
                  baseTokenBalance={baseTokenBalance}
                  quoteTokenBalance={quoteTokenBalance}
                  onInputChange={onInputChange}
                  onInputFocus={onInputFocus}
                  onInputBlur={onInputBlur}
                  handleUnlockPair={handleUnlockPair}
                  handleSendOrder={handleSendOrder}
                  handleDecreasePrice={handleDecreasePrice}
                  handleIncreasePrice={handleIncreasePrice}
                  handleDecreaseAmount={handleDecreaseAmount}
                  handleIncreaseAmount={handleIncreaseAmount}
                  errorBuy={errorBuy}
                  errorSell={errorSell}
                  isShowBuyMaxAmount={isShowBuyMaxAmount}
                  isShowSellMaxAmount={isShowSellMaxAmount}
                  buyPriceInput={buyPriceInput}
                  sellPriceInput={sellPriceInput}
                  buyAmountInput={buyAmountInput}
                  sellAmountInput={sellAmountInput}
                  authenticated={authenticated}
                  redirectToLoginPage={redirectToLoginPage}
                />
              }
            />
            <Tab
              id="MO"
              title={<FormattedMessage id="exchangePage.market" />}
              panel={
                <MarketOrderPanel
                  side={side}
                  baseTokenSymbol={baseTokenSymbol}
                  quoteTokenSymbol={quoteTokenSymbol}
                  fraction={fraction}
                  buyAmount={buyAmount}
                  sellAmount={sellAmount}
                  buyMaxAmount={buyMaxAmount}
                  sellMaxAmount={sellMaxAmount}
                  baseTokenBalance={baseTokenBalance}
                  quoteTokenBalance={quoteTokenBalance}
                  onInputChange={onInputChange}
                  onInputFocus={onInputFocus}
                  onInputBlur={onInputBlur}
                  handleSendOrder={handleSendOrder}
                  handleDecreaseAmount={handleDecreaseAmount}
                  handleIncreaseAmount={handleIncreaseAmount}
                  errorBuy={errorBuy}
                  errorSell={errorSell}
                  isShowBuyMaxAmount={isShowBuyMaxAmount}
                  isShowSellMaxAmount={isShowSellMaxAmount}
                  buyAmountInput={buyAmountInput}
                  sellAmountInput={sellAmountInput}
                  authenticated={authenticated}
                  redirectToLoginPage={redirectToLoginPage}
                />
              }
            />
            {/* <Tab
              id="stop"
              title="Stop-Limit"
              disabled="true"
              panel={
                <StopLimitOrderPanel
                  side={side}
                  baseTokenSymbol={baseTokenSymbol}
                  quoteTokenSymbol={quoteTokenSymbol}
                  fraction={fraction}
                  priceType={priceType}
                  // price={price}
                  stopPrice={stopPrice}
                  limitPrice={limitPrice}
                  // amount={amount}
                  // maxAmount={maxAmount}
                  // total={total}
                  makeFee={makeFee}
                  takeFee={takeFee}
                  baseTokenDecimals={baseTokenDecimals}
                  quoteTokenDecimals={quoteTokenDecimals}
                  // insufficientBalance={insufficientBalance}
                  pairIsAllowed={pairIsAllowed}
                  pairAllowanceIsPending={pairAllowanceIsPending}
                  onInputChange={onInputChange}
                  handleUnlockPair={handleUnlockPair}
                  handleSendOrder={handleSendOrder}
                />
              }
            /> */}
      </OrderFormTabs>
      {loading && <SpinnerContainer />}
    </Container>
  )
}

const LimitOrderPanel = props => {
  return (
    <OrderWrapper>
      <BuyLimitOrderForm {...props} />
      <SellLimitOrderForm {...props} />
    </OrderWrapper>
  )
}

const MarketOrderPanel = props => {
  return (
    <OrderWrapper>
      <BuyMarketOrderForm {...props} />
      <SellMarketOrderForm {...props} />
    </OrderWrapper>
  )
}

//eslint-disable-next-line
const StopLimitOrderPanel = (props: *) => {
  const {
    stopPrice,
    side,
    amount,
    maxAmount,
    total,
    makeFee,
    baseTokenSymbol,
    quoteTokenSymbol,
    quoteTokenDecimals,
    insufficientBalance,
    pairIsAllowed,
    onInputChange,
    handleUnlockPair,
    handleSendOrder,
  } = props

  return (
    <React.Fragment>
      <InputBox>
        <InputLabel>
          Stop Price <MutedText>({quoteTokenSymbol})</MutedText>
        </InputLabel>
        <InputGroupWrapper
          name="stopPrice"
          onChange={onInputChange}
          value={stopPrice}
          placeholder="Stop Price"
        />
      </InputBox>
      <InputBox>
        <InputLabel>
          Limit Price <MutedText>({quoteTokenSymbol})</MutedText>
        </InputLabel>
        <InputGroupWrapper
          name="limitPrice"
          onChange={onInputChange}
          value={amount}
          placeholder="Limit Price"
          rightElement={
            <Total>
              Total: ~{total} {baseTokenSymbol}
            </Total>
          }
        />
      </InputBox>
      <InputBox>
        <InputLabel>
          Amount <MutedText>({baseTokenSymbol})</MutedText>
        </InputLabel>
        <InputGroupWrapper
          name="amount"
          onChange={onInputChange}
          value={amount}
          placeholder="Amount"
          rightElement={
            <Total>
              Total: ~{total} {quoteTokenSymbol}
            </Total>
          }
        />
      </InputBox>

      <MaxAmount>Total: ~{total} {quoteTokenSymbol}</MaxAmount>
      <MaxAmount>Max: ~{maxAmount} {baseTokenSymbol}</MaxAmount>
      {makeFee && <MaxAmount>Fee: {makeFee} {utils.formatUnits(makeFee, quoteTokenDecimals)} {quoteTokenSymbol} </MaxAmount>}

      <Button
        intent={side === 'BUY' ? 'success' : 'danger'}
        text={side}
        name="order"
        onClick={pairIsAllowed ? handleSendOrder : handleUnlockPair}
        disabled={insufficientBalance}
        fill
      />

    </React.Fragment>
  )
}

export default OrderFormRenderer

const Container = styled.div`
  position: relative;
  padding: 10px;
  height: 100%;

  .spinner-container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    cursor: not-allowed;
    background-color: rgba(31, 37, 56, .3);
  }
`

const OrderFormTabs = styled(Tabs)`
  user-select: none;

  .bp3-tab-list {
    margin-bottom: 15px;
  }

  .bp3-tab {
    color: ${props => props.theme.menuColor};
  }

  .bp3-tab:hover,
  .bp3-tab[aria-selected="true"] {
    color: ${props => props.theme.orderTableTabActive};
  }
`

const InputGroupWrapper = styled(InputGroup).attrs({
  className: "bp3-fill",
})`
  &.has-error .bp3-input {
    box-shadow: 0 0 0 1px ${TmColors.RED};
  }

  .bp3-input {
    font-size: ${Theme.FONT_SIZE_MD};
    padding-right: 50px !important; 

    &:focus {
      box-shadow: 0 0 0 1px ${TmColors.ORANGE};
    }
  }
`

const InputBox = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 10px;

  &:hover {
    .increase-decrease-box {
      display: flex !important;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  .bp3-input-group.bp3-fill {
    width: calc(100% - 60px);
  }
`

const InputLabel = styled.div`
  height: 100%;
  width: 60px;
  margin: auto;
  margin-right: 10px;
  user-select: none;
`

const Total = styled.div`
  color: ${Colors.GRAY3};
  margin: auto;
  height: 100%;
  padding-top: 8px;
  padding-right: 4px;
`

const MaxAmount = styled.div`
  display: flex;
  color: ${Colors.GRAY3}
  font-size: 11px;
  justify-content: flex-end;
  padding-bottom: 5px;
  `

const OrderWrapper = styled.div.attrs({
  className: 'order-wrapper',
})``