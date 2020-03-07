// @flow
import React from 'react'
import styled from 'styled-components'
import CenteredSpinner from '../../components/Common/CenteredSpinner'
import DepositTable from '../../components/DepositTable'
import type { TokenData } from '../../types/tokens'

type Props = {
  gas: number,
  gasPrice: number,
  tomoBalance: string,
  tokenData: Array<TokenData>,
  baseTokens: Array<string>,
  quoteTokens: Array<string>,
  connected: boolean,
  accountAddress: string,
  redirectToTradingPage: string => void,
  balancesLoading: boolean
};

const WalletPageRenderer = (props: Props) => {
  const {
    tokenData,
    baseTokens,
    quoteTokens,
    connected,
    redirectToTradingPage,
    redirectToLendingPage,
    balancesLoading,
    accountAddress,
    copyDataSuccess,
    mode,
  } = props  

  return (
    <WalletPageBox>
      <WalletPageContentBox>
        {balancesLoading ? (
          <CenteredSpinner />
        ) : (
          <DepositTable
            connected={connected}
            tokenData={tokenData}
            baseTokens={baseTokens}
            quoteTokens={quoteTokens}
            redirectToTradingPage={redirectToTradingPage}
            redirectToLendingPage={redirectToLendingPage}
            accountAddress={accountAddress}
            copyDataSuccess={copyDataSuccess}
            mode={mode}
          />
        )}
      </WalletPageContentBox>
    </WalletPageBox>
  )
}

const WalletPageBox = styled.div`
  height: 100%;
`

const WalletPageContentBox = styled.div`
  height: 100%;
  width: 100%;
`

export default WalletPageRenderer
