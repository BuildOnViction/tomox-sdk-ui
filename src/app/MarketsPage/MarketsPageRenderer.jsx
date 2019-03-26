// @flow
import React from 'react'
import styled from 'styled-components'
import CenteredSpinner from '../../components/Common/CenteredSpinner'
import MarketsTable from '../../components/MarketsTable'

type Props = {
  loading: boolean,
}

const MarketsPageRenderer = (props: Props) => {
  const {
    loading,
  } = props

  return (
    <WalletPageBox>
      {loading ? (
        <CenteredSpinner />
      ) : (
          <MarketsTable />
      )}
    </WalletPageBox>
  )
}


const WalletPageBox = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  overflow: hidden;
`

export default MarketsPageRenderer
