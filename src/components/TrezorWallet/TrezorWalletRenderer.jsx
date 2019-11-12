import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { TmColors, ButtonLogin, Link as ExternalLink } from '../../components/Common'
import SelectAddressModal from '../../components/SelectAddressModal'
import { Trezor } from '../../components/Icons'

const TrezorWalletRenderer = (props) => {
    const { 
      isSelectAddressModalOpen, 
      openAddressesTrezorDialog, 
      closeAddressesTrezorDialog,
      deviceService,
    } = props
  
    return (
      <Wrapper>      
        <Trezor size={80} />
  
        <InstructionBox>
            <ExternalLink href="https://docs.tomochain.com/" target="_blank" color={TmColors.ORANGE}><FormattedMessage id="unlockWalletPage.connectionIssues" /></ExternalLink>
            <ExternalLink href="https://docs.tomochain.com/" target="_blank" color={TmColors.ORANGE}><FormattedMessage id="unlockWalletPage.instructions" /></ExternalLink>
        </InstructionBox>
  
        <ButtonLogin onClick={ openAddressesTrezorDialog }><FormattedMessage id="unlockWalletPage.trezor.buttonTitle" /></ButtonLogin>
  
        <SelectAddressModal
          title="Trezor Address"
          isOpen={isSelectAddressModalOpen}
          handleClose={closeAddressesTrezorDialog}
          deviceService={deviceService}
        />
      </Wrapper>
    )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const InstructionBox = styled.div`
  width: 100%;  
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
`

export default TrezorWalletRenderer