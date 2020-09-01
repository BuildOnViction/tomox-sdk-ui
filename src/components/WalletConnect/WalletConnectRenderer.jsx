import React from 'react'
import styled from 'styled-components'

import { ButtonLogin } from '../Common'

function WalletConnectRender({ unlockWallet }) {
    return (
        <WalletWrapper>
            <ButtonLogin onClick={unlockWallet}>Connect to Wallet</ButtonLogin>
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