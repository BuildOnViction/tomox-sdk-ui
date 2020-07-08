// @flow
import React from 'react'
import styled from 'styled-components'
import DepositTableRenderer from './DepositTableRenderer'
import TransferTokensModal from '../../components/TransferTokensModal'
import ReceiveTokensModal from '../../components/ReceiveTokensModal'
import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'
import type { Symbol, TokenData } from '../../types/tokens'
import {
  TomoXLogo,
  Centered,
  LargeText,
} from '../Common'

type Props = {
  connected: boolean,
  toggleAllowance: Symbol => void,
  tokenData: Array<TokenData>,
  baseTokens: Array<Symbol>,
  quoteTokens: Array<Symbol>,
  redirectToTradingPage: string => void,
}

type State = {
  isSendModalOpen: Boolean,
  selectedToken: Object,
  isHideZeroBalanceToken: Boolean,
  searchInput: String,
  isOpenReceiveDialog: Boolean,
}

class DepositTable extends React.PureComponent<Props, State> {
  state = {
    isSendModalOpen: false,
    selectedToken: null,
    isHideZeroBalanceToken: false,
    searchInput: '',
    isOpenReceiveDialog: false,
  }

  openSendModal = (symbol: Symbol) => {
    const selectedToken = this.props.tokenData.filter(
      elem => elem.symbol === symbol
    )[0]

    this.setState({
      isSendModalOpen: true,
      selectedToken,
    })
  }

  closeSendModal = () => {
    this.setState({ isSendModalOpen: false })
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

  openReceiveDialog = () => {
    this.setState({ isOpenReceiveDialog: true })
  }

  closeReceiveDialog = () => {
    this.setState({ isOpenReceiveDialog: false })
  }

  notifyCopiedSuccess = () => {
    this.props.copyDataSuccess()
  }

  render() {

    const addresses = JSON.parse(sessionStorage.getItem('addresses'))
    if (!addresses) {
      return (
        <Centered my={4}>
          <TomoXLogo height="100em" width="100em" />
          <LargeText muted>No tokens to display!</LargeText>
        </Centered>
      )
    }

    const {
      props: {
        connected,
        tokenData,
        quoteTokens,
        baseTokens,
        redirectToTradingPage,
        redirectToLendingPage,
        accountAddress,
        mode,
        showBalance,
        lendingTokenSymbols,
        collateralTokenSymbols,
        totalBalance,
        updateShowHideBalance,
      },
      state: {
        isSendModalOpen,
        selectedToken,
        searchInput,
        isHideZeroBalanceToken,
        isOpenReceiveDialog,
      },
      notifyCopiedSuccess,
      closeReceiveDialog,
    } = this

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
    const filteredTOMOTokenData = this.filterTokens(TOMOTokenData)
    const tokenDataLength = [...filteredBaseTokenData, ...filteredQuoteTokenData, ...filteredTOMOTokenData].length

    return (
      <Wrapper>
        <DepositTableRenderer
          connected={connected}
          baseTokensData={filteredBaseTokenData}
          quoteTokensData={filteredQuoteTokenData}
          TOMOTokenData={filteredTOMOTokenData[0]}
          tokenDataLength={tokenDataLength}
          searchInput={searchInput}
          isHideZeroBalanceToken={isHideZeroBalanceToken}
          openSendModal={this.openSendModal}
          toggleZeroBalanceToken={this.toggleZeroBalanceToken}
          handleSearchInputChange={this.handleSearchInputChange}
          redirectToTradingPage={redirectToTradingPage}
          redirectToLendingPage={redirectToLendingPage}
          accountAddress={accountAddress}
          isOpenReceiveDialog={isOpenReceiveDialog}
          openReceiveDialog={this.openReceiveDialog}
          closeReceiveDialog={this.closeReceiveDialog}
          notifyCopiedSuccess={this.notifyCopiedSuccess}
          lendingTokenSymbols={lendingTokenSymbols}
          collateralTokenSymbols={collateralTokenSymbols}
          totalBalance={totalBalance}
          showBalance={showBalance}
          updateShowHideBalance={updateShowHideBalance}
        />
        <TransferTokensModal
          isOpen={isSendModalOpen}
          handleClose={this.closeSendModal}
          token={selectedToken}
          mode={mode}
        />
        <ReceiveTokensModal
          notifyCopiedSuccess={notifyCopiedSuccess}
          accountAddress={accountAddress}
          isOpen={isOpenReceiveDialog} 
          onClose={closeReceiveDialog}
          mode={mode} />
      </Wrapper>
    )
  }
}

export default DepositTable

const Wrapper = styled.div`
  height: 100%;
`
