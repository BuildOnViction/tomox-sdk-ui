// @flow
import React from 'react'
import styled from 'styled-components'
import FundsTableRenderer from './FundsTableRenderer'
import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'
import type { Symbol, TokenData } from '../../types/tokens'

type Props = {
  connected: boolean,
  tokenData: Array<TokenData>,
  baseTokens: Array<Symbol>,
  quoteTokens: Array<Symbol>,
}

type State = {
  isHideZeroBalanceToken: boolean,
  searchInput: string,
}

class FundsTable extends React.PureComponent<Props, State> {
  state = {
    isHideZeroBalanceToken: true,
    searchInput: '',
  }

  handleSearchInputChange = (e: SyntheticInputEvent<>) => {
    this.setState({ searchInput: e.target.value })
  }

  toggleZeroBalanceToken = () => {
    this.setState({ isHideZeroBalanceToken: !this.state.isHideZeroBalanceToken })
  }

  filterTokens = (data: Array<TokenData>) => {
    const { searchInput, isHideZeroBalanceToken } = this.state

    if (searchInput)
      data = data.filter(
        token => token.symbol.indexOf(searchInput.toUpperCase()) > -1
      )
    if (isHideZeroBalanceToken) data = data.filter(token => +token.balance !== 0)

    return data
  }

  render() {
    const {
      accountAddress,
      tokenData,
      quoteTokens,
      baseTokens,
      authenticated,
    } = this.props

    if (!authenticated) return null

    const {
      searchInput,
      isHideZeroBalanceToken,
    } = this.state

    const quoteTokenData = tokenData.filter(
      (token: TokenData) =>
        quoteTokens.indexOf(token.symbol) !== -1 &&
        token.symbol !== NATIVE_TOKEN_SYMBOL
    )
    const baseTokenData = tokenData.filter(
      (token: TokenData) =>
        baseTokens.indexOf(token.symbol) === -1 &&
        token.symbol !== NATIVE_TOKEN_SYMBOL
    )

    const TOMOTokenData = tokenData.filter(
      (token: TokenData) => token.symbol === NATIVE_TOKEN_SYMBOL
    )

    const filteredBaseTokenData = this.filterTokens(baseTokenData)
    const filteredQuoteTokenData = this.filterTokens(quoteTokenData)
    const filteredETHTokenData = this.filterTokens(TOMOTokenData)

    return (
      <Wrapper>
        <FundsTableRenderer
          authenticated={authenticated}
          baseTokensData={filteredBaseTokenData}
          quoteTokensData={filteredQuoteTokenData}
          TOMOTokenData={filteredETHTokenData[0]}
          tokenDataLength={tokenData.length}
          searchInput={searchInput}
          isHideZeroBalanceToken={isHideZeroBalanceToken}
          toggleZeroBalanceToken={this.toggleZeroBalanceToken}
          handleSearchInputChange={this.handleSearchInputChange}
          accountAddress={accountAddress}
        />
      </Wrapper>
    )
  }
}

export default FundsTable

const Wrapper = styled.div`
  height: 100%;
`
