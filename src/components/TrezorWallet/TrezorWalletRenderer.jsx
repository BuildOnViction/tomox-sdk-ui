import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { TmColors, ButtonLogin, Link as ExternalLink } from '../../components/Common'
import { Trezor } from '../../components/Icons'

const TrezorWalletRenderer = (props) => {
    const { 
        toggleSelectHdPathModal,
    } = props
  
    return (
      <Wrapper>      
        <Trezor size={80} />
  
        <InstructionBox>
            <ExternalLink href="https://docs.tomochain.com/" target="_blank" color={TmColors.ORANGE}><FormattedMessage id="unlockWalletPage.connectionIssues" /></ExternalLink>
            <ExternalLink href="https://docs.tomochain.com/" target="_blank" color={TmColors.ORANGE}><FormattedMessage id="unlockWalletPage.instructions" /></ExternalLink>
        </InstructionBox>
  
        <ButtonLogin onClick={() => toggleSelectHdPathModal('open')}><FormattedMessage id="unlockWalletPage.trezor.buttonTitle" /></ButtonLogin>
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

const InstructionBox = styled.div`
  width: 100%;  
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
`

export default TrezorWalletRenderer