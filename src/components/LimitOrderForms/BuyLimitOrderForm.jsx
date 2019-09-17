import React from "react"
import styled from "styled-components"
import { Button, InputGroup } from "@blueprintjs/core"
import { FormattedMessage } from "react-intl"

import { Theme, DarkMode } from "../Common"
import { FractionList, IncreaseAndDecreaseGroup } from "../OrderFormCommonComponents"

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
        {/* <DecreaseToken>{`-${quoteTokenSymbol}`}</DecreaseToken> */}
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
          <MaxAmountInfo>
            Max: {buyMaxAmount} {baseTokenSymbol}
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
          name="buy-total"
          readOnly
          // onChange={(e) => onInputChange('BUY', e)}
          value={buyTotal}
          tabIndex="-1"
        />
        <TokenName>{quoteTokenSymbol}</TokenName>
        <OverlayInput title={buyTotal} />
      </InputBox>

      {/* {buyTotal && <MaxAmount>Total: ~{buyTotal} {quoteTokenSymbol}</MaxAmount>}
        {buyMaxAmount && <MaxAmount>Max: ~{buyMaxAmount} {baseTokenSymbol}</MaxAmount>}
        {makeFee && <MaxAmount> Fee: {utils.formatUnits(makeFee, quoteTokenDecimals)} {quoteTokenSymbol}</MaxAmount>} */}

      <ErrorMessage>{errorBuy && errorBuy.message}</ErrorMessage>

      {authenticated && (
        <BuyButton
          intent="success"
          text={<FormattedMessage id="exchangePage.buy" />}
          name="order"
          onClick={() => handleSendOrder("BUY")}
          fill
        />
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

const BuyLimitOrderContainer = styled.div.attrs({
  className: "buy-side",
})``

const HeaderRow = styled.div.attrs({
  className: "header",
})`
  margin-bottom: 10px;
`

const BaseToken = styled.span.attrs({
  className: "base-token",
})``

const BuyButton = styled(Button).attrs({
  className: "buy-btn",
})``

const MaxAmountInfo = styled.div`
  background: ${DarkMode.ORANGE};
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
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
