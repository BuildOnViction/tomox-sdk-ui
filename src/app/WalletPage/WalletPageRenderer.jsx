// @flow
import React from 'react'
import styled from 'styled-components'
import CenteredSpinner from '../../components/Common/CenteredSpinner'
import DepositTable from '../../components/DepositTable'
import GetStartedModal from '../../components/GetStartedModal'
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
  toggleAllowance: string => void,
  redirectToTradingPage: string => void,
  isHelpModalOpen: boolean,
  closeHelpModal: void => void,
  balancesLoading: boolean
};

const WalletPageRenderer = (props: Props) => {
  const {
    tokenData,
    baseTokens,
    quoteTokens,
    connected,
    toggleAllowance,
    redirectToTradingPage,
    isHelpModalOpen,
    closeHelpModal,
    balancesLoading,
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
            toggleAllowance={toggleAllowance}
            redirectToTradingPage={redirectToTradingPage}
          />
        )}
      </WalletPageContentBox>

      <GetStartedModal
        isOpen={isHelpModalOpen}
        closeHelpModal={closeHelpModal}
      />
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
