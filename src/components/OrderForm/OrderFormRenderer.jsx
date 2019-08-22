// @flow
import React from 'react'
import styled from 'styled-components'
import {
  Tabs,
  Tab,
  Button,
  InputGroup,
  Label,
  Colors,
} from '@blueprintjs/core'
import { utils } from 'ethers'

import type { SIDE } from '../../types/orderForm'

import {
  MutedText,
  Theme,
  DarkMode,
} from '../Common'
import { BuyLimitOrderForm, SellLimitOrderForm } from '../LimitOrderForms'

type Props = {
  selectedTabId: string,
  side: 'BUY' | 'SELL',
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
  loggedIn: boolean,
  insufficientBalance: boolean,
  pairIsAllowed: boolean,
  pairAllowanceIsPending: boolean,
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
    loggedIn,
    insufficientBalanceToBuy,
    insufficientBalanceToSell,
    pairIsAllowed,
    pairAllowanceIsPending,
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
  } = props

  return (
    <OrderFormTabs 
        selectedTabId={selectedTabId} 
        onChange={handleChangeOrderType}>
          <Tab
            id="limit"
            title="Limit"
            panel={
              <LimitOrderPanel
                loggedIn={loggedIn}
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
                insufficientBalanceToBuy={insufficientBalanceToBuy}
                insufficientBalanceToSell={insufficientBalanceToSell}
                pairIsAllowed={pairIsAllowed}
                pairAllowanceIsPending={pairAllowanceIsPending}
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
            id="market"
            title="Market"
            disabled="true"
            panel={
              <MarketOrderPanel
                loggedIn={loggedIn}
                side={side}
                baseTokenSymbol={baseTokenSymbol}
                quoteTokenSymbol={quoteTokenSymbol}
                fraction={fraction}
                priceType={priceType}
                // price={price} //Todo: First step I resolve for only limit order
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
          />
          {/* <Tab
            id="stop"
            title="Stop-Limit"
            disabled="true"
            panel={
              <StopLimitOrderPanel
                loggedIn={loggedIn}
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

const MarketOrderPanel = (props: *) => {
  const {
    side,
    price,
    amount,
    maxAmount,
    fraction,
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
          Price <MutedText>({quoteTokenSymbol})</MutedText>
        </InputLabel>
        <InputGroupWrapper
          name="price"
          onChange={onInputChange}
          placeholder={price}
          disabled
        />
      </InputBox>
      <InputBox>
        <InputLabel>
          Amount <MutedText>({baseTokenSymbol})</MutedText>
        </InputLabel>
        <InputGroupWrapper
          name="amount"
          value={amount}
          placeholder="Amount"
          onChange={onInputChange}
          rightElement={
            <Total>
              Total: ~{total} {quoteTokenSymbol}
            </Total>
          }
        />
      </InputBox>
      <RadioButtonsWrapper>
        <RadioButton
          value={25}
          fraction={fraction}
          onInputChange={onInputChange}
        />
        <RadioButton
          value={50}
          fraction={fraction}
          onInputChange={onInputChange}
        />
        <RadioButton
          value={75}
          fraction={fraction}
          onInputChange={onInputChange}
        />
        <RadioButton
          value={100}
          fraction={fraction}
          onInputChange={onInputChange}
        />
      </RadioButtonsWrapper>

      {total && <MaxAmount>Total: ~{total} {quoteTokenSymbol}</MaxAmount>}
      {maxAmount && <MaxAmount>Max: ~{maxAmount} {baseTokenSymbol}</MaxAmount>}
      {makeFee && <MaxAmount>Fee: {utils.formatUnits(makeFee, quoteTokenDecimals)} {quoteTokenSymbol}</MaxAmount>}

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

const RadioButton = props => {
  const { onInputChange, value } = props
  return (
    <RadioButtonBox>
      <span>{value}%</span>
      <InputGroup name="fraction" type="radio" onChange={onInputChange} value={value} />
    </RadioButtonBox>
  )
}

export default OrderFormRenderer

const OrderFormTabs = styled(Tabs)`
  user-select: none;

  .bp3-tab-list {
    margin-bottom: 15px;
  }

  .bp3-tab {
    color: ${props => props.theme.orderTableTabActive};
  }

  .bp3-tab:hover,
  .bp3-tab[aria-selected="true"] {
    color: ${props => props.theme.orderTableTabActive};
  }
`

const RadioButtonsWrapper = styled.div`
  width: calc(100% - 60px);
  padding-left: 8px;
  margin-left: auto;
  display: flex;
  justify-content: space-between;
`

const RadioButtonBox = styled(Label)`
  min-width: 35px;
  width: 15%;
  padding: 5px 0;
  text-align: center;
  cursor: pointer;
  input.bp3-input {
    opacity: 0;
    width: 0px;
    height: 0;
    margin: 0px;
  }
  .bp3-input-group {
    width: 0px;
    height: 0;
  }
  &:first-child {
    text-align: left;
  }
  &:last-child {
    text-align: right;
  }
  span {
    height: 17px;
  }
  &:hover span {
    color: #fff;
  }
`

const InputGroupWrapper = styled(InputGroup).attrs({
  className: "bp3-fill",
})`
  &.has-error .bp3-input {
    box-shadow: 0 0 0 1px ${DarkMode.RED};
  }

  .bp3-input {
    font-size: ${Theme.FONT_SIZE_MD};
    padding-right: 50px !important; 

    &:focus {
      box-shadow: 0 0 0 1px ${DarkMode.ORANGE};
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
    }import { BuyLimitOrderForm } from '../LimitOrderForms/BuyLimitOrderForm';
import SellLimitOrderForm from '../LimitOrderForms/SellLimitOrderForm';
import SellLimitOrderForm from '../LimitOrderForms/SellLimitOrderForm';

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