// @flow
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import type { Side, OrderType } from '../../../types/orders'
import {
  SpinnerContainer,
} from '../../Common'
import { BorrowOrderForm, SellLimitOrderForm } from '../OrderFormSides'

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
    amountPrecision,
  } = props

  return (
    <Container>
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
        amountPrecision={amountPrecision}
      />
      {loading && <SpinnerContainer />}
    </Container>
  )
}

const LimitOrderPanel = props => {
  return (
    <OrderWrapper>
      <BorrowOrderForm {...props} />
      <SellLimitOrderForm {...props} />
    </OrderWrapper>
  )
}

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

const OrderWrapper = styled.div.attrs({
  className: 'order-wrapper',
})`
  height: 100%;
`

export default OrderFormRenderer