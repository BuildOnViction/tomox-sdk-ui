import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { TmColors, SmallText, ButtonLogin } from '../../components/Common'
import { Metamask } from '../../components/Icons'

const MetaMaskRenderer = (props) => {
    const { 
        unlockWallet,
        error,
    } = props
  
    return (
      <Wrapper>
        <Centered><Metamask size={80} /></Centered>
        {!error && (<Note>
            <FormattedMessage 
                id="unlockWalletPage.metaMaskNote"
                values={{link: (<a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Metamask Extension</a>)}} />
        </Note>)}

        {error && (
            <React.Fragment>
                <ErrorMessage><FormattedMessage id="unlockWalletPage.metaMaskError1" /></ErrorMessage>
                <ErrorMessage><FormattedMessage id="unlockWalletPage.metaMaskError2" /></ErrorMessage>
            </React.Fragment>
        )}
        <ButtonLogin onClick={unlockWallet}><FormattedMessage id="unlockWalletPage.unlockWallet" /></ButtonLogin>
      </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 395px;
    margin: 0 auto;
`

const Centered = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
`

const Note = styled(SmallText)`
    a {
        color: ${TmColors.ORANGE};
        &:hover {
            color: ${TmColors.DARK_ORANGE};
        }
    }
`

const ErrorMessage = styled.div`
    color: ${TmColors.RED};
    font-size: 12px;
    margin-top: 7px;
`

export default MetaMaskRenderer

