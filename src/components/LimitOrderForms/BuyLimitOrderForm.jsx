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
  Value,
  BuyLimitOrderContainer,
  HeaderRow,
  BaseToken,
  BuyButton,
  MaxAmountInfo,
  ErrorMessage,
} from "../OrderFormCommonComponents"
import { pricePrecision } from "../../config/tokens"
import { truncateZeroDecimal } from '../../utils/helpers'

const BuyLimitOrderForm = props => {
  const {
    buyPrice,
    buyAmount,
    buyMaxAmount,
    fraction,
    buyTotal,
    // makeFee,
    baseTokenSymbol,
    quoteTokenSymbol,
    quoteTokenBalance,
    // quoteTokenDecimals,
    // insufficientBalanceToBuy,
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
  } = props

  return (
    <BuyLimitOrderContainer>
      <HeaderRow>
        <BaseToken>{`Buy ${baseTokenSymbol}`}</BaseToken>
      </HeaderRow>

      <InputBox>
        <InputLabel>
          <FormattedMessage id="exchangePage.price" />:
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

        <TokenName>{quoteTokenSymbol}</TokenName>

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
            Max: {buyMaxAmount}
          </MaxAmountInfo>
        )}
      </InputBox>

      <FractionList
        side="BUY"
        fraction={fraction}
        onInputChange={onInputChange}
      />

      <InputBox>
        <InputLabel>
          <FormattedMessage id="exchangePage.total" />:
        </InputLabel>
        <InputGroupWrapper
          name="total"
          onChange={(e) => onInputChange('BUY', e)}
          value={buyTotal}
          autoComplete="off"
        />
        <TokenName>{quoteTokenSymbol}</TokenName>
      </InputBox>

      {errorBuy && (<ErrorMessage>{errorBuy.message}</ErrorMessage>)}

      {authenticated && (
        <React.Fragment>
          <InputBox mb="15px">
            <InputLabel><FormattedMessage id="portfolioPage.available" />:</InputLabel>
            <Value title={`${truncateZeroDecimal(BigNumber(quoteTokenBalance).toFormat(pricePrecision))} ${quoteTokenSymbol}`}>
              <SmallText>{`${truncateZeroDecimal(BigNumber(quoteTokenBalance).toFormat(pricePrecision))} ${quoteTokenSymbol}`}</SmallText>
            </Value>
          </InputBox>
          <BuyButton
            intent="success"
            text={<FormattedMessage id="exchangePage.buy" />}
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
    </BuyLimitOrderContainer>
  )
}

export default BuyLimitOrderForm
