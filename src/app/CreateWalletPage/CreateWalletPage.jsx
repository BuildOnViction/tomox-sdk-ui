//@flow
import React from 'react'
import { Redirect } from 'react-router-dom'
import { save } from 'save-file'
import { shuffleArray } from '../../utils/helpers'
import { createRandomWallet } from '../../store/services/wallet'
import CreateWalletPageRenderer from './CreateWalletPageRenderer'

type Props = {
  visible: boolean,
  hideModal: void => void,
  walletCreated: Object => void
}

type State = {
  currentStep: number,
  password: string,
  passwordStatus: string,
  wallet: Object,
  encryptedWallet: string,
  storeWallet: boolean,
  showPassword: boolean,
  showConfirmPassword: boolean
}

class CreateWalletPage extends React.PureComponent<Props, State> {
  state = {
    currentStep: 0,
    password: '',
    passwordStatus: 'initial',
    encryptedWallet: '',
    showPassword: false,
    showConfirmPassword: false,
    shuffedMnemonic: [],
    inputMnemonic: [],
    mnemonicErrorMessage: '',
    wallet: null,
    isOpenPrivateKeyDialog: false,
  }

  componentDidMount = async () => {
    const wallet = await createRandomWallet()
    const shuffedMnemonic = shuffleArray(wallet.mnemonic.split(' '))
    
    this.setState({ wallet, shuffedMnemonic  })
  }

  changeCurrentStep = (currentStep: number) => {
    this.setState({currentStep})
  }

  goToPasswordStep = () => {
    this.changeCurrentStep(1)
  }

  goToBackupStep = async () => {
    const { wallet, password, passwordStatus, confirmPasswordStatus } = this.state
    if (passwordStatus !== 'valid' || confirmPasswordStatus !== 'valid') return

    const encryptedWallet = await wallet.encrypt(password)
    const prefixKeystoreFile = new Date().getTime()

    save(encryptedWallet, `${prefixKeystoreFile}_keystore.json`)
    this.setState({ encryptedWallet })
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
    const { wallet, encryptedWallet } = this.state

    loginWithWallet({ wallet, encryptedWallet })
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    })
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

  notifyCopiedSuccess = () => {
    this.props.copyDataSuccess()
  }

  togglePrivateKeyDialog = (status) => {
    (status === 'open') ? this.setState({ isOpenPrivateKeyDialog: true }) : this.setState({ isOpenPrivateKeyDialog: false })
  }

  togglePassword = (type) =>  {
    if (type === 'confirm') {
      this.setState({ showConfirmPassword: !this.state.showConfirmPassword })
      return
    }

    this.setState({ showPassword: !this.state.showPassword })
  }

  handlePasswordChange = (e) => {
    const password = e.target.value.trim()
    // Reference: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    const validationPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g

    if (!validationPasswordRegex.test(password)) {
      this.setState({ 
        passwordStatus: 'invalid',
        password,
      })

      return
    }

    this.setState({ 
      passwordStatus: 'valid',
      password,
    })
  }

  handleConfirmPasswordChange = (e) => {
    const { password } = this.state
    const confirmPassword = e.target.value

    if (confirmPassword !== password) {
      this.setState({ 
        confirmPasswordStatus: 'invalid',
        confirmPassword,
      })

      return
    }

    this.setState({ 
      confirmPasswordStatus: 'valid',
      confirmPassword,
    })
  }
  
  render() {
    const { visible, hideModal, authenticated } = this.props

    if (authenticated) {
      return <Redirect to="/markets" />
    }

    const {
      currentStep,
      password,
      passwordStatus,
      showPassword,
      showConfirmPassword,
      shuffedMnemonic,
      mnemonicErrorMessage,
      inputMnemonic,
      wallet,
      isOpenPrivateKeyDialog,
      confirmPassword,
      confirmPasswordStatus,
    } = this.state

    const mnemonic = wallet ? wallet.mnemonic.split(' ') : []
    const address = wallet ? wallet.address : ''
    const privateKey = wallet ? wallet.privateKey : ''

    return (
      <CreateWalletPageRenderer
        visible={visible}
        hideModal={hideModal}
        currentStep={currentStep}
        address={address}
        password={password}
        complete={this.complete}
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
        notifyCopiedSuccess={this.notifyCopiedSuccess}
        togglePrivateKeyDialog={this.togglePrivateKeyDialog}
        isOpenPrivateKeyDialog={isOpenPrivateKeyDialog}
        privateKey={privateKey}
        passwordStatus={passwordStatus}
        showPassword={showPassword}
        togglePassword={this.togglePassword}
        handlePasswordChange={this.handlePasswordChange}
        showConfirmPassword={showConfirmPassword}
        confirmPassword={confirmPassword}
        confirmPasswordStatus={confirmPasswordStatus}
        handleConfirmPasswordChange={this.handleConfirmPasswordChange}
      />
    )
  }
}

export default CreateWalletPage
