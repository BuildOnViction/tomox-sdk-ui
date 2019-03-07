// @flow
import React from 'react'
import styled from 'styled-components'
import {
  Tabs,
  Tab,
  Card,
  Button,
  InputGroup,
  Label,
  Colors,
  Collapse,
  Spinner,
} from '@blueprintjs/core'
import { utils } from 'ethers'
import { HeaderText } from '../Common/Text'

import type { SIDE } from '../../types/orderForm'

import {
  MutedText,
  RedGlowingButton,
  GreenGlowingButton,
  FlexRow,
  Box,
} from '../Common'
import { renderFilteredItems } from '@blueprintjs/select';

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
    isOpen,
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
    handleChangeOrderType,
    handleUnlockPair,
    toggleCollapse,
    handleSendOrder,
  } = props

  return (
    <Wrapper className="order-form">
      <OrderFormHeader>
        <ButtonRow>
          <Button
            text="Limit"
            minimal
            onClick={() => handleChangeOrderType('limit')}
            active={selectedTabId === 'limit'}
            intent={selectedTabId === 'limit' ? 'primary' : ''}
          />
          <Button
            text="Market"
            disabled
            minimal
            onClick={() => handleChangeOrderType('market')}
            active={selectedTabId === 'market'}
            intent={selectedTabId === 'market' ? 'primary' : ''}
          />
          <Button icon={isOpen ? 'chevron-up' : 'chevron-down'} minimal onClick={toggleCollapse} />
        </ButtonRow>
      </OrderFormHeader>
      <Collapse isOpen={isOpen}>
        <Tabs selectedTabId={selectedTabId}>
          <Tab
            id="limit"
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
                handleUnlockPair={handleUnlockPair}
                handleSendOrder={handleSendOrder}
              />
            }
          />
          <Tab
            id="market"
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
          <Tab
            id="stop"
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
          />
        </Tabs>
      </Collapse>
    </Wrapper>
  )
}

const FractionList = (props) => {
  const { side, fraction, onInputChange } = props

  return (
    <React.Fragment>
      <RadioButtonsWrapper>
        <RadioButton
          value={25}
          fraction={fraction}
          onInputChange={(e) => onInputChange(side, e)}
        />
        <RadioButton
          value={50}
          fraction={fraction}
          onInputChange={(e) => onInputChange(side, e)}
        />
        <RadioButton
          value={75}
          fraction={fraction}
          onInputChange={(e) => onInputChange(side, e)}
        />
        <RadioButton
          value={100}
          fraction={fraction}
          onInputChange={(e) => onInputChange(side, e)}
        />
      </RadioButtonsWrapper>
    </React.Fragment>  
  )
}

const BuyLimitOrderPanel = (props) => {
  const {
    buyPrice,
    side,
    buyAmount,
    buyMaxAmount,
    fraction,
    buyTotal,
    makeFee,
    baseTokenSymbol,
    quoteTokenSymbol,
    quoteTokenDecimals,
    insufficientBalanceToBuy,
    onInputChange,
    handleSendOrder,
  } = props

  return (
    <BuyLimitOrderContainer>
      <HeaderRow>{`Buy ${baseTokenSymbol}`}</HeaderRow>
      <InputBox>
        <InputLabel>
          Price <MutedText>({quoteTokenSymbol})</MutedText>
        </InputLabel>
        <PriceInputGroup
          name="price"
          onChange={(e) => onInputChange('BUY', e)}
          value={buyPrice}
          placeholder="Price"
        />
      </InputBox>
      <InputBox>
        <InputLabel>
          Amount <MutedText>({baseTokenSymbol})</MutedText>
        </InputLabel>
        <PriceInputGroup
          name="amount"
          onChange={(e) => onInputChange('BUY', e)}
          value={buyAmount}
          placeholder="Amount"
          // rightElement={
          //   <Total>
          //     Total: ~{buyTotal} {quoteTokenSymbol}
          //   </Total>
          // }
        />
      </InputBox>
      <FractionList 
        side="BUY"
        fraction={fraction}
        onInputChange={onInputChange} 
        />

      {buyTotal && <MaxAmount>Total: ~{buyTotal} {quoteTokenSymbol}</MaxAmount>}
      {buyMaxAmount && <MaxAmount>Max: ~{buyMaxAmount} {baseTokenSymbol}</MaxAmount>}
      {makeFee && <MaxAmount> Fee: {utils.formatUnits(makeFee, quoteTokenDecimals)} {quoteTokenSymbol}</MaxAmount>}
      <GreenGlowingButton
        intent="success"
        text="BUY"
        name="order"
        onClick={() => handleSendOrder('BUY')}
        disabled={insufficientBalanceToBuy}
        fill
      />
    </BuyLimitOrderContainer>
  )
}

const SellLimitOrderPanel = (props) => {
  const {
    sellPrice,
    side,
    sellAmount,
    sellMaxAmount,
    fraction,
    sellTotal,
    makeFee,
    baseTokenSymbol,
    quoteTokenSymbol,
    quoteTokenDecimals,
    insufficientBalanceToSell,
    onInputChange,
    handleSendOrder,
  } = props

  return (
    <SellLimitOrderContainer>
      <HeaderRow>{`Sell ${baseTokenSymbol}`}</HeaderRow>
      <InputBox>
        <InputLabel>
          Price <MutedText>({quoteTokenSymbol})</MutedText>
        </InputLabel>
        <PriceInputGroup
          name="price"
          onChange={(e) => onInputChange('SELL', e)}
          value={sellPrice}
          placeholder="Price"
        />
      </InputBox>
      <InputBox>
        <InputLabel>
          Amount <MutedText>({baseTokenSymbol})</MutedText>
        </InputLabel>
        <PriceInputGroup
          name="amount"
          onChange={(e) => onInputChange('SELL', e)}
          value={sellAmount}
          placeholder="Amount"
          // rightElement={
          //   <Total>
          //     Total: ~{sellTotal} {quoteTokenSymbol}
          //   </Total>
          // }
        />
      </InputBox>
      <FractionList 
        side="SELL"
        fraction={fraction}
        onInputChange={onInputChange} 
        />

      {sellTotal && <MaxAmount>Total: ~{sellTotal} {quoteTokenSymbol}</MaxAmount>}
      {sellMaxAmount && <MaxAmount>Max: ~{sellMaxAmount} {baseTokenSymbol}</MaxAmount>}
      {makeFee && <MaxAmount> Fee: {utils.formatUnits(makeFee, quoteTokenDecimals)} {quoteTokenSymbol}</MaxAmount>}
      <RedGlowingButton
        intent="danger"
        text="SELL"
        name="order"
        onClick={() => handleSendOrder('SELL')}
        disabled={insufficientBalanceToSell}
        fill
      />
    </SellLimitOrderContainer>
  )
}

const LimitOrderPanel = props => {
  return (
    <LimitOrderContainer>
      <BuyLimitOrderPanel {...props} />
      <SellLimitOrderPanel {...props} />
    </LimitOrderContainer>
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
        <PriceInputGroup
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
        <PriceInputGroup
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
        <PriceInputGroup
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
        <PriceInputGroup
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
        <PriceInputGroup
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

const RadioButton = props => {
  const { onInputChange, value } = props
  return (
    <RadioButtonBox>
      <span>{value}%</span>
      <InputGroup name="fraction" type="radio" onChange={onInputChange} value={value} />
    </RadioButtonBox>
  )
}

const OrderFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const Wrapper = styled(Card)`
  min-width: 240px;
`

const ButtonRow = styled.span`
  display: flex;
  justify-content: flex-end;
  & .bp3-button {
    margin-left: 5px;
  }
`
const RadioButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
`

const RadioButtonBox = styled(Label)`
  width: 45px;
  height: 30px;
  display: flex;
  margin-left: 10px;
  margin-bottom: 16px;
  background: #27343d;
  text-align: center;
  padding: 8px 0;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #2584c1;
  box-shadow: none;
  border-radius: 3px;
  input {
    opacity: 0;
    width: 0px;
    margin: 0px;
  }
  .bp3-input-group {
    width: 0px;
  }
`

const PriceInputGroup = styled(InputGroup).attrs({
  className: 'bp3-fill',
})``

const InputBox = styled.div`
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
`

const InputLabel = styled.div`
  height: 100%;
  margin: auto;
  width: 180px;
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
const LimitOrderContainer = styled.div`
  display: flex;
`

const BuyLimitOrderContainer = styled.div`
  padding-right: 20px;
  border-right: 1px solid #27343d;
`

const SellLimitOrderContainer = styled.div`
  padding-left: 20px;
`

const HeaderRow = styled.div`
  margin-bottom: 10px;
`