// @flow
import React from 'react'
import styled from 'styled-components'
import CenteredSpinner from '../../components/Common/CenteredSpinner'
import DepositTable from '../../components/DepositTable'

const WalletPageRenderer = ({balancesLoading, ...rest}) => {

  return (
    <WalletPageBox>
      <WalletPageContentBox>
        {balancesLoading ? (
          <CenteredSpinner />
        ) : (
          <DepositTable {...rest} />
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
