// @flow
import React from 'react'
import {
  Button,
  Checkbox,
  Icon,
  Label,
  Dialog,
  Classes,
} from '@blueprintjs/core'
import PasswordStrengMeter from '../../components/PasswordStrengthMeter'
import styled from 'styled-components'
import { DarkMode, Theme } from '../../components/Common'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { Link } from "react-router-dom"
import tickUrl from '../../assets/images/tick.svg'
import backupWalletUrl from '../../assets/images/backup_wallet.svg'

type Props = {
  address: string,
  currentStep: string,
  complete: () => void,
  mnemonic: string,
  shuffedMnemonic: string[],
  inputMnemonic: string,
  goToPasswordStep: () => void,
  goToBackupStep: () => void,
  goToWarningStep: () => void,
  goToMnemonicStep: () => void,
  goToConfirmMnemonicStep: () => void,
  goBackToPreviousStep: () => void,
  handleChooseMnemonic: () => void,
  handleRemoveMnemonic: () => void,
  mnemonicErrorMessage: string, // convert to mnemonicStatus: 'initial | valid | invalid'
  notifyCopiedSuccess: () => void,
  togglePrivateKeyDialog: (status: string) => void,
  isOpenPrivateKeyDialog: boolean,
  privateKey: string,
  password: string,
  passwordStatus: string,
  showPassword: boolean,
  togglePassword: () => void,
  handlePasswordChange: () => void,
}

const CreateWalletPageRenderer = (props: Props) => {
  const {
    address,
    currentStep,
    complete,
    mnemonic,
    shuffedMnemonic,
    inputMnemonic,
    goToPasswordStep,
    goToBackupStep,
    goToWarningStep,
    goToMnemonicStep,
    goToConfirmMnemonicStep,
    goBackToPreviousStep,
    handleChooseMnemonic,
    handleRemoveMnemonic,
    mnemonicErrorMessage,
    notifyCopiedSuccess,
    togglePrivateKeyDialog,
    isOpenPrivateKeyDialog,
    privateKey,
    password,
    passwordStatus,
    showPassword,
    showConfirmPassword,
    togglePassword,
    handlePasswordChange,
    confirmPassword,
    confirmPasswordStatus,
    handleConfirmPasswordChange,
  } = props

  const content = {
    '0': (<WalletCreateStep 
            address={address}             
            goToPasswordStep={goToPasswordStep} />),
    '1': (<WalletPasswordStep 
            password={password}
            passwordStatus={passwordStatus}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            togglePassword={togglePassword}
            handlePasswordChange={handlePasswordChange}
            confirmPassword={confirmPassword}
            confirmPasswordStatus={confirmPasswordStatus}
            handleConfirmPasswordChange={handleConfirmPasswordChange}
            goToBackupStep={goToBackupStep} />),
    '2': (<WalletBackupStep goToWarningStep={goToWarningStep} />),
    '3': (<WalletWarningStep goToMnemonicStep={goToMnemonicStep} />),
    '4': (<WalletMnemonicStep 
            mnemonic={mnemonic} 
            notifyCopiedSuccess={notifyCopiedSuccess} 
            goToConfirmMnemonicStep={goToConfirmMnemonicStep}
            privateKey={privateKey}
            togglePrivateKeyDialog={togglePrivateKeyDialog}
            isOpenPrivateKeyDialog={isOpenPrivateKeyDialog} />),
    '5': (<WalletConfirmMnemonicStep
            inputMnemonic={inputMnemonic}
            shuffedMnemonic={shuffedMnemonic} 
            mnemonicErrorMessage={mnemonicErrorMessage} 
            handleChooseMnemonic={handleChooseMnemonic}
            handleRemoveMnemonic={handleRemoveMnemonic}
            goBackToPreviousStep={goBackToPreviousStep}
            complete={complete} />),
  }

  return (
    <React.Fragment>
      { content[currentStep] }
    </React.Fragment>
  )
}

const WalletCreateStep = props => {
  const { address, goToPasswordStep } = props

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>Create New Wallet</HeaderTitle>
        <HeaderSubTitle><LinkWrapper to="/unlock">Sign in</LinkWrapper> to your wallet or <LinkWrapper to="/unlock">Import accounts</LinkWrapper></HeaderSubTitle>
      </Header>

      <Divider />

      <Content>
        <LabelWrapper>
          <LabelTitle>Account name:</LabelTitle>
          <InputGroupWrapper />
        </LabelWrapper>

        <LabelWrapper>
          <LabelTitle>Account address:</LabelTitle>
          <InputGroupWrapper value={address} readOnly />
        </LabelWrapper>

        <CheckboxWrapper checked={true} label="Keep the account on  this computer" onChange={goToPasswordStep} />   

        <ButtonWrapper fill={true} onClick={goToPasswordStep}>Continue</ButtonWrapper>
      </Content>
    </Wrapper>
  )
}

