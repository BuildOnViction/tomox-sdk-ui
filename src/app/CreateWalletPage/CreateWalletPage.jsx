//@flow
import React from 'react'
import { Redirect } from 'react-router-dom'
import { createRandomWallet } from '../../store/services/wallet'
import CreateWalletPageRenderer from './CreateWalletPageRenderer'

type Props = {
  visible: boolean,
  hideModal: void => void,
  walletCreated: Object => void
}

type State = {
  currentStep: number,
  title: string,
  password: string,
  passwordStatus: string,
  showEncryptionProgress: boolean,
  encryptionPercentage: number,
  address: string,
  encryptedWallet: string,
  storeWallet: boolean,
  showPassword: boolean,
  storePrivateKey: boolean
}

class CreateWalletPage extends React.PureComponent<Props, State> {
  state = {
    currentStep: 0,
    password: '',
    encryptedWallet: '',
    showPassword: false,
    shuffedMnemonic: [],
    inputMnemonic: [],
    mnemonicErrorMessage: '',
    wallet: null,
    isShowPrivateKeyDialog: false,
  }

  // cancel = () => {
  //   this.props.hideModal()
  //   setTimeout(() => {
  //     this.setState({
  //       currentStep: 0,
  //       password: '',
  //       encryptionPercentage: 0,
  //       address: '',
  //       encryptedWallet: '',
  //       showEncryptionProgress: false,
  //     })
  //   }, 500)
  // }

  componentDidMount = async () => {
    const wallet = await createRandomWallet()
    const shuffedMnemonic = this.shuffle(wallet.mnemonic.split(' '))
    
    this.setState({ wallet, shuffedMnemonic  })
  }

  changeCurrentStep = (currentStep: number) => {
    this.setState({currentStep})
  }

  goToPasswordStep = () => {
    this.changeCurrentStep(1)
  }

  goToBackupStep = () => {
    this.changeCurrentStep(2)
  }

  goToWarningStep = () => {
    this.changeCurrentStep(3)
  }

  goToMnemonicStep = () => {
    this.changeCurrentStep(4)
  }

  goToConfirmMnemonicStep = () => {
    this.changeCurrentStep(5)
  }

  goBackToPreviousStep = () => {
    const { currentStep } = this.state
    let prevStep = currentStep - 1
    prevStep = (prevStep >=0) ? prevStep : currentStep

    this.changeCurrentStep(prevStep)
  }

  complete = () => {
    const { loginWithWallet } = this.props
    const { wallet } = this.state

    loginWithWallet({ wallet })
  }

  handleChooseMnemonic = (word) => {
    const inputMnemonic = [...this.state.inputMnemonic, word]
    const shuffedMnemonic = this.state.shuffedMnemonic.filter(shuffedWord => {
      return shuffedWord !== word
    })

    this.checkMnemonic(inputMnemonic)

    this.setState({
      inputMnemonic,
      shuffedMnemonic,
    })
  }

  handleRemoveMnemonic = (word) => {
    const shuffedMnemonic = [...this.state.shuffedMnemonic, word]
    const inputMnemonic = this.state.inputMnemonic.filter(inputWord => {
      return inputWord !== word
    })

    this.checkMnemonic(inputMnemonic)

    this.setState({
      inputMnemonic,
      shuffedMnemonic,
    })
  }

  checkMnemonic = (inputMnemonic) => {
    const { mnemonic } = this.state.wallet
    const inputMnemonicString = inputMnemonic.join(' ')
    const index = mnemonic.indexOf(inputMnemonicString)

    if (index !== 0) {
      this.setState({
        mnemonicErrorMessage: 'Incorrect Mnemonic Phrase order. Please try again.',
      })

      return false
    }

    if (index === 0) {
      this.setState({
        mnemonicErrorMessage: '',
      })
    }
    
    if (index === 0 && mnemonic.length === inputMnemonicString.length) {
      return true
    }
  }

  shuffle = (array) => {
    const shuffeArray = JSON.parse(JSON.stringify(array))
    let currentIndex = shuffeArray.length, temporaryValue, randomIndex
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
  
      // And swap it with the current element.
      temporaryValue = shuffeArray[currentIndex]
      shuffeArray[currentIndex] = shuffeArray[randomIndex]
      shuffeArray[randomIndex] = temporaryValue
    }
  
    return shuffeArray
  }

  handleCopy = () => {
    this.props.copyDataSuccess()
  }

  showPrivateKeyDialog = _ => this.setState({ isShowPrivateKeyDialog: true })

  hidePrivateKeyDialog = _ => this.setState({ isShowPrivateKeyDialog: false })

  render() {
    const { visible, hideModal, authenticated } = this.props

    if (authenticated) {
      return <Redirect to="/markets" />
    }

    const {
      title,
      currentStep,
      password,
      showPassword,
      showEncryptionProgress,
      encryptionPercentage,
      encryptedWallet,
      passwordStatus,
      storeWallet,
      storePrivateKey,
      shuffedMnemonic,
      mnemonicErrorMessage,
      inputMnemonic,
      wallet,
      isShowPrivateKeyDialog,
    } = this.state

    const mnemonic = wallet ? wallet.mnemonic.split(' ') : []
    const address = wallet ? wallet.address : ''
    const privateKey = wallet ? wallet.privateKey : ''

    return (
      <CreateWalletPageRenderer
        visible={visible}
        hideModal={hideModal}
        title={title}
        currentStep={currentStep}
        showEncryptionProgress={showEncryptionProgress}
        showPassword={showPassword}
        encryptionPercentage={encryptionPercentage}
        address={address}
        encryptedWallet={encryptedWallet}
        password={password}
        storeWallet={storeWallet}
        passwordStatus={passwordStatus}
        storePrivateKey={storePrivateKey}
        goToDownloadWallet={this.goToDownloadWallet}
        goBackToCreateWallet={this.goBackToCreateWallet}
        togglePasswordView={this.togglePasswordView}
        goToComplete={this.goToComplete}
        goBackToDownloadWallet={this.goBackToDownloadWallet}
        complete={this.complete}
        cancel={this.cancel}
        handleChange={this.handleChange}
        mnemonic={mnemonic}
        shuffedMnemonic={shuffedMnemonic}
        inputMnemonic={inputMnemonic}
        goToPasswordStep={this.goToPasswordStep}
        goToBackupStep={this.goToBackupStep}
        goToWarningStep={this.goToWarningStep}
        goToMnemonicStep={this.goToMnemonicStep}
        goToConfirmMnemonicStep={this.goToConfirmMnemonicStep}
        goBackToPreviousStep={this.goBackToPreviousStep}
        handleChooseMnemonic={this.handleChooseMnemonic}
        handleRemoveMnemonic={this.handleRemoveMnemonic}
        mnemonicErrorMessage={mnemonicErrorMessage}
        handleCopy={this.handleCopy}
        showPrivateKeyDialog={this.showPrivateKeyDialog}
        hidePrivateKeyDialog={this.hidePrivateKeyDialog}
        isShowPrivateKeyDialog={isShowPrivateKeyDialog}
        privateKey={privateKey}
      />
    )
  }
}

export default CreateWalletPage
