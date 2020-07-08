// @flow
import React from 'react'
import { Checkbox, InputGroup } from '@blueprintjs/core'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { withRouter, Link as RouterLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import {
  RowSpaceBetween,
  TokenImage,
  MutedText,
  Theme,
  TmColors,
  Link,
  Text,
  UtilityIcon,
  Centered,
  SmallText,
} from '../Common'
import { pricePrecision } from '../../config/tokens'
import { TOMOSCAN_URL } from '../../config/environment'
import type { TokenData } from '../../types/tokens'
import tickUrl from '../../assets/images/tick.svg'
import doubleArrowsUpUrl from '../../assets/images/double_arrows_up.svg'

type Props = {
  baseTokensData: Array<TokenData>,
  quoteTokensData: Array<TokenData>,
  TOMOTokenData: TokenData,
  tokenDataLength: number,
  searchInput: string,
  handleSearchInputChange: (SyntheticEvent<>) => void,
  isHideZeroBalanceToken: boolean,
  openSendModal: string => void,
  toggleZeroBalanceToken: void => void,
  redirectToTradingPage: string => void,
  showBalance: Boolean
}
const DepositTableRenderer = (props: Props) => {
  const {
    isHideZeroBalanceToken,
    toggleZeroBalanceToken,
    searchInput,
    handleSearchInputChange,
    tokenDataLength,
    openReceiveDialog,
    openSendModal,
    totalBalance,
    showBalance,
    updateShowHideBalance,
  } = props

  return (
    
    <React.Fragment>
      <HeaderPage>
        <MainTitle>
          <FormattedMessage id="portfolioPage.balance" /> 
          <SmallText muted>&asymp; {showBalance ? '$' + BigNumber(totalBalance).toFormat(2) : '********'}</SmallText>
        </MainTitle>

        <ShowHideBalance onClick={() => updateShowHideBalance(!showBalance)}>
          <SmallText>
          {!showBalance
            ? (
            <><i className="fa fa-eye" aria-hidden="true" /> <FormattedMessage id="portfolioPage.showbalancetext" /></>
            )
            : (
            <><i className="fa fa-eye-slash" aria-hidden="true" /> <FormattedMessage id="portfolioPage.hidebalancetext" /></>
            )
          }
          </SmallText>
        </ShowHideBalance>
      </HeaderPage>

      <TableSection>
        <RowSpaceBetween style={{ marginBottom: '10px' }}>
          <OperationButtonWrapper>
            <MarginButton onClick={openSendModal}>
              <DoubleArrowsUpIcon src={doubleArrowsUpUrl} alt="Send icon"></DoubleArrowsUpIcon>
              <FormattedMessage id="portfolioPage.send" />
            </MarginButton>
            <MarginButton onClick={openReceiveDialog}>
              <DoubleArrowsDownIcon src={doubleArrowsUpUrl} alt="Receive icon"></DoubleArrowsDownIcon>
              <FormattedMessage id="portfolioPage.receive" />
            </MarginButton>

            <CheckboxWrapper
              label={<FormattedMessage id="portfolioPage.hideZeroAmounts" />}
              checked={isHideZeroBalanceToken}  
              onChange={toggleZeroBalanceToken} />
          </OperationButtonWrapper>
          
          <SearchWrapper
            type="search"
            leftIcon="search"
            placeholder="Search"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </RowSpaceBetween>
        <Table>
          <TableHeader>
            <TableHeaderCell width="18%"><MutedText><FormattedMessage id="portfolioPage.coin" /></MutedText></TableHeaderCell>
            <TableHeaderCell width="20%"><MutedText><FormattedMessage id="portfolioPage.total" /></MutedText></TableHeaderCell>
            <TableHeaderCell width="20%"><MutedText><FormattedMessage id="portfolioPage.availableAmount" /></MutedText></TableHeaderCell>
            <TableHeaderCell width="17%"><MutedText><FormattedMessage id="portfolioPage.inOrders" /></MutedText></TableHeaderCell>
            <TableHeaderCell width="25%">
              <MutedText><FormattedMessage id="portfolioPage.operation" /></MutedText>
            </TableHeaderCell>
          </TableHeader>
        </Table>
        <TableBodyContainer>
          <Table>
            <TableBody>
              <TOMORow {...props} />
              <QuoteTokenRows {...props} />
              <BaseTokenRows {...props} />
            </TableBody>
          </Table>
          {tokenDataLength === 0 && <NoItems />}
        </TableBodyContainer>
      </TableSection>
    </React.Fragment>
  )
}

const NoItems = () => {
  return (
    <Centered my={4}>
      <UtilityIcon name="not-found" />
      <Text color={TmColors.GRAY}><FormattedMessage id="portfolioPage.notFound" />.</Text>
    </Centered>
  )
}

const TOMORow = (props: Props) => {
  const {
    accountAddress,
    TOMOTokenData,
    redirectToTradingPage,
    redirectToLendingPage,
    lendingTokenSymbols,
    collateralTokenSymbols,
    showBalance,
  } = props

  if (!TOMOTokenData) return null

  const { address, symbol, balance, inOrders, availableBalance, usdBalance } = TOMOTokenData

  return (
    <Row key="TOMO">
      <Cell width="18%">
        <TokenNameWrapper>
          <TokenImage tokenAddress={address} size={30} />
          <Link href={`${TOMOSCAN_URL}/address/${accountAddress}`} target="_blank">{symbol}</Link>
        </TokenNameWrapper>
      </Cell>
      <Cell width="20%">
        <Ellipsis title={balance}>{showBalance ? BigNumber(balance).toFormat(pricePrecision) : '********'}</Ellipsis>
        <Ellipsis muted>{showBalance ? '$' + BigNumber(usdBalance).toFormat(2) : '********'}</Ellipsis>
      </Cell>
      <Cell width="20%">
        <Ellipsis>{showBalance ? BigNumber(availableBalance).toFormat(pricePrecision) : '********'}</Ellipsis>
      </Cell>
      <Cell width="17%">
        <Ellipsis>{showBalance ? BigNumber(inOrders).toFormat(pricePrecision) : '********'}</Ellipsis>
      </Cell>
      <Cell width="25%">
        <ButtonWrapper>
          <OperationsBox>
            <OperationButton onClick={() => redirectToTradingPage(symbol)}>
              <FormattedMessage id="portfolioPage.trade" />
            </OperationButton>

            {
              (lendingTokenSymbols.includes(symbol)) && (
                <OperationButton onClick={() => redirectToLendingPage(symbol)}>
                  <FormattedMessage id="portfolioPage.lend" />
                </OperationButton>
              )
            }

            {
              (!lendingTokenSymbols.includes(symbol) && collateralTokenSymbols.includes(symbol)) && (
                <OperationButton onClick={() => redirectToLendingPage(symbol)}>
                  <FormattedMessage id="portfolioPage.borrow" />
                </OperationButton>
              )
            }
          </OperationsBox>
        </ButtonWrapper>
      </Cell>
    </Row>
  )
}

const QuoteTokenRows = (props: Props) => {
  const {
    accountAddress,
    quoteTokensData,
    redirectToTradingPage,
    redirectToLendingPage,
    lendingTokenSymbols,
    collateralTokenSymbols,
    showBalance,
  } = props

  if (!quoteTokensData) return null

  return quoteTokensData.map(
    ({ symbol, balance, inOrders, availableBalance, address, verified, usdBalance }, index) => {
      return (
        <Row key={index}>
          <Cell width="18%">
            <TokenNameWrapper>
              <TokenImage tokenAddress={address} size={30} />
              <Link href={`${TOMOSCAN_URL}/tokens/${address}/trc21/${accountAddress}`} target="_blank">{symbol}</Link>
            </TokenNameWrapper>
          </Cell>
          <Cell width="20%">
            <Ellipsis title={balance}>{showBalance ? BigNumber(balance).toFormat(pricePrecision) : '********'}</Ellipsis>
            <Ellipsis muted>{showBalance ? '$' + BigNumber(usdBalance).toFormat(2) : '********'}</Ellipsis>
          </Cell>
          <Cell width="20%">
            <Ellipsis>{showBalance ? BigNumber(availableBalance).toFormat(pricePrecision) : '********'}</Ellipsis>
          </Cell>
          <Cell width="17%">
            <Ellipsis>{showBalance ? BigNumber(inOrders).toFormat(pricePrecision) : '********'}</Ellipsis>
          </Cell>
          <Cell width="25%">
            <ButtonWrapper>
              <OperationsBox>
                <OperationButton onClick={() => redirectToTradingPage(symbol)}>
                  <FormattedMessage id="portfolioPage.trade" />
                </OperationButton>

                {
                  (lendingTokenSymbols.includes(symbol)) && (
                    <OperationButton onClick={() => redirectToLendingPage(symbol)}>
                      <FormattedMessage id="portfolioPage.lend" />
                    </OperationButton>
                  )
                }

                {
                  (!lendingTokenSymbols.includes(symbol) && collateralTokenSymbols.includes(symbol)) && (
                    <OperationButton onClick={() => redirectToLendingPage(symbol)}>
                      <FormattedMessage id="portfolioPage.borrow" />
                    </OperationButton>
                  )
                }
              </OperationsBox>

              {verified && (
                <>
                  <InternalLink to={`/wallet/deposit/${symbol}`}>
                    <FormattedMessage id="portfolioPage.deposit" />
                  </InternalLink>

                  <InternalLink to={`/wallet/withdraw/${symbol}`}>
                    <FormattedMessage id="portfolioPage.withdrawal" />
                  </InternalLink>
                </>
              )}
            </ButtonWrapper>
          </Cell>
        </Row>
      )
    }
  )
}

const BaseTokenRows = (props: Props) => {
  const {
    accountAddress,
    baseTokensData,
    redirectToTradingPage,
    redirectToLendingPage,
    lendingTokenSymbols,
    collateralTokenSymbols,
    showBalance,
  } = props

  if (!baseTokensData) return null

  return baseTokensData.map(
    ({ symbol, balance, inOrders, availableBalance, address, verified, usdBalance }, index) => {
      return (
        <Row key={index}>
          <Cell width="18%">
            <TokenNameWrapper>
              <TokenImage tokenAddress={address} size={30} />
              <Link href={`${TOMOSCAN_URL}/tokens/${address}/trc21/${accountAddress}`} target="_blank">{symbol}</Link>
            </TokenNameWrapper>
          </Cell>
          <Cell width="20%">
            <Ellipsis title={BigNumber(balance).toFormat(pricePrecision)}>{showBalance ? BigNumber(balance).toFormat(pricePrecision) : '********'}</Ellipsis>
            <Ellipsis muted>{showBalance ? '$' + BigNumber(usdBalance).toFormat(2) : '********'}</Ellipsis>
          </Cell>
          <Cell width="20%">
            <Ellipsis>{showBalance ? BigNumber(availableBalance).toFormat(pricePrecision) : '********'}</Ellipsis>
          </Cell>
          <Cell width="17%">
            <Ellipsis>{showBalance ? BigNumber(inOrders).toFormat(pricePrecision) : '********'}</Ellipsis>
          </Cell>
          <Cell width="25%">
            <ButtonWrapper>
              <OperationsBox>
                <OperationButton onClick={() => redirectToTradingPage(symbol)}>
                  <FormattedMessage id="portfolioPage.trade" />
                </OperationButton>

                {
                  (lendingTokenSymbols.includes(symbol)) && (
                    <OperationButton onClick={() => redirectToLendingPage(symbol)}>
                      <FormattedMessage id="portfolioPage.lend" />
                    </OperationButton>
                  )
                }

                {
                  (!lendingTokenSymbols.includes(symbol) && collateralTokenSymbols.includes(symbol)) && (
                    <OperationButton onClick={() => redirectToLendingPage(symbol)}>
                      <FormattedMessage id="portfolioPage.borrow" />
                    </OperationButton>
                  )
                }
              </OperationsBox>

              {verified && (
                <>
                  <InternalLink to={`/wallet/deposit/${symbol}`}>
                    <FormattedMessage id="portfolioPage.deposit" />
                  </InternalLink>

                  <InternalLink to={`/wallet/withdraw/${symbol}`}>
                    <FormattedMessage id="portfolioPage.withdrawal" />
                  </InternalLink>
                </>
              )}             
            </ButtonWrapper>
          </Cell>
        </Row>
      )
    }
  )
}

const HeaderPage = styled.div`
  display: flex;
  align-items: center;
`

const MainTitle = styled.h1`
  font-size: ${Theme.FONT_SIZE_H1};
  font-weight: 400;
  margin-bottom: 20px;
`

const SearchWrapper= styled(InputGroup)`
  .bp3-input {
    color: ${TmColors.LIGHT_GRAY};
    min-width: 300px;
    background: ${props => props.theme.subBg};
    border-radius: 0 !important;
    &:focus, 
    &.bp3-active {
      box-shadow: none;
    }
  }
`

const Table = styled.div.attrs({
  className: 'bp3-html-table bp3-interactive bp3-html-table-striped',
})`
  width: 100%;
`

const TableHeader = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;  
  padding: 0 20px;
  &:last-child {
    flex-grow: 2;
  }
`

const TableHeaderCell = styled.div`
  display: flex;
  width: ${props => props.width || '15%'};
  justify-content: ${({align}) => align || 'flex-start'};
  flex-grow: ${({flexGrow}) => flexGrow || 0}
`

const TableBodyContainer = styled.div`
  width: 100%;
  height: 80%;
  overflow-y: auto;
`

const TableSection = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: column;
  height: 100%;
  width: 99%;
`

const TableBody = styled.div`
  height: calc(100% - 100px);
  color: ${props => props.theme.textTable};
`

const Cell = styled.div`
  width: ${({width}) => width || '15%'};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({align}) => align || 'flex-start'}
  flex-grow: ${({flexGrow}) => flexGrow || 0}
`

const Row = styled.div`
  display: flex;
  width: 100%;
  height: ${Theme.ROW_HEIGHT_LG};
  padding: 0 20px;

  &:nth-child(2n+1) {
    background: ${props => props.theme.subBg};
  }

  @media only screen and (max-width: ${Theme.BREAK_POINT_MD}) {
    height: ${Theme.ROW_HEIGHT_MD};
    font-size: ${Theme.FONT_SIZE_SM};
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const OperationsBox = styled.div`
  min-width: 35%;
  display: flex;
  justify-content: space-between;
`

const OperationButton = styled.button.attrs(({ disabled }) => ({
  disabled,
}))`
  border: none;
  background: transparent;
  padding: 5px 0;
  cursor: pointer;
  color: ${props => props.theme.textTable};
  font-size: ${Theme.FONT_SIZE_MD};

  &[disabled] {
    cursor: default;
  }
  
  &:hover {
    color: ${TmColors.ORANGE};
  }
`

const InternalLink = styled(RouterLink)`
  display: inline-block;
  padding: 5px 0;
  cursor: pointer;
  color: ${props => props.theme.textTable};
  font-size: ${Theme.FONT_SIZE_MD};

  &:hover {
    color: ${TmColors.ORANGE};
  }
`

const MarginButton = styled(OperationButton)`
  display: flex;
  justify-content: center;
  margin-right: 25px;
`
const ShowHideBalance = styled(MarginButton)`
    display: inline-block;
    border: 1px solid ${TmColors.GRAY};
    color: ${TmColors.GRAY};
    padding: 2px 5px;
    border-radius: 5px;
    margin-left: 30px;
    &:hover > span {
      color: ${TmColors.LIGHT_GRAY};
    }
    > span{
      display: flex;
      justify-content: center;
      align-items: center;
      color: ${TmColors.GRAY};
    }
    i{
      margin-right: 5px;
    }
`
const OperationButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`

const TokenNameWrapper = styled.div`
  display: flex;
  align-items: center;
  & svg,
  & img {
    margin-right: 12px;
  }
`

const CheckboxWrapper = styled(Checkbox)`
  font-size: ${Theme.FONT_SIZE_SM};
  text-align: center;
  margin-bottom: 0 !important;

  .bp3-control-indicator {
    box-shadow: none !important;
    background-image: none !important;
    background-color: ${props => props.theme.checkboxBg} !important;
  }

  input:checked ~ .bp3-control-indicator {
    background-color: ${TmColors.ORANGE} !important;
  }

  input:checked ~ .bp3-control-indicator::before {
    background: url(${tickUrl}) no-repeat center center !important;
  }import TokenImage from '../Common/TokenImage';

`

const Ellipsis = styled.span`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.muted ? TmColors.GRAY : 'inherit'};
  font-size: ${props => props.muted ? Theme.FONT_SIZE_SM : 'inherit'};
`

const DoubleArrowsUpIcon = styled.img`
  margin-right: 10px;
`

const DoubleArrowsDownIcon = styled(DoubleArrowsUpIcon)`
  transform: rotate(180deg);
`

export default withRouter(DepositTableRenderer)
