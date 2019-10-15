// @flow
import React from 'react'
import Modal from '../Modal'
import styled from 'styled-components'
import { Label, Button } from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
import { TmColors, Theme, SmallText } from '../../components/Common'

type Props = {
  isOpen: boolean,
  handleClose: (SyntheticEvent<>) => void,
}

const SessionPasswordModal = (props: Props) => (
    <Modal
        title="Session Password"
        icon="info-sign"
        isOpen={props.isOpen}
        onClose={props.handleClose}
        className="dark-dialog sm"
    >
        <LabelWrapper>
            <InputGroupWrapper 
                type="password" 
                value={props.password} 
                isInvalid={props.passwordStatus === 'incorrect'} 
                onChange={props.onChange} 
                onKeyPress={props.unlockWalletOnKeyPress}
                marginBottom="5px" />
        </LabelWrapper>     
        {(props.passwordStatus === 'incorrect') && <ErrorMessage><FormattedMessage id="unlockWalletPage.wrongPassword" /></ErrorMessage>}
        {/* <SmallText><FormattedMessage id="unlockWalletPage.describePassword" /></SmallText> */}

        <ButtonWrapper onClick={props.unlockWallet}><FormattedMessage id="unlockWalletPage.unlockWallet" /></ButtonWrapper>
    </Modal>
)

export default SessionPasswordModal

const LabelWrapper = styled(Label)`
    margin-bottom: 0 !important;
    &:not(:first-child) {
        margin-top: 35px;
    }
`

const ButtonWrapper = styled(Button)`
    display: block;
    margin-top: ${props => props.margintop ? props.margintop : '25px'};
    margin-left: auto;
    margin-right: auto;
    width: ${props => props.width ? props.width : '100%'};
    text-align: center;
    color: ${TmColors.BLACK} !important;
    border-radius: 0;
    background-color: ${TmColors.ORANGE} !important;
    box-shadow: none !important;
    background-image: none !important;
    height: 40px;
    &:hover {
        background-color: ${TmColors.DARK_ORANGE} !important;
    }

    &.bp3-disabled {
        cursor: default !important;
        background-color: ${TmColors.GRAY} !important;
    }

    .bp3-spinner {
        display: inline-block;
        margin-left: 5px;
    }
`

const InputGroupWrapper = styled.input`
    height: 50px;
    color: ${TmColors.WHITE};
    font-size: ${Theme.FONT_SIZE_LG};
    padding: 15px;
    margin-top: 0 !important;
    margin-bottom: ${props => props.marginBottom ? props.marginBottom : '35px'};
    background: ${TmColors.BLACK};
    border: ${props => props.isInvalid ? `1px solid ${TmColors.RED} !important` : 'none'};
    width: 100%;

    &:focus {
        border: 1px solid ${TmColors.ORANGE};
    }
`

const ErrorMessage = styled(SmallText)`
    color: ${TmColors.RED};
`