const WalletPasswordStep = props => {
  const { 
    password, 
    passwordStatus, 
    showPassword, 
    showConfirmPassword,
    handlePasswordChange, 
    goToBackupStep,
    togglePassword,
    confirmPassword,
    confirmPasswordStatus,
    handleConfirmPasswordChange,
  } = props

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>Protect Your Account</HeaderTitle>
        <HeaderSubTitle>Protect your account or <LinkWrapper to="/unlock">Sign in</LinkWrapper> to a saved account</HeaderSubTitle>
      </Header>

      <Divider />

      <Content>
        <LabelWrapper>
          <LabelTitle>New password:</LabelTitle>

          <InputBox>
            <InputGroupWrapper hasError={ passwordStatus === 'invalid' } value={password} type={ showPassword ? 'text' : 'password' } onChange={handlePasswordChange} />
            {!showPassword && (<ShowPasswordIcon icon="eye-off" iconSize={Icon.SIZE_STANDARD} onClick={togglePassword} />)}
            {showPassword && (<ShowPasswordIcon icon="eye-open" iconSize={Icon.SIZE_STANDARD} onClick={togglePassword} />)}
          </InputBox>
        </LabelWrapper>
        {(passwordStatus === 'valid') && (<PasswordStrengMeter password={password} />)}
        {(passwordStatus === 'invalid') && (<ErrorMessage>Password need 8 or more characters, at least an upper case, a symbol and a number</ErrorMessage>)}

        <LabelWrapper>
          <LabelTitle>Confirm password:</LabelTitle>

          <InputBox>
            <InputGroupWrapper hasError={ confirmPasswordStatus === 'invalid' } value={confirmPassword}  type={ showConfirmPassword ? 'text' : 'password' } onChange={handleConfirmPasswordChange} />
            {!showConfirmPassword && (<ShowPasswordIcon icon="eye-off" iconSize={Icon.SIZE_STANDARD} onClick={() => togglePassword('confirm')} />)}
            {showConfirmPassword && (<ShowPasswordIcon icon="eye-open" iconSize={Icon.SIZE_STANDARD} onClick={() => togglePassword('confirm')} />)}
          </InputBox>
        </LabelWrapper>
        {(confirmPasswordStatus === 'invalid') && (<ErrorMessage>The password entered does not match</ErrorMessage>)}

        <ButtonWrapper fill={true} disabled={passwordStatus !== 'valid' || confirmPasswordStatus !== 'valid'} onClick={goToBackupStep}>Download Keystore File</ButtonWrapper>
      </Content>
    </Wrapper>
  )
}

const WalletBackupStep = props => {
  const { goToWarningStep } = props
  
  return (
    <WrapperWithoutBorder>
      <ImageWrapper>
        <img alt="Backup wallet" src={backupWalletUrl} />
      </ImageWrapper>

      <Content>
        <HeaderTitle>No Backup, No Money</HeaderTitle>
        <HeaderSubTitle>You must save the secret phrase. It is crucial for accessing your account or Do it later.</HeaderSubTitle>

        <ButtonWrapper onClick={goToWarningStep}>Back Up Now</ButtonWrapper>
      </Content>
    </WrapperWithoutBorder>
  )
}

const WalletWarningStep = props => {
  const { goToMnemonicStep } = props

  return (
    <WrapperWithoutBorder>
      <Content>
        <HeaderTitle>Treat your backup phrase with care!</HeaderTitle>
        <HeaderSubTitle>You are solely responsible for keeping your funds. No one else, not even Tomodex, can help you recover your wallet if you lose it.</HeaderSubTitle>
        <HeaderSubTitle>12 words that are both the “User ID” and password. Anyone who knows your mnemonic phrase can access your wallet, so keep it safe.</HeaderSubTitle>

        <ButtonWrapper onClick={goToMnemonicStep}>I understand</ButtonWrapper>
      </Content>
    </WrapperWithoutBorder>
  )
}

