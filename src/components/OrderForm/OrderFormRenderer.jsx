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

import type { SIDE } from '../../types/orderForm'

import {
  MutedText,
  RedGlowingButton,
  GreenGlowingButton,
  FlexRow,
  Box,
} from '../Common'

type Props = {
  selectedTabId: string,
  side: 'BUY' | 'SELL',
  fraction: number,
  priceType: string,
  price: string,
  stopPrice: string,
  limitPrice: string,
  amount: string,
  maxAmount: string,
  total: string,
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
    price,
    stopPrice,
    limitPrice,
    isOpen,
    amount,
    maxAmount,
    total,
    makeFee,
    takeFee,
    baseTokenSymbol,
    quoteTokenSymbol,
    baseTokenDecimals,
    quoteTokenDecimals,
    loggedIn,
    insufficientBalance,
    pairIsAllowed,
    pairAllowanceIsPending,
    onInputChange,
    handleChangeOrderType,
    handleUnlockPair,
    toggleCollapse,
    handleSendOrder,
    handleSideChange,
  } = props

  return (
    <Wrapper className="order-form">
      <OrderFormHeader>
        {/* <HeaderText text={`${side} ${baseTokenSymbol}`} /> */}
        <ButtonRow>
          <Button
            text="BUY"
            minimal
            onClick={() => handleSideChange('BUY')}
            active={side === 'BUY'}
            intent="success"
          />
          <Button
            text="SELL"
            minimal
            onClick={() => handleSideChange('SELL')}
            active={side === 'SELL'}
            intent="danger"
          />
        </ButtonRow>
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
                price={price}
                stopPrice={stopPrice}
                limitPrice={limitPrice}
                amount={amount}
                maxAmount={maxAmount}
                total={total}
                makeFee={makeFee}
                takeFee={takeFee}
                baseTokenDecimals={baseTokenDecimals}
                quoteTokenDecimals={quoteTokenDecimals}
                insufficientBalance={insufficientBalance}
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
                price={price}
                stopPrice={stopPrice}
                limitPrice={limitPrice}
                amount={amount}
                maxAmount={maxAmount}
                total={total}
                makeFee={makeFee}
                takeFee={takeFee}
                baseTokenDecimals={baseTokenDecimals}
                quoteTokenDecimals={quoteTokenDecimals}
                insufficientBalance={insufficientBalance}
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
                price={price}
                stopPrice={stopPrice}
                limitPrice={limitPrice}
                amount={amount}
                maxAmount={maxAmount}
                total={total}
                makeFee={makeFee}
                takeFee={takeFee}
                baseTokenDecimals={baseTokenDecimals}
                quoteTokenDecimals={quoteTokenDecimals}
                insufficientBalance={insufficientBalance}
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

const LimitOrderPanel = props => {
  const {
    price,
    side,
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
    pairAllowanceIsPending,
    onInputChange,
    handleUnlockPair,
    handleSendOrder,
  } = props

  let ButtonElement

  if (side === 'BUY') {
    if (pairAllowanceIsPending) {
      ButtonElement = (
        <GreenGlowingButton
          intent="success"
          name="order"
          disabled
          fill
        >
          <FlexRow alignItems="center">
            <Box px={2}>
              <Spinner size={15} intent="success" />
            </Box>
            Pending
          </FlexRow>
        </GreenGlowingButton>
      )
    } else {
      ButtonElement = (
        <GreenGlowingButton
          intent="success"
          text={pairIsAllowed ? side : `Unlock ${baseTokenSymbol}/${quoteTokenSymbol}`}
          name="order"
          onClick={pairIsAllowed ? handleSendOrder : handleUnlockPair}
          disabled={insufficientBalance}
          fill
        />
      )
    }
  } else if (pairAllowanceIsPending) {
    ButtonElement = (
      <RedGlowingButton
        intent="danger"
        name="order"
        disabled
        fill
      >
        <FlexRow alignItems="center">
          <Box px={2}>
            <Spinner size={15} intent="danger" />
          </Box>
          Pending
        </FlexRow>
      </RedGlowingButton>
    )
  } else {
    ButtonElement = (
      <RedGlowingButton
        intent="danger"
        text={pairIsAllowed ? side : `Unlock ${baseTokenSymbol}/${quoteTokenSymbol}`}
        name="order"
        onClick={pairIsAllowed ? handleSendOrder : handleUnlockPair}
        disabled={insufficientBalance}
        fill
      />
    )
  }

  return (
    <React.Fragment>
      <InputBox>
        <InputLabel>
          Price <MutedText>({quoteTokenSymbol})</MutedText>
        </InputLabel>
        <PriceInputGroup
          name="price"
          onChange={onInputChange}
          value={price}
          placeholder="Price"
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
      {makeFee && <MaxAmount> Fee: {utils.formatUnits(makeFee, quoteTokenDecimals)} {quoteTokenSymbol}</MaxAmount>}

      {ButtonElement}

    </React.Fragment>
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
      <MaxAmount>Fee: {makeFee} {utils.formatUnits(makeFee, quoteTokenDecimals)} {quoteTokenSymbol} </MaxAmount>

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
