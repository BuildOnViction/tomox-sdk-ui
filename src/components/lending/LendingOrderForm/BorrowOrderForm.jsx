import React from "react"
import { FormattedMessage } from "react-intl"
import BigNumber from 'bignumber.js'

import { 
  // FractionList, 
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
  // MaxAmountInfo,
  ErrorMessage,
  Wrapper,
  Row,
  Title,
  Value,
  SelectCollaterals,
} from "../OrderFormCommon"
import { pricePrecision } from "../../../config/tokens"
import { truncateZeroDecimal } from '../../../utils/helpers'

const BorrowOrderForm = props => {
  const {
    borrowInterest,
    borrowAmount,
    // buyMaxAmount,
    // fraction,
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
    // isShowBuyMaxAmount,
    buyPriceInput,
    buyAmountInput,
    authenticated,
    redirectToLoginPage,
    collateralTokens,
    collateralTokenSelected,
    onCollateralSelect,
  } = props

  return (
    <Wrapper>
      <HeaderRow>
        <BaseToken><FormattedMessage id="exchangeLendingPage.orderPlace.borrow" /> 7 Days/{quoteTokenSymbol}</BaseToken>
      </HeaderRow>

      <InputBox>
        <InputLabel>
          <FormattedMessage id="exchangeLendingPage.orderPlace.interest" />:
        </InputLabel>

        <InputGroupWrapper
          name="interest"
          onChange={e => onInputChange("BORROW", e)}
          onFocus={e => onInputFocus("BORROW", e)}
          onBlur={e => onInputBlur("BORROW", e)}
          value={borrowInterest}
          title={borrowInterest}
          autoComplete="off"
          inputRef={buyPriceInput}
          className={errorBuy && errorBuy.type === "interest" ? "has-error" : ""}
        />

        <TokenName>%</TokenName>

        <IncreaseAndDecreaseGroup
          type="price"
          onDecreasePrice={e => handleDecreasePrice(e, "BORROW")}
          onIncreasePrice={e => handleIncreasePrice(e, "BORROW")}
        />
      </InputBox>

      <InputBox>
        <InputLabel>
          <FormattedMessage id="exchangePage.amount" />:
        </InputLabel>

        <InputGroupWrapper
          name="amount"
          onChange={e => onInputChange("BORROW", e)}
          onFocus={e => onInputFocus("BORROW", e)}
          onBlur={e => onInputBlur("BORROW", e)}
          value={borrowAmount}
          title={borrowAmount}
          autoComplete="off"
          inputRef={buyAmountInput}
          className={errorBuy && errorBuy.type === "amount" ? "has-error" : ""}
        />

        <TokenName>USDT</TokenName>

        <IncreaseAndDecreaseGroup
          type="amount"
          onDecreaseAmount={e => handleDecreaseAmount(e, "BORROW")}
          onIncreaseAmount={e => handleIncreaseAmount(e, "BORROW")}
        />

        {/* {isShowBuyMaxAmount && (
          <MaxAmountInfo title={buyMaxAmount}>
            Max: {BigNumber(buyMaxAmount).toFormat(2)}
          </MaxAmountInfo>
        )} */}
      </InputBox>

      <InputBox>
        <InputLabel>
          <FormattedMessage id="exchangeLendingPage.orderPlace.selectCollateral" />:
        </InputLabel>

        <InputValue>
          <SelectCollaterals 
            items={collateralTokens} 
            activeItem={collateralTokenSelected}
            onItemSelect={onCollateralSelect} 
          />
        </InputValue>
      </InputBox>

      {/* <FractionList
        side="BORROW"
        fraction={fraction}
        onInputChange={onInputChange}
      /> */}

      <Row mb="10px">
        <Title><FormattedMessage id="exchangeLendingPage.orderPlace.collateralRequired" />:</Title>
        <Value>
          <SmallText>USDT</SmallText>
        </Value>
      </Row>

      {authenticated && (
        <React.Fragment>
          <Row mb="10px">
            <Title><FormattedMessage id="portfolioPage.available" />:</Title>
            <Value title={`${truncateZeroDecimal(BigNumber(quoteTokenBalance).toFormat(pricePrecision))} ${quoteTokenSymbol}`}>
              <SmallText>{`${truncateZeroDecimal(BigNumber(quoteTokenBalance).toFormat(pricePrecision))} ${quoteTokenSymbol}`}</SmallText>
            </Value>
          </Row>

          <Row><ErrorMessage>{errorBuy && errorBuy.message}</ErrorMessage></Row>

          <BuyButton
            intent="success"
            text={<FormattedMessage id="exchangeLendingPage.orderPlace.borrow" />}
            name="order"
            onClick={() => handleSendOrder("BORROW")}
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
