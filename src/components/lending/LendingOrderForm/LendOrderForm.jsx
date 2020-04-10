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
  // InputValue,
  HeaderRow,
  BaseToken,
  SellButton,
  // MaxAmountInfo,
  ErrorMessage,
  Wrapper,
  Row,
  Title,
  Value,
} from "../OrderFormCommon"
// import { pricePrecision } from "../../../config/tokens"
import { truncateZeroDecimal } from '../../../utils/helpers'

const LendOrderForm = props => {
  const {
    lendInterest,
    lendAmount,
    // sellMaxAmount,
    fraction,
    // sellTotal,
    // baseTokenSymbol,
    // quoteTokenSymbol,
    // baseTokenBalance,
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
    // isShowSellMaxAmount,
    sellPriceInput,
    sellAmountInput,
    authenticated,
    redirectToLoginPage,
    profit,
    currentPair,
    lendingToken,
  } = props

  return (
    <Wrapper>
      <HeaderRow>
        <BaseToken><FormattedMessage id="exchangeLendingPage.orderPlace.lend" /> {currentPair.pair}</BaseToken>
      </HeaderRow>
      <InputBox>
        <InputLabel>
          <FormattedMessage id="exchangeLendingPage.orderPlace.interest" />:
        </InputLabel>

        <InputGroupWrapper
          name="interest"
          onChange={e => onInputChange("INVEST", e)}
          onMouseDown={e => onInputFocus("INVEST", e)}
          onBlur={e => onInputBlur("INVEST", e)}
          value={lendInterest}
          title={lendInterest}
          autoComplete="off"
          inputRef={sellPriceInput}
          className={errorSell && errorSell.type === "interest" ? "has-error" : ""}
        />

        <IncreaseAndDecreaseGroup
          type="price"
          onDecreasePrice={e => handleDecreasePrice(e, "INVEST")}
          onIncreasePrice={e => handleIncreasePrice(e, "INVEST")}
        />

        <TokenName>&#37;</TokenName>
      </InputBox>

      <InputBox mb="0px">
        <InputLabel>
          <FormattedMessage id="exchangePage.amount" />:
        </InputLabel>
        <InputGroupWrapper
          name="amount"
          onChange={e => onInputChange("INVEST", e)}
          onFocus={e => onInputFocus("INVEST", e)}
          onBlur={e => onInputBlur("INVEST", e)}
          value={lendAmount}
          title={lendAmount}
          autoComplete="off"
          inputRef={sellAmountInput}
          className={
            errorSell && errorSell.type === "amount" ? "has-error" : ""
          }
        />

        <IncreaseAndDecreaseGroup
          type="amount"
          onDecreaseAmount={e => handleDecreaseAmount(e, "INVEST")}
          onIncreaseAmount={e => handleIncreaseAmount(e, "INVEST")}
        />

        <TokenName>{currentPair.lendingTokenSymbol}</TokenName>

        {/* {isShowSellMaxAmount && (
          <MaxAmountInfo title={sellMaxAmount}>
            Max: {BigNumber(sellMaxAmount).toFormat(2)}
          </MaxAmountInfo>
        )} */}
      </InputBox>

      <FractionList
        side="INVEST"
        fraction={fraction}
        onInputChange={onInputChange}
      />

      <Row mb="10px">
        <Title><FormattedMessage id="exchangeLendingPage.orderPlace.estimatedProfit" />:</Title>
        <Value>
        <SmallText>{profit} {currentPair.lendingTokenSymbol}</SmallText>
        </Value>
      </Row>

      {authenticated && (
        <React.Fragment>
          <Row mb="10px">
            <Title><FormattedMessage id="portfolioPage.available" />:</Title>
            <Value title={`${truncateZeroDecimal(BigNumber(lendingToken.availableBalance).toFormat(8))} ${currentPair.lendingTokenSymbol}`}>
              <SmallText>{`${truncateZeroDecimal(BigNumber(lendingToken.availableBalance).toFormat(8))} ${currentPair.lendingTokenSymbol}`}</SmallText>
            </Value>
          </Row>

          <Row><ErrorMessage>{errorSell && errorSell.message}</ErrorMessage></Row>
         
          <SellButton
            intent="danger"
            text={<FormattedMessage id="exchangeLendingPage.orderPlace.lend" /> }
            name="order"
            onClick={() => handleSendOrder("INVEST")}
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
    </Wrapper>
  )
}

export default LendOrderForm


