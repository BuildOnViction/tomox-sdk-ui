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
  SellLimitOrderContainer,
  SellButton,
  MaxAmountInfo,
  ErrorMessage,
  Row,
} from "../OrderFormCommonComponents"
import { pricePrecision } from "../../config/tokens"
import { truncateZeroDecimal } from '../../utils/helpers'

const DappSellLimitOrderForm = props => {
  const {
    sellPrice,
    sellAmount,
    sellMaxAmount,
    fraction,
    sellTotal,
    baseTokenSymbol,
    quoteTokenSymbol,
    baseTokenBalance,
    // quoteTokenDecimals,
    onInputChange,
    onInputFocus,
    onInputBlur,
    handleSendOrder,
    handleDecreasePrice,
    handleIncreasePrice,
    handleDecreaseAmount,
    handleIncreaseAmount,
    errorSell,
    isShowSellMaxAmount,
    sellPriceInput,
    sellAmountInput,
    authenticated,
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
          inputmode="decimal"
          onChange={e => onInputChange("SELL", e)}
          onMouseDown={e => onInputFocus("SELL", e)}
          onBlur={e => onInputBlur("SELL", e)}
          value={sellPrice}
          title={sellPrice}
          autoComplete="off"
          inputRef={sellPriceInput}
          className={errorSell && errorSell.type === "price" ? "has-error" : ""}
        />

        <IncreaseAndDecreaseGroup
          type="price"
          onDecreasePrice={e => handleDecreasePrice(e, "SELL")}
          onIncreasePrice={e => handleIncreasePrice(e, "SELL")}
        />

        <TokenName>{quoteTokenSymbol}</TokenName>
      </InputBox>

      <InputBox mb="0px">
        <InputLabel>
          <FormattedMessage id="exchangePage.amount" />:
        </InputLabel>
        <InputGroupWrapper
          name="amount"
          inputmode="decimal"
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


      <InputBox>
        <InputLabel>
          <FormattedMessage id="exchangePage.total" />:
        </InputLabel>
        <InputGroupWrapper
          name="total"
          inputmode="decimal"
          onChange={(e) => onInputChange('SELL', e)}
          value={sellTotal}
          autoComplete="off"
        />
        <TokenName>{quoteTokenSymbol}</TokenName>
      </InputBox>

      <Row><ErrorMessage>{errorSell && errorSell.message}</ErrorMessage></Row>

      {authenticated && (
        <React.Fragment>
          <InputBox mb="15px">
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
          text={<FormattedMessage id="exchangeLendingPage.orderPlace.onlyForDappBrowser" />}
          name="order"
          fill
          disabled
        />
      )}
    </SellLimitOrderContainer>
  )
}

export default DappSellLimitOrderForm


