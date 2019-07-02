// @flow
import React from 'react'
import styled from 'styled-components'
import {
  Button,
  Checkbox,
  Icon,
  Label,
  Dialog,
  Classes,
} from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'

import PasswordStrengMeter from '../../components/PasswordStrengthMeter'
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
    storeAccount,
    handleChangeStoreAccount,
  } = props

  const content = {
    '0': (<WalletCreateStep 
            address={address}             
            goToPasswordStep={goToPasswordStep}
            handleChangeStoreAccount={handleChangeStoreAccount}
            storeAccount={storeAccount}
            notifyCopiedSuccess={notifyCopiedSuccess} />),
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
  const { address, goToPasswordStep, handleChangeStoreAccount, storeAccount, notifyCopiedSuccess } = props

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>
          <FormattedMessage id="createWalletPage.title" />
        </HeaderTitle>

        <HeaderSubTitle>
          <LinkWrapper to="/unlock"><FormattedMessage id="createWalletPage.subTitlePart1" /> </LinkWrapper>        
          <FormattedMessage id="createWalletPage.subTitlePart2" /> 
          <LinkWrapper to="/unlock"> <FormattedMessage id="createWalletPage.subTitlePart3" /></LinkWrapper>
        </HeaderSubTitle>
      </Header>

      <Divider />

      <Content>
        <LabelWrapper>
          <LabelTitle><FormattedMessage id="createWalletPage.inputTitleName" /></LabelTitle>
          <InputGroupWrapper />
        </LabelWrapper>

        <AddressWrapper>
          <LabelTitle><FormattedMessage id="createWalletPage.inputTileAddress" /></LabelTitle>
          <AddressBox>
            <Address title={address}>{address}</Address>
            <CopyToClipboard text={address} onCopy={notifyCopiedSuccess}>
              <CopyIconBox title={<FormattedMessage id="createWalletPage.copyAddress" />}><Icon icon="applications" /></CopyIconBox> 
            </CopyToClipboard>
          </AddressBox>
        </AddressWrapper>

        <CheckboxWrapper checked={storeAccount} label={<FormattedMessage id="createWalletPage.checkboxTitleKeepAccount" />} onChange={handleChangeStoreAccount} />   

        <ButtonWrapper fill={true} onClick={goToPasswordStep}><FormattedMessage id="createWalletPage.continue" /></ButtonWrapper>
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
        <HeaderTitle><FormattedMessage id="createWalletPage.passwordStep.title" /></HeaderTitle>
        <HeaderSubTitle>
          <FormattedMessage id="createWalletPage.passwordStep.subTitlePart1" />  
          <LinkWrapper to="/unlock"> <FormattedMessage id="createWalletPage.passwordStep.subTitlePart2" /> </LinkWrapper> 
          <FormattedMessage id="createWalletPage.passwordStep.subTitlePart3" />
        </HeaderSubTitle>
      </Header>

      <Divider />

      <Content>
        <MarginWrapper>
          <LabelWrapper>
            <LabelTitle><FormattedMessage id="createWalletPage.passwordStep.inputPasswordTitle" /></LabelTitle>

            <InputBox>
              <InputGroupWrapper hasError={ passwordStatus === 'invalid' } value={password} type={ showPassword ? 'text' : 'password' } onChange={handlePasswordChange} />
              {!showPassword && (<ShowPasswordIcon icon="eye-off" iconSize={Icon.SIZE_STANDARD} onClick={togglePassword} />)}
              {showPassword && (<ShowPasswordIcon icon="eye-open" iconSize={Icon.SIZE_STANDARD} onClick={togglePassword} />)}
            </InputBox>
          </LabelWrapper>
          {(passwordStatus === 'valid') && (<PasswordStrengMeter password={password} />)}
          {(passwordStatus === 'invalid') && (<ErrorMessage><FormattedMessage id="createWalletPage.passwordStep.describePassword" /></ErrorMessage>)}
        </MarginWrapper>

        <LabelWrapper>
          <LabelTitle><FormattedMessage id="createWalletPage.passwordStep.inputConfirmPasswordTitle" /></LabelTitle>

          <InputBox>
            <InputGroupWrapper hasError={ confirmPasswordStatus === 'invalid' } value={confirmPassword}  type={ showConfirmPassword ? 'text' : 'password' } onChange={handleConfirmPasswordChange} />
            {!showConfirmPassword && (<ShowPasswordIcon icon="eye-off" iconSize={Icon.SIZE_STANDARD} onClick={() => togglePassword('confirm')} />)}
            {showConfirmPassword && (<ShowPasswordIcon icon="eye-open" iconSize={Icon.SIZE_STANDARD} onClick={() => togglePassword('confirm')} />)}
          </InputBox>
        </LabelWrapper>
        {(confirmPasswordStatus === 'invalid') && (<ErrorMessage><FormattedMessage id="createWalletPage.passwordStep.warningNotMatch" /></ErrorMessage>)}

        <ButtonWrapper fill={true} disabled={passwordStatus !== 'valid' || confirmPasswordStatus !== 'valid'} onClick={goToBackupStep}><FormattedMessage id="createWalletPage.continue" /></ButtonWrapper>
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
        <HeaderTitle><FormattedMessage id="createWalletPage.backupStep.title" /></HeaderTitle>
        <HeaderSubTitle><FormattedMessage id="createWalletPage.backupStep.description" /></HeaderSubTitle>

        <ButtonWrapper onClick={goToWarningStep}><FormattedMessage id="createWalletPage.backupStep.backUpNow" /></ButtonWrapper>
      </Content>
    </WrapperWithoutBorder>
  )
}

