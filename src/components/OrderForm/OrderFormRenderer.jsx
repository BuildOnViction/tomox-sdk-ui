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
  UtilityIcon,
  Theme,
} from '../Common'

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
    handleChangeOrderType,
    handleUnlockPair,
    handleSendOrder,
    handleDecreasePrice,
    handleIncreasePrice,
    handleDecreaseAmount,
    handleIncreaseAmount,
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
                handleUnlockPair={handleUnlockPair}
                handleSendOrder={handleSendOrder}
                handleDecreasePrice={handleDecreasePrice}
                handleIncreasePrice={handleIncreasePrice}
                handleDecreaseAmount={handleDecreaseAmount}
                handleIncreaseAmount={handleIncreaseAmount}
              />
            }
          />
          {/* <Tab
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
          <Tab
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

const FractionList = (props) => {
  const { side, fraction, onInputChange } = props

  return (
    <FractionListBox>
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
    </FractionListBox>  
  )
}

const BuyLimitOrderPanel = (props) => {
  const {
    buyPrice,
    // side,
    buyAmount,
    // buyMaxAmount,
    fraction,
    buyTotal,
    // makeFee,
    baseTokenSymbol,
    quoteTokenSymbol,
    // quoteTokenDecimals,
    insufficientBalanceToBuy,
    onInputChange,
    handleSendOrder,
    handleDecreasePrice,
    handleIncreasePrice,    
    handleDecreaseAmount,
    handleIncreaseAmount,
  } = props

  return (
    <BuyLimitOrderContainer>
      <HeaderRow>
        <BaseToken>{`Buy ${baseTokenSymbol}`}</BaseToken>
        <DecreaseToken>{`-${quoteTokenSymbol}`}</DecreaseToken>
      </HeaderRow>

      <InputBox>
        <InputLabel>
          Price:
        </InputLabel>

        <PriceInputGroup
          name="price"
          onChange={(e) => onInputChange('BUY', e)}
          value={buyPrice}
        />

        <TokenName>{quoteTokenSymbol}</TokenName>

        <IncreaseAndDecreaseGroup 
          type="price" 
          onDecreasePrice={() => handleDecreasePrice('BUY')}
          onIncreasePrice={() => handleIncreasePrice('BUY')} />
      </InputBox>

      <InputBox>
        <InputLabel>
          Amount:
        </InputLabel>

        <PriceInputGroup
          name="amount"
          onChange={(e) => onInputChange('BUY', e)}
          value={buyAmount}
        />

        <TokenName>{baseTokenSymbol}</TokenName>

        <IncreaseAndDecreaseGroup 
          type="amount" 
          onDecreaseAmount={() => handleDecreaseAmount('BUY')}
          onIncreaseAmount={() => handleIncreaseAmount('BUY')} />
      </InputBox>

      <FractionList 
        side="BUY"
        fraction={fraction}
        onInputChange={onInputChange} 
        />

      <InputBox>
        <InputLabel>
          Total:
        </InputLabel>
        <PriceInputGroup
          name="buy-total"
          readOnly
          // onChange={(e) => onInputChange('BUY', e)}
          value={buyTotal}
        />
        <TokenName>{quoteTokenSymbol}</TokenName>
      </InputBox>

      {/* {buyTotal && <MaxAmount>Total: ~{buyTotal} {quoteTokenSymbol}</MaxAmount>}
      {buyMaxAmount && <MaxAmount>Max: ~{buyMaxAmount} {baseTokenSymbol}</MaxAmount>}
      {makeFee && <MaxAmount> Fee: {utils.formatUnits(makeFee, quoteTokenDecimals)} {quoteTokenSymbol}</MaxAmount>} */}
      <BuyButton
        intent="success"
        text="Buy"
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
    // side,
    sellAmount,
    // sellMaxAmount,
    fraction,
    sellTotal,
    // makeFee,
    baseTokenSymbol,
    quoteTokenSymbol,
    // quoteTokenDecimals,
    insufficientBalanceToSell,
    onInputChange,
    handleSendOrder,
    handleDecreasePrice,
    handleIncreasePrice,    
    handleDecreaseAmount,
    handleIncreaseAmount,
  } = props

  return (
    <SellLimitOrderContainer>
      <HeaderRow>
        <BaseToken>{`Sell ${baseTokenSymbol}`}</BaseToken>
        <DecreaseToken>{`-${baseTokenSymbol}`}</DecreaseToken>
      </HeaderRow>
      <InputBox>
        <InputLabel>
          Price:
        </InputLabel>
        <PriceInputGroup
          name="price"
          onChange={(e) => onInputChange('SELL', e)}
          value={sellPrice}
        />

        <IncreaseAndDecreaseGroup 
          type="price" 
          onDecreasePrice={() => handleDecreasePrice('SELL')}
          onIncreasePrice={() => handleIncreasePrice('SELL')} />

        <TokenName>{quoteTokenSymbol}</TokenName>
      </InputBox>

      <InputBox>
        <InputLabel>
          Amount:
        </InputLabel>
        <PriceInputGroup
          name="amount"
          onChange={(e) => onInputChange('SELL', e)}
          value={sellAmount}
        />
        
        <IncreaseAndDecreaseGroup 
          type="amount" 
          onDecreaseAmount={() => handleDecreaseAmount('SELL')}
          onIncreaseAmount={() => handleIncreaseAmount('SELL')} />

        <TokenName>{baseTokenSymbol}</TokenName>
      </InputBox>

      <FractionList 
        side="SELL"
        fraction={fraction}
        onInputChange={onInputChange} 
        />

      {/* {sellTotal && <MaxAmount>Total: ~{sellTotal} {quoteTokenSymbol}</MaxAmount>}
      {sellMaxAmount && <MaxAmount>Max: ~{sellMaxAmount} {baseTokenSymbol}</MaxAmount>}
      {makeFee && <MaxAmount> Fee: {utils.formatUnits(makeFee, quoteTokenDecimals)} {quoteTokenSymbol}</MaxAmount>} */}
      
      <InputBox>
        <InputLabel>
          Total:
        </InputLabel>
        <PriceInputGroup
          name="sell-total"
          readOnly
          // onChange={(e) => onInputChange('SELL', e)}
          value={sellTotal}
        />
        <TokenName>{quoteTokenSymbol}</TokenName>
      </InputBox>
      
      <SellButton
        intent="danger"
        text="Sell"
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
    <OrderWrapper>
      <BuyLimitOrderPanel {...props} />
      <SellLimitOrderPanel {...props} />
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

const RadioButton = props => {
  const { onInputChange, value } = props
  return (
    <RadioButtonBox>
      <span>{value}%</span>
      <InputGroup name="fraction" type="radio" onChange={onInputChange} value={value} />
    </RadioButtonBox>
  )
}

const IncreaseAndDecreaseGroup = (props) => {
  const { 
    type,
    onDecreasePrice,
    onIncreasePrice,
    onDecreaseAmount,
    onIncreaseAmount, 
  } = props

  if (type === 'price') {
    return (
      <IncreaseAndDecreaseBox>
        <IncreaseAndDecreaseButton onClick={onIncreasePrice}><UtilityIcon name="arrow-up" /></IncreaseAndDecreaseButton>
        <IncreaseAndDecreaseButton onClick={onDecreasePrice}><UtilityIcon name="arrow-down" /></IncreaseAndDecreaseButton>
      </IncreaseAndDecreaseBox>
    )
  }

  return (
    <IncreaseAndDecreaseBox>
      <IncreaseAndDecreaseButton onClick={onIncreaseAmount}><UtilityIcon name="arrow-up" /></IncreaseAndDecreaseButton>
      <IncreaseAndDecreaseButton onClick={onDecreaseAmount}><UtilityIcon name="arrow-down" /></IncreaseAndDecreaseButton>
    </IncreaseAndDecreaseBox>
  )
  
}

export default OrderFormRenderer

const OrderFormTabs = styled(Tabs)`
  user-select: none;
  .bp3-tab-list {
    margin-bottom: 15px;
  }
`

const FractionListBox = styled.div.attrs({
  className: 'clearfix',
})``

const RadioButtonsWrapper = styled.div`
  width: calc(100% - 60px);
  float: right;
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

const IncreaseAndDecreaseBox = styled.div.attrs({
  className: 'increase-decrease-box',
})`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  padding: 5px 0;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 2px;

  span:first-child {
    align-items: flex-end;
    padding-bottom: 3px;
  }

  span:last-child {
    align-items: flex-start;
    padding-top: 3px;
  }
`

const IncreaseAndDecreaseButton = styled.span`
  display: flex;
  justify-content: center;
  width: 15px;
  height: 50%;
  cursor: pointer;
`

const PriceInputGroup = styled(InputGroup).attrs({
  className: 'bp3-fill',
})`
  .bp3-input {
    font-size: ${Theme.FONT_SIZE_MD};
    padding-right: 50px !important; 
  }
`

const TokenName = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  user-select: none;
`

const InputBox = styled.div`
  display: flex;
  position: relative;
  padding-top: 5px;
  padding-bottom: 5px;

  &:hover {
    .increase-decrease-box {
      display: flex !important;
    }
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
  className: 'order-wrapper'
})``

const BuyLimitOrderContainer = styled.div.attrs({
  className: 'buy-side',
})``

const SellLimitOrderContainer = styled.div.attrs({
  className: 'sell-side',
})``

const HeaderRow = styled.div.attrs({
  className: 'header',
})`
  margin-bottom: 10px;
`

const BaseToken = styled.span.attrs({
  className: 'base-token',
})``

const DecreaseToken = styled.span.attrs({
  className: 'decrease-token',
})``

const BuyButton = styled(Button).attrs({
  className: "buy-btn",
})``

const SellButton = styled(Button).attrs({
  className: "sell-btn",
})``