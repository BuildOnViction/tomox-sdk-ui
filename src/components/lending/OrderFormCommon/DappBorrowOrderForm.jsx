import React from "react"
import { FormattedMessage } from "react-intl"
import BigNumber from 'bignumber.js'

import { 
  // FractionList, 
  // IncreaseAndDecreaseGroup,
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
} from './index'
import SelectCollaterals from '../../SelectCollaterals'
import { truncateZeroDecimal } from '../../../utils/helpers'
import { pricePrecision } from "../../../config/tokens"

const DappBorrowOrderForm = props => {
  const {
    borrowInterest,
    borrowAmount,
    // buyMaxAmount,
    // fraction,
    onInputChange,
    onInputFocus,
    onInputBlur,
    handleSendOrder,
    // handleDecreasePrice,
    // handleIncreasePrice,
    // handleDecreaseAmount,
    // handleIncreaseAmount,
    errorBuy,
    // isShowBuyMaxAmount,
    buyPriceInput,
    buyAmountInput,
    authenticated,
    collateralTokens,
    collateralSelected,
    onCollateralSelect,
    currentPair,
    estimateCollateral,
  } = props

  return (
    <Wrapper>
      <HeaderRow>
        <BaseToken>
          <FormattedMessage id="exchangeLendingPage.orderPlace.borrow" /> {currentPair.lendingTokenSymbol} in {currentPair.termSymbol}
        </BaseToken>
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

        <TokenName>&#37;</TokenName>

        {/* <IncreaseAndDecreaseGroup
          type="price"
          onDecreasePrice={e => handleDecreasePrice(e, "BORROW")}
          onIncreasePrice={e => handleIncreasePrice(e, "BORROW")}
        /> */}
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

        <TokenName>{currentPair.lendingTokenSymbol}</TokenName>

        {/* <IncreaseAndDecreaseGroup
          type="amount"
          onDecreaseAmount={e => handleDecreaseAmount(e, "BORROW")}
          onIncreaseAmount={e => handleIncreaseAmount(e, "BORROW")}
        /> */}

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
            activeItem={collateralSelected}
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
          <SmallText>{estimateCollateral && truncateZeroDecimal(BigNumber(estimateCollateral).toFormat(8))}&#32;{collateralSelected && collateralSelected.symbol}</SmallText>
        </Value>
      </Row>

      {authenticated && (
        <React.Fragment>
          <Row mb="10px">
            <Title><FormattedMessage id="portfolioPage.available" />:</Title>
            {collateralSelected && (
              <Value title={`${truncateZeroDecimal(BigNumber(collateralSelected.availableBalance).toFormat(pricePrecision))} ${collateralSelected.symbol}`}>
                <SmallText>{`${truncateZeroDecimal(BigNumber(collateralSelected.availableBalance).toFormat(pricePrecision))} ${collateralSelected.symbol}`}</SmallText>
              </Value>
            )}
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
          text={<FormattedMessage id="exchangeLendingPage.orderPlace.onlyForTomoWallet" />}
          name="order"
          fill
        />
      )}
    </Wrapper>
  )
}

export default DappBorrowOrderForm
