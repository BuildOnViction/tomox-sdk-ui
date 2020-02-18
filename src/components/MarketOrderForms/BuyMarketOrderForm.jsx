import React from "react"
import { injectIntl, FormattedMessage } from "react-intl"
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
    buyAmount,
    buyMaxAmount,
    fraction,
    baseTokenSymbol,
    quoteTokenSymbol,
    quoteTokenBalance,
    onInputChange,
    onInputFocus,
    onInputBlur,
    handleSendOrder,
    handleDecreaseAmount,
    handleIncreaseAmount,
    errorBuy,
    isShowBuyMaxAmount,
    buyAmountInput,
    authenticated,
    redirectToLoginPage,
    intl,
    amountPrecision,
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
          value={intl.formatMessage({id: "exchangePage.market"})}
          disabled
        />

        <TokenName>{quoteTokenSymbol}</TokenName>
      </InputBox>

      <InputBox mb="0px">
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

      <FractionList
        side="BUY"
        fraction={fraction}
        onInputChange={onInputChange}
      />

      <ErrorMessage>{errorBuy && errorBuy.message}</ErrorMessage>

      {authenticated && (
        <React.Fragment>
          <InputBox mb="15px" mt="5px">
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

export default injectIntl(BuyLimitOrderForm)
