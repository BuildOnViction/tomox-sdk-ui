import React from "react"
import { FormattedMessage } from "react-intl"
import BigNumber from 'bignumber.js'

import { 
  FractionList, 
  IncreaseAndDecreaseGroup,
  InputGroupWrapper,
  TokenName,
  InputBox,
  InputLabel,
  SmallText,
  InputValue,
  HeaderRow,
  BaseToken,
  BuyButton,
  MaxAmountInfo,
  ErrorMessage,
  Wrapper,
  Row,
  Title,
  Value,
  SelectCollaterals,
} from "../OrderFormCommon"
import { pricePrecision } from "../../../config/tokens"
import { truncateZeroDecimal } from '../../../utils/helpers'

const collaterals = [{symbol: 'BTC', address: 'btc'}, {symbol: 'ETH', address: 'eth'}, {symbol: 'TOMO', address: 'tomo'}]

const BorrowOrderForm = props => {
  const {
    buyPrice,
    buyAmount,
    buyMaxAmount,
    fraction,
    buyTotal,
    baseTokenSymbol,
    quoteTokenSymbol,
    quoteTokenBalance,
    // quoteTokenDecimals,
    onInputChange,
    onInputFocus,
    onInputBlur,
    handleSendOrder,
    handleDecreasePrice,
    handleIncreasePrice,
    handleDecreaseAmount,
    handleIncreaseAmount,
    errorBuy,
    isShowBuyMaxAmount,
    buyPriceInput,
    buyAmountInput,
    authenticated,
    redirectToLoginPage,
    amountPrecision,
  } = props

  return (
    <Wrapper>
      <HeaderRow>
        <BaseToken><FormattedMessage id="exchangeLendingPage.orderPlace.borrow" /> {baseTokenSymbol}</BaseToken>
      </HeaderRow>

      <InputBox>
        <InputLabel>
          <FormattedMessage id="exchangeLendingPage.orderPlace.interest" />:
        </InputLabel>

        <InputGroupWrapper
          name="price"
          onChange={e => onInputChange("BUY", e)}
          onFocus={e => onInputFocus("BUY", e)}
          onBlur={e => onInputBlur("BUY", e)}
          value={buyPrice}
          title={buyPrice}
          autoComplete="off"
          inputRef={buyPriceInput}
          className={errorBuy && errorBuy.type === "price" ? "has-error" : ""}
        />

        <TokenName>%</TokenName>

        <IncreaseAndDecreaseGroup
          type="price"
          onDecreasePrice={e => handleDecreasePrice(e, "BUY")}
          onIncreasePrice={e => handleIncreasePrice(e, "BUY")}
        />
      </InputBox>

      <InputBox>
        <InputLabel>
          <FormattedMessage id="exchangePage.amount" />:
        </InputLabel>

        <InputGroupWrapper
          name="amount"
          onChange={e => onInputChange("BUY", e)}
          onFocus={e => onInputFocus("BUY", e)}
          onBlur={e => onInputBlur("BUY", e)}
          value={buyAmount}
          title={buyAmount}
          autoComplete="off"
          inputRef={buyAmountInput}
          className={errorBuy && errorBuy.type === "amount" ? "has-error" : ""}
        />

        <TokenName>{baseTokenSymbol}</TokenName>

        <IncreaseAndDecreaseGroup
          type="amount"
          onDecreaseAmount={e => handleDecreaseAmount(e, "BUY")}
          onIncreaseAmount={e => handleIncreaseAmount(e, "BUY")}
        />

        {isShowBuyMaxAmount && (
          <MaxAmountInfo title={buyMaxAmount}>
            Max: {BigNumber(buyMaxAmount).toFormat(amountPrecision)}
          </MaxAmountInfo>
        )}
      </InputBox>

      <InputBox mb="0">
        <InputLabel>
          <FormattedMessage id="exchangeLendingPage.orderPlace.selectCollateral" />:
        </InputLabel>

        <InputValue>
          <SelectCollaterals items={collaterals} activeItem={collaterals[0]} />
        </InputValue>
      </InputBox>

      <FractionList
        side="BUY"
        fraction={fraction}
        onInputChange={onInputChange}
      />

      <Row>
        <ErrorMessage>{errorBuy && errorBuy.message}</ErrorMessage>
      </Row>

      <Row mb="15px">
        <Title><FormattedMessage id="exchangeLendingPage.orderPlace.collateralRequired" />:</Title>
        <Value title={`${truncateZeroDecimal(BigNumber(quoteTokenBalance).toFormat(pricePrecision))} ${quoteTokenSymbol}`}>
          <SmallText>{`${truncateZeroDecimal(BigNumber(quoteTokenBalance).toFormat(pricePrecision))} ${quoteTokenSymbol}`}</SmallText>
        </Value>
      </Row>

      {authenticated && (
        <React.Fragment>
          <Row mb="15px">
            <Title><FormattedMessage id="portfolioPage.available" />:</Title>
            <Value title={`${truncateZeroDecimal(BigNumber(quoteTokenBalance).toFormat(pricePrecision))} ${quoteTokenSymbol}`}>
              <SmallText>{`${truncateZeroDecimal(BigNumber(quoteTokenBalance).toFormat(pricePrecision))} ${quoteTokenSymbol}`}</SmallText>
            </Value>
          </Row>
          <BuyButton
            intent="success"
            text={<FormattedMessage id="exchangeLendingPage.orderPlace.borrow" />}
            name="order"
            onClick={() => handleSendOrder("BUY")}
            fill
          />
        </React.Fragment>
      )}

      {!authenticated && (
        <BuyButton
          intent="success"
          text={<FormattedMessage id="exchangePage.unlockWallet" />}
          name="order"
          onClick={redirectToLoginPage}
          fill
        />
      )}
    </Wrapper>
  )
}

export default BorrowOrderForm