const WalletMnemonicStep = props => {
  const { 
    mnemonic, 
    notifyCopiedSuccess, 
    goToConfirmMnemonicStep,
    togglePrivateKeyDialog,
    isOpenPrivateKeyDialog,
    privateKey,
  } = props

  return (
    <Wrapper>
      <Header padding="sm">
        <HeaderTitle>Save backup phrase</HeaderTitle>
        <HeaderSubTitle>
          Please carefully write down these 12 words or

          <CopyToClipboard text={mnemonic.join(' ')} onCopy={notifyCopiedSuccess}>
            <Highlight> copy them</Highlight>
          </CopyToClipboard>
        </HeaderSubTitle>
      </Header>

      <Content padding="sm">
        <MnemonicWrapper>
          <MnemonicList>
            {
              (mnemonic.length > 0) && mnemonic.map((word, index) => {
                return (<MnemonicTag key={index}>{word}</MnemonicTag>)
              })
            }
          </MnemonicList>

          <ShowPrivateKeyText onClick={() => togglePrivateKeyDialog('open')}>Show my private key >></ShowPrivateKeyText>
        </MnemonicWrapper>

        <Paragraph textAlign="center">You will confirm this phrase on the next screen.</Paragraph>

        <ButtonWrapper fill={true} onClick={goToConfirmMnemonicStep}>I written it down</ButtonWrapper>
      </Content>

      <DialogPrivateKey 
        isOpenPrivateKeyDialog={isOpenPrivateKeyDialog}
        onClose={togglePrivateKeyDialog}
        privateKey={privateKey} />
    </Wrapper>
  )
}

const WalletConfirmMnemonicStep = props => {
  const { 
    shuffedMnemonic, 
    inputMnemonic, 
    mnemonicErrorMessage, 
    handleChooseMnemonic, 
    handleRemoveMnemonic,
    goBackToPreviousStep,
    complete,
  } = props

  return (
    <Wrapper>
      <Content padding="sm">
        <HeaderTitle>Confirm backup</HeaderTitle>
        <HeaderSubTitle>Verify your back up phrase or clear and tap again</HeaderSubTitle>

        <ConfirmMnemonicWrapper hasError={mnemonicErrorMessage}>
          {
            (inputMnemonic.length > 0) && inputMnemonic.map((word, index) => {
              return (<MnemonicTag bgColor={ DarkMode.GRAY } cursor="pointer" key={index} onClick={() => handleRemoveMnemonic(word)}>{word} <Icon icon="cross" iconSize={Icon.SIZE_STANDARD} /></MnemonicTag>)
            })
          }
        </ConfirmMnemonicWrapper>
        <ErrorMessage>{mnemonicErrorMessage}</ErrorMessage>
        
        <Paragraph textAlign="center">Please, tap each word in the corect order or <Highlight onClick={goBackToPreviousStep}>back to previous step</Highlight></Paragraph>

        <MnemonicWrapper bottom="20px">
          {
            (shuffedMnemonic.length > 0) && shuffedMnemonic.map((word, index) => {
              return (<MnemonicTag key={index} cursor="pointer" onClick={() => handleChooseMnemonic(word)}>{word}</MnemonicTag>)
            })
          }
        </MnemonicWrapper>

        <ButtonWrapper fill={true} onClick={complete} disabled={mnemonicErrorMessage || (shuffedMnemonic.length !== 0)}>Confirm</ButtonWrapper>
      </Content>
    </Wrapper>
  )
}

const DialogPrivateKey = (props) => {
  const { privateKey, isOpenPrivateKeyDialog, onClose } = props

  return (
    <Dialog
      onClose={onClose}
      title="Your Private Key"
      isOpen={isOpenPrivateKeyDialog}
      >
      <DialogBody>
        <Paragraph>Back up your private key on paper and keep it somewhere secret and safe.</Paragraph>
        <PrivateKeyBox>{privateKey}</PrivateKeyBox>
      </DialogBody>
    </Dialog>
  )
}

const Wrapper = styled.div`
  width: 560px;
  margin: 60px auto 0;
  border: 1px solid ${DarkMode.LIGHT_BLUE};
`

const WrapperWithoutBorder = styled(Wrapper)`
  border: none;
`

const Divider = styled.div`
  border-bottom: 1px solid ${DarkMode.LIGHT_BLUE};
`

const Header = styled.header`
  padding: ${props => props.padding === 'sm' ? '35px 70px' : '35px 110px'};
`

