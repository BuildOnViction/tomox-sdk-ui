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
  SellLimitOrderContainer,
  HeaderRow,
  BaseToken,
  SellButton,
  MaxAmountInfo,
  ErrorMessage,
} from "../OrderFormCommonComponents"
import { pricePrecision } from "../../config/tokens"
import { truncateZeroDecimal } from '../../utils/helpers'

const DappSellLimitOrderForm = props => {
  const {
    sellAmount,
    sellMaxAmount,
    fraction,
    baseTokenSymbol,
    quoteTokenSymbol,
    baseTokenBalance,
    onInputChange,
    onInputFocus,
    onInputBlur,
    handleSendOrder,
    handleDecreaseAmount,
    handleIncreaseAmount,
    errorSell,
    isShowSellMaxAmount,
    sellAmountInput,
    authenticated,
    redirectToLoginPage,
    intl,
    amountPrecision,
  } = props

  return (
    <SellLimitOrderContainer>
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
          onChange={e => onInputChange("SELL", e)}
          onFocus={e => onInputFocus("SELL", e)}
          onBlur={e => onInputBlur("SELL", e)}
          value={sellAmount}
          title={sellAmount}
          autoComplete="off"
          inputRef={sellAmountInput}
          className={
            errorSell && errorSell.type === "amount" ? "has-error" : ""
          }
        />

        <IncreaseAndDecreaseGroup
          type="amount"
          onDecreaseAmount={e => handleDecreaseAmount(e, "SELL")}
          onIncreaseAmount={e => handleIncreaseAmount(e, "SELL")}
        />

        <TokenName>{baseTokenSymbol}</TokenName>
        {isShowSellMaxAmount && (
          <MaxAmountInfo title={sellMaxAmount}>
            Max: {BigNumber(sellMaxAmount).toFormat(amountPrecision)}
          </MaxAmountInfo>
        )}
      </InputBox>

      <FractionList
        side="SELL"
        fraction={fraction}
        onInputChange={onInputChange}
      />

      <ErrorMessage>{errorSell && errorSell.message}</ErrorMessage>

      {authenticated && (
        <React.Fragment>
          <InputBox mb="15px" mt="5px">
            <InputLabel><FormattedMessage id="portfolioPage.available" />:</InputLabel>
            <Value title={`${truncateZeroDecimal(BigNumber(baseTokenBalance).toFormat(pricePrecision))} ${baseTokenSymbol}`}>
              <SmallText>{`${truncateZeroDecimal(BigNumber(baseTokenBalance).toFormat(pricePrecision))} ${baseTokenSymbol}`}</SmallText>
            </Value>
          </InputBox>
          <SellButton
            intent="danger"
            text={<FormattedMessage id="exchangePage.sell" />}
            name="order"
            onClick={() => handleSendOrder("SELL")}
            fill
          />
        </React.Fragment>
      )}

      {!authenticated && (
        <SellButton
          intent="danger"
          text={<FormattedMessage id="exchangePage.unlockWallet" />}
          name="order"
          onClick={redirectToLoginPage}
          fill
        />
      )}
    </SellLimitOrderContainer>
  )
}
export default injectIntl(DappSellLimitOrderForm)
