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
  HeaderRow,
  BaseToken,
  SellButton,
  MaxAmountInfo,
  ErrorMessage,
  OverlayInput,
} from "../OrderFormCommonComponents"
import { pricePrecision } from "../../config/tokens"
import { truncateZeroDecimal } from '../../utils/helpers'

const SellLimitOrderForm = props => {
  const {
    sellPrice,
    sellAmount,
    sellMaxAmount,
    fraction,
    sellTotal,
    // makeFee,
    baseTokenSymbol,
    quoteTokenSymbol,
    baseTokenBalance,
    // quoteTokenDecimals,
    // insufficientBalanceToSell,
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
    redirectToLoginPage,
  } = props

  return (
    <SellLimitOrderContainer>
      <HeaderRow>
        <BaseToken>{`Sell ${baseTokenSymbol}`}</BaseToken>
      </HeaderRow>
      <InputBox>
        <InputLabel>
          <FormattedMessage id="exchangePage.price" />:
        </InputLabel>

        <InputGroupWrapper
          name="price"
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

      <InputBox>
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
            Max: {sellMaxAmount}
          </MaxAmountInfo>
        )}
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
          <FormattedMessage id="exchangePage.total" />:
        </InputLabel>
        <InputGroupWrapper
          name="sell-total"
          readOnly
          // onChange={(e) => onInputChange('SELL', e)}
          value={sellTotal}
          tabIndex="-1"
        />
        <TokenName>{quoteTokenSymbol}</TokenName>
        <OverlayInput title={sellTotal} />
      </InputBox>

      {errorSell && (<ErrorMessage>{errorSell.message}</ErrorMessage>)}

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
          text={<FormattedMessage id="exchangePage.unlockWallet" />}
          name="order"
          onClick={redirectToLoginPage}
          fill
        />
      )}
    </SellLimitOrderContainer>
  )
}

export default SellLimitOrderForm


