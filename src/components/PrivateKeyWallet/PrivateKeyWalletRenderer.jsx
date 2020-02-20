import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Label, Spinner } from '@blueprintjs/core'

import { TmColors, Theme, SmallText, ButtonLogin } from '../../components/Common'

type Props = { 
    privateKey: String, 
    privateKeyStatus: String, 
    handlePrivateKeyChange: void => void, 
    unlockWallet: void => void,
    unlockWalletByKeyPress: void => void,
    password: String,
    passwordStatus: String,
    handlePasswordChange: void => void,
    loading: Boolean,
}

const PrivateKeyWalletRenderer = (props: Props) => {
    const { 
      privateKey, 
      privateKeyStatus, 
      handlePrivateKeyChange, 
      unlockWallet,
      unlockWalletByKeyPress,
      password,
      passwordStatus,
      handlePasswordChange,
      loading,
    } = props
  
    return (
        <WalletWrapper>
            <LabelWrapper>
                <LabelTitle><FormattedMessage id="unlockWalletPage.privateKey.labelPrivateKey" /></LabelTitle> 
                <InputGroupWrapper 
                    marginBottom="5px" 
                    type="text" 
                    value={privateKey} 
                    isInvalid={privateKeyStatus === 'invalid'} 
                    onChange={handlePrivateKeyChange}
                    autoComplete="off" 
                    readOnly 
                    onFocus={(event) => event.target.removeAttribute('readonly')} />
            </LabelWrapper>
            {(privateKeyStatus === 'invalid') && (<ErrorMessage><FormattedMessage id="unlockWalletPage.privateKey.invalid" /></ErrorMessage>)}
    
            <LabelWrapper>
                <LabelTitle><FormattedMessage id="unlockWalletPage.labelPassword" /></LabelTitle> 
                <InputGroupWrapper 
                    type="password" 
                    value={password} 
                    onChange={handlePasswordChange} 
                    onKeyPress={unlockWalletByKeyPress} 
                    isInvalid={passwordStatus === 'invalid'} 
                    marginBottom="5px"
                    autoComplete="off" 
                    readOnly 
                    onFocus={(event) => event.target.removeAttribute('readonly')} />
            </LabelWrapper>          
            <SmallText><FormattedMessage id="unlockWalletPage.describePassword" /></SmallText>          
    
            <ButtonLogin onClick={unlockWallet} disabled={passwordStatus !== 'valid' || privateKeyStatus !== 'valid'}>
                <FormattedMessage id="unlockWalletPage.unlockWallet" />
                {loading && <Spinner intent="PRIMARY" size={Spinner.SIZE_SMALL} />}
            </ButtonLogin>
            <Warning><FormattedMessage id="unlockWalletPage.notRecommended" /></Warning>
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

const LabelWrapper = styled(Label)`
  margin-bottom: 0 !important;
  width: 100%;
  &:not(:first-child) {
    margin-top: 35px;
  }
`

const LabelTitle = styled.div`
  margin-bottom: 25px;
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

const ErrorMessage = styled.div`
    color: ${TmColors.RED};
    font-size: 12px;
    margin-top: 7px;
    width: 100%;
`

const Warning = styled(SmallText)`
    color: ${TmColors.RED};
    width: 100%;
    margin-top: 10px;
    text-align: center;
`

export default PrivateKeyWalletRenderer