const WalletWarningStep = props => {
  const { goToMnemonicStep } = props

  return (
    <WrapperWithoutBorder>
      <Content>
        <HeaderTitle><FormattedMessage id="createWalletPage.backupStep.warningTitle" /></HeaderTitle>
        <HeaderSubTitle><FormattedMessage id="createWalletPage.backupStep.warningNote1" /></HeaderSubTitle>
        <HeaderSubTitle><FormattedMessage id="createWalletPage.backupStep.warningNote2" /></HeaderSubTitle>

        <ButtonWrapper onClick={goToMnemonicStep}><FormattedMessage id="createWalletPage.backupStep.IUnderstand" /></ButtonWrapper>
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
        <HeaderTitle><FormattedMessage id="createWalletPage.backupStep.mnemonicTitle" /></HeaderTitle>

        <HeaderSubTitle>
          <FormattedMessage id="createWalletPage.backupStep.mnemonicSubTitlePart1" />

          <CopyToClipboard text={mnemonic.join(' ')} onCopy={notifyCopiedSuccess}>
            <Highlight> <FormattedMessage id="createWalletPage.backupStep.mnemonicSubTitlePart2" /></Highlight>
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

          <ShowPrivateKeyText onClick={() => togglePrivateKeyDialog('open')}><FormattedMessage id="createWalletPage.backupStep.mnemonicShowPrivatekey" /></ShowPrivateKeyText>
        </MnemonicWrapper>

        <Paragraph textAlign="center"><FormattedMessage id="createWalletPage.backupStep.mnemonicNote" /></Paragraph>

        <ButtonWrapper fill={true} onClick={goToConfirmMnemonicStep}><FormattedMessage id="createWalletPage.backupStep.mnemonicButtonTitle" /></ButtonWrapper>
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
        <HeaderTitle><FormattedMessage id="createWalletPage.confirmMnemonic.title" /></HeaderTitle>
        <HeaderSubTitle><FormattedMessage id="createWalletPage.confirmMnemonic.subTitle" /></HeaderSubTitle>

        <MarginWrapper>
          <ConfirmMnemonicWrapper hasError={mnemonicErrorMessage}>
            {
              (inputMnemonic.length > 0) && inputMnemonic.map((word, index) => {
                return (<MnemonicTag bgColor={ DarkMode.GRAY } cursor="pointer" key={index} onClick={() => handleRemoveMnemonic(word)}>{word} <Icon icon="cross" iconSize={Icon.SIZE_STANDARD} /></MnemonicTag>)
              })
            }
          </ConfirmMnemonicWrapper>
          <ErrorMessage>{mnemonicErrorMessage}</ErrorMessage>
        </MarginWrapper>
        
        <Paragraph textAlign="center">
          <FormattedMessage id="createWalletPage.confirmMnemonic.notePart1" />  
          <Highlight onClick={goBackToPreviousStep}> <FormattedMessage id="createWalletPage.confirmMnemonic.notePart2" /></Highlight>
        </Paragraph>

        <MnemonicWrapper bottom="20px">
          {
            (shuffedMnemonic.length > 0) && shuffedMnemonic.map((word, index) => {
              return (<MnemonicTag key={index} cursor="pointer" onClick={() => handleChooseMnemonic(word)}>{word}</MnemonicTag>)
            })
          }
        </MnemonicWrapper>

        <ButtonWrapper fill={true} onClick={complete} disabled={mnemonicErrorMessage || (shuffedMnemonic.length !== 0)}><FormattedMessage id="createWalletPage.confirmMnemonic.confirm" /></ButtonWrapper>
      </Content>
    </Wrapper>
  )
}

const DialogPrivateKey = (props) => {
  const { privateKey, isOpenPrivateKeyDialog, onClose } = props

  return (
    <Dialog
      className="dark-dialog sm"
      onClose={onClose}
      title="Your Private Key"
      isOpen={isOpenPrivateKeyDialog}
      >
      <DialogBody>
        <Paragraph><FormattedMessage id="createWalletPage.privateKeyBackupInstruction" /></Paragraph>
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

const AddressWrapper = styled.div`
  margin-top: 35px !important;
`

const AddressBox = styled.div`
  position: relative;
`

const Address = styled.div`
  height: 50px;
  padding: 15px 35px 15px 15px;
  background: ${DarkMode.BLACK};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const CopyIconBox = styled.span`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  padding: 5px;

  &:hover {
    background-color: ${DarkMode.LIGHT_BLUE};
  }
`

const LabelWrapper = styled(Label)`
  margin-bottom: 0 !important;
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
  margin-bottom: 15px;
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
})`
  margin: 0;
`

const PrivateKeyBox = styled.div`
  word-break: break-all;
  font-size: ${Theme.FONT_SIZE_LG};
  font-weight: 600;
  color: ${DarkMode.LIGHT_GRAY};
  border: 1px dashed ${DarkMode.LIGHT_GRAY};
  padding: 25px;
`

const ErrorMessage = styled.div`
  color: ${DarkMode.RED};
  font-size: 12px;
  margin-top: 5px;
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

const MarginWrapper = styled.div`
  margin-bottom: 27px;
`

export default CreateWalletPageRenderer
