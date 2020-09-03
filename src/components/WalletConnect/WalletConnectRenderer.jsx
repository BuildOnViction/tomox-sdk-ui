import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Centered, ButtonLogin } from '../Common'

import walletConnectUrl from '../../assets/images/wallet-connect.svg'

function WalletConnectRender({ unlockWallet }) {
    return (
        <WalletWrapper>
            <Centered><img width="130px" src={walletConnectUrl} alt="Pantograph" /></Centered>
            <ButtonLogin onClick={unlockWallet}><FormattedMessage id="unlockWalletPage.unlockWallet" /></ButtonLogin>
        </WalletWrapper>
    )
}


const WalletWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 395px;
    margin: 0 auto;
`

export default WalletConnectRender