const Content = styled.div`
  padding: ${props => props.padding === 'sm' ? '40px 70px 45px' : '40px 110px 45px'};
`

const HeaderTitle = styled.h1`
  margin: 0 0 20px 0;
  line-height: 24px;
  font-size: 24px;
  font-weight: 300;
  text-align: center;
  color: ${DarkMode.WHITE};
`

const HeaderSubTitle = styled.div`
  text-align: center;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`

const LabelWrapper = styled(Label)`
  margin-bottom: 0 !important;

  &:not(:first-child) {
    margin-top: 35px !important;
  }
`

const LabelTitle = styled.span`
  display: block;
  margin-bottom: 25px;
`

const InputBox = styled.div`
  position: relative;
`

const InputGroupWrapper = styled.input`
  height: 50px;
  color: ${DarkMode.WHITE};
  font-size: ${Theme.FONT_SIZE_LG};
  padding: 15px;
  margin: 0 !important;
  background: ${DarkMode.BLACK};
  border: ${props => props.hasError ? `1px solid ${DarkMode.RED} !important` : 'none'};
  width: 100%;

  &:focus {
    border: 1px solid ${DarkMode.ORANGE};
  }
`

const ImageWrapper = styled.div`
  padding-top: 75px;
  text-align: center;
`

const ButtonWrapper = styled(Button)`
  display: block;
  margin: 35px auto 0;
  min-width: 180px;
  text-align: center;
  color: ${DarkMode.BLACK} !important;
  border-radius: 0;
  background-color: ${DarkMode.ORANGE} !important;
  box-shadow: none !important;
  background-image: none !important;
  height: 40px;
  &:hover {
    background-color: ${DarkMode.DARK_ORANGE} !important;
  }

  &.bp3-disabled {
    cursor: default !important;
    background-color: ${DarkMode.GRAY} !important;
  }
`

const CheckboxWrapper = styled(Checkbox)`
  font-size: 12px;
  text-align: center;
  margin-bottom: 45px;
  margin-top: 10px;

  .bp3-control-indicator {
    box-shadow: none !important;
    background-image: none !important;
  }

  input:checked ~ .bp3-control-indicator {
    background-color: ${DarkMode.ORANGE} !important;
  }

  input:checked ~ .bp3-control-indicator::before {
    background: url(${tickUrl}) no-repeat center center !important;
  }
`

const LinkWrapper = styled(Link)`
  color: ${DarkMode.ORANGE};
  &:hover {
    color: ${DarkMode.DARK_ORANGE};
  }
`

const Paragraph = styled.p`
  text-align: ${props => props.textAlign? props.textAlign : 'left'};
  margin-bottom: 35px;
`

const ConfirmMnemonicWrapper = styled.div`
  border: ${props => props.hasError ? `1px solid ${DarkMode.RED}` : 'initial'}
  background-color: ${DarkMode.BLACK};
  min-height: 130px;
  padding: 20px 25px;
`

const MnemonicWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: ${props => props.bottom ? props.bottom: '70px'};
`

const MnemonicList = styled.div``

const MnemonicTag = styled.span`
  display: inline-block;
  height: 40px;
  color: ${DarkMode.WHITE};
  background-color: ${props => props.bgColor ? props.bgColor : '#1f2538'};
  padding: 10px 15px;
  margin: 0 5px 15px 5px;
  cursor: ${props => props.cursor ? props.cursor : 'initial'};
  &:hover {
    background-color: ${DarkMode.ORANGE} !important;
  }import PasswordStrengMeter from '../../components/PasswordStrengthMeter/index';

`

const DialogBody = styled.div.attrs({
  className: Classes.DIALOG_BODY,
})``

const PrivateKeyBox = styled.div`
  word-break: break-all;
  font-size: ${Theme.FONT_SIZE_LG};
  font-weight: 600;
  color: ${DarkMode.BLACK};
  border: 1px dashed ${DarkMode.LIGHT_GRAY};
  padding: 25px;
`

const ErrorMessage = styled.div`
  color: ${DarkMode.RED};
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 27px;
`

const Highlight = styled.span`
  cursor: pointer;
  color: ${DarkMode.ORANGE};

  &:hover {
    color: ${DarkMode.DARK_ORANGE};
  }
`

const ShowPrivateKeyText = styled(Highlight)`
  margin-left: auto;
  font-size: ${Theme.FONT_SIZE_SM};
`

const ShowPasswordIcon = styled(Icon)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`

export default CreateWalletPageRenderer
