import React from "react"
import styled from "styled-components"
import { Button, InputGroup } from "@blueprintjs/core"
import { FormattedMessage } from "react-intl"

import { Theme, DarkMode } from "../Common"
import { FractionList, IncreaseAndDecreaseGroup } from "../OrderFormCommonComponents"

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
    redirectToLoginPage
  } = props

  return (
    <SellLimitOrderContainer>
      <HeaderRow>
        <BaseToken>{`Sell ${baseTokenSymbol}`}</BaseToken>
        {/* <DecreaseToken>{`-${baseTokenSymbol}`}</DecreaseToken> */}
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

      <ErrorMessage>{errorSell && errorSell.message}</ErrorMessage>

      {authenticated && (
        <SellButton
          intent="danger"
          text={<FormattedMessage id="exchangePage.sell" />}
          name="order"
          onClick={() => handleSendOrder("SELL")}
          fill
        />
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

const SellLimitOrderContainer = styled.div.attrs({
  className: "sell-side"
})``

const SellButton = styled(Button).attrs({
  className: "sell-btn"
})``

const InputGroupWrapper = styled(InputGroup).attrs({
  className: "bp3-fill"
})`
  &.has-error .bp3-input {
    box-shadow: 0 0 0 1px ${DarkMode.RED};
  }

  .bp3-input {
    font-size: ${Theme.FONT_SIZE_MD};
    padding-right: 50px !important;

    &:focus {
      box-shadow: 0 0 0 1px ${DarkMode.ORANGE};
    }
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
  margin-bottom: 10px;

  &:hover {
    .increase-decrease-box {
      display: flex !important;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  .bp3-input-group.bp3-fill {
    width: calc(100% - 60px);
  }
`

const InputLabel = styled.div`
  height: 100%;
  width: 60px;
  margin: auto;
  margin-right: 10px;
  user-select: none;
`

const HeaderRow = styled.div.attrs({
  className: "header"
})`
  margin-bottom: 10px;
`

const BaseToken = styled.span.attrs({
  className: "base-token"
})``

const MaxAmountInfo = styled.div`
  background: ${DarkMode.ORANGE};
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${Theme.FONT_SIZE_SM};
  color: ${DarkMode.WHITE};
  position: absolute;
  top: 100%;
  left: 67px;
  right: 0;
`

const ErrorMessage = styled.div`
  height: 17px;
  line-height: 17px;
  width: calc(100% - 60px);
  padding-left: 8px;
  color: ${DarkMode.RED};
  margin-left: auto;
  margin-top: -7px;
  margin-bottom: 3px;
`

const OverlayInput = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`
