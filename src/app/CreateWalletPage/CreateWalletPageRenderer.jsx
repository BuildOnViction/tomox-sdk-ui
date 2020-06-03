// @flow
import React from 'react'
import styled from 'styled-components'
import {
  Button,
  Icon,
} from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import Modal from '../../components/Modal'
import { TmColors, Theme } from '../../components/Common'
import backupWalletUrl from '../../assets/images/backup_wallet.svg'

type Props = {
  address: string,
  currentStep: string,
  complete: () => void,
  mnemonic: string,
  shuffedMnemonic: string[],
  inputMnemonic: string,
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
}

const CreateWalletPageRenderer = (props: Props) => {
  const {
    currentStep,
    complete,
    mnemonic,
    shuffedMnemonic,
    inputMnemonic,
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
  } = props

  const content = {
    '2': (<WalletBackupStep goToWarningStep={goToMnemonicStep} />),
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

        <ButtonWrapper onClick={goToWarningStep}><FormattedMessage id="createWalletPage.backupStep.IUnderstand" /></ButtonWrapper>
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
                return (<MnemonicTag bgColor={ TmColors.GRAY } cursor="pointer" key={index} onClick={() => handleRemoveMnemonic(word)}>{word} <Icon icon="cross" iconSize={Icon.SIZE_STANDARD} /></MnemonicTag>)
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
    <StyledModal
      className="dark-dialog sm"
      onClose={onClose}
      title={<FormattedMessage id="createWalletPage.modalPrivateKey.title" />}
      isOpen={isOpenPrivateKeyDialog}
      >
      <Paragraph><FormattedMessage id="createWalletPage.privateKeyBackupInstruction" /></Paragraph>
      <PrivateKeyBox>{privateKey}</PrivateKeyBox>
    </StyledModal>
  )
}

const Wrapper = styled.div`
  width: 560px;
  margin: 60px auto 0;
  border: 1px solid ${TmColors.LIGHT_BLUE};
`

const WrapperWithoutBorder = styled(Wrapper)`
  border: none;
`

const Header = styled.header`
  padding: ${props => props.padding === 'sm' ? '35px 70px' : '35px 110px'};
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props => props.padding === 'sm' ? '40px 70px 45px' : '40px 110px 45px'};
`

const HeaderTitle = styled.h1`
  margin: 0 0 20px 0;
  line-height: 24px;
  font-size: 24px;
  font-weight: 300;
  text-align: center;
  color: ${TmColors.WHITE};
`

const HeaderSubTitle = styled.div`
  text-align: center;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`

const ImageWrapper = styled.div`
  padding-top: 75px;
  text-align: center;
`

const ButtonWrapper = styled(Button)`
  display: block;
  margin: 35px auto 0;
  min-width: 180px !important;
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
`

const Paragraph = styled.p`
  text-align: ${props => props.textAlign? props.textAlign : 'left'};
  margin-bottom: 20px;
  color: #9ca4ba;
`

const ConfirmMnemonicWrapper = styled.div`
  border: ${props => props.hasError ? `1px solid ${TmColors.RED}` : 'initial'}
  background-color: ${TmColors.BLACK};
  min-height: 130px;
  padding: 20px 25px;
`

const MnemonicWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: ${props => props.bottom ? props.bottom: '70px'};
`

const MnemonicList = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: center;
`

const MnemonicTag = styled.span`
  display: inline-block;
  height: 40px;
  color: ${TmColors.WHITE};
  background-color: ${props => props.bgColor ? props.bgColor : '#1f2538'};
  padding: 10px 15px;
  margin: 0 5px 15px 5px;
  cursor: ${props => props.cursor ? props.cursor : 'initial'};
  &:hover {
    background-color: ${TmColors.ORANGE} !important;
  }
`

const PrivateKeyBox = styled.div`
  word-break: break-all;
  font-family: 'Ubuntu', sans-serif;
  font-size: ${Theme.FONT_SIZE_LG};
  line-height: 24px;
  color: ${TmColors.LIGHT_GRAY};
  border: 2px dashed ${TmColors.LIGHT_GRAY};
  padding: 25px;
  margin-top: 35px;
`

const ErrorMessage = styled.div`
  color: ${TmColors.RED};
  font-size: 12px;
  margin-top: 5px;
`

const Highlight = styled.span`
  cursor: pointer;
  color: ${TmColors.ORANGE};

  &:hover {
    color: ${TmColors.DARK_ORANGE};
  }
`

const StyledModal = styled(Modal)`
  .bp3-heading,
  .bp3-input {
    color: #6e7793;
  }
`

const ShowPrivateKeyText = styled(Highlight)`
  margin-left: auto;
  font-size: ${Theme.FONT_SIZE_SM};
`

const MarginWrapper = styled.div`
  margin-bottom: 27px;
`

export default CreateWalletPageRenderer
