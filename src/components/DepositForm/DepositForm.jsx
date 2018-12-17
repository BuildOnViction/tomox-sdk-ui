//@flow
import React from 'react'
import DepositFormRenderer from './DepositFormRenderer'
// import { generateDepositAddress } from '../../store/services/api';
import { getSigner } from '../../store/services/signer'
import { WETH_ADDRESS } from '../../config/contracts'
import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'
import type { Token } from '../../types/tokens'
import type { AccountBalance } from '../../types/accountBalances'
import type { PairAddresses } from '../../types/pairs'
import type { AddressAssociation, Chain } from '../../types/deposit'

type Step = 'waiting' | 'convert' | 'confirm'

type Props = {
  step: Step,
  chain: Chain,
  balances: { [string]: AccountBalance },
  address: string,
  token: Token,
  tokens: Array<Token>,
  queryBalances: void => void,
  subscribeBalance: Token => void,
  confirmTokenDeposit: (Token, boolean) => void,
  updateAddressAssociation: (Chain, string, PairAddresses) => void,
  confirmEtherDeposit: (boolean, boolean, number) => void,
  allowTx: Object,
  convertTx: Object,
  addressAssociation: AddressAssociation,
}

type State = {
  token: Token,
  inputToken: ?Token,
  convertAmount: number,
  shouldConvert: boolean,
  shouldAllow: boolean,
  showTokenSuggest: boolean,
  unsubscribeBalance: ?(void) => void,
}

class DepositForm extends React.PureComponent<Props, State> {
  state = {
    token: this.props.token || this.props.tokens[0],
    inputToken: null,
    shouldConvert: true,
    shouldAllow: true,
    convertAmount: 50,
    showTokenSuggest: false,
    unsubscribeBalance: null,
  }

  componentDidMount() {
    const { token } = this.state
    this.props.queryBalances()
    this.subscribe(token)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  async subscribe(token: Token) {
    const signer = getSigner()
    const networkID = signer.provider.network.chainId
    const quoteToken = WETH_ADDRESS[networkID]
    const pairAddresses: PairAddresses = {
      name: `${token.symbol}/WETH`,
      baseToken: token.address,
      quoteToken,
    }
    const {
      subscribeBalance,
      chain,
      address,
      updateAddressAssociation,
    } = this.props

    // console.log(pairAddresses);
    this.unsubscribe()

    const unsubscribeBalance = await subscribeBalance(token)

    // now call websocket to update associated Address, we can remove subscribe function
    updateAddressAssociation(chain, address, pairAddresses)
    // let association = await generateDepositAddress(
    //   'ethereum',
    //   this.props.address,
    //   pairAddresses
    // );

    // console.log(association);

    this.setState({
      unsubscribeBalance,
    })
  }

  unsubscribe() {
    if (typeof this.state.unsubscribeBalance === 'function')
      this.state.unsubscribeBalance()
  }

  handleChangeToken = (e: Object) => {
    this.setState({ inputToken: e })
  }

  handleSubmitChangeToken = async (e: SyntheticEvent<>) => {
    const newToken = this.state.inputToken || this.state.token

    this.setState({
      showTokenSuggest: false,
      token: newToken,
    })
    this.subscribe(newToken)
  }

  handleChangeConvertAmount = (e: number) => {
    this.setState({ convertAmount: e })
  }

  handleConfirm = () => {
    this.unsubscribe()
    const { token, shouldAllow, shouldConvert, convertAmount } = this.state
    const { confirmTokenDeposit, confirmEtherDeposit } = this.props

    token.symbol === NATIVE_TOKEN_SYMBOL
      ? confirmEtherDeposit(shouldConvert, shouldAllow, convertAmount)
      : confirmTokenDeposit(token, shouldAllow)
  }

  toggleTokenSuggest = () => {
    this.setState({ showTokenSuggest: !this.state.showTokenSuggest })
  }

  toggleShouldAllowTrading = () => {
    this.setState({ shouldAllow: !this.state.shouldAllow })
  }

  toggleShouldConvert = () => {
    this.setState({ shouldConvert: !this.state.shouldConvert })
  }

  transactionStatus = () => {
    const { token } = this.state
    const { allowTx, convertTx } = this.props
    const allowTxStatus = allowTx.allowTxStatus
    const convertTxStatus = convertTx.convertTxStatus

    if (token.symbol === NATIVE_TOKEN_SYMBOL) {
      if (allowTxStatus === 'failed' || convertTxStatus === 'failed')
        return 'failed'
      if (allowTxStatus === 'confirmed' && convertTxStatus === 'confirmed')
        return 'confirmed'
      if (allowTxStatus === 'sent' && convertTxStatus === 'sent') return 'sent'
    } else {
      if (allowTxStatus === 'failed') return 'failed'
      if (allowTxStatus === 'confirmed') return 'confirmed'
      if (allowTxStatus === 'sent') return 'sent'
    }
  }

  render() {
    const {
      step,
      balances,
      address,
      tokens,
      allowTx,
      convertTx,
      addressAssociation,
    } = this.props

    const {
      shouldAllow,
      shouldConvert,
      convertAmount,
      inputToken,
      showTokenSuggest,
      token,
    } = this.state
    const balance = balances[token.symbol]
      ? balances[token.symbol].balance
      : null
    const isEtherDeposit = token.symbol === NATIVE_TOKEN_SYMBOL
    const allowTradingCheckboxDisabled = isEtherDeposit && !shouldConvert
    const submitButtonDisabled =
      (!isEtherDeposit && allowTradingCheckboxDisabled) ||
      (!shouldConvert || allowTradingCheckboxDisabled)

    return (
      <DepositFormRenderer
        step={step}
        tokens={tokens}
        token={token}
        inputToken={inputToken}
        balance={balance}
        address={address}
        associatedAddress={addressAssociation.address}
        shouldConvert={shouldConvert}
        shouldAllow={shouldAllow}
        convertAmount={convertAmount}
        isEtherDeposit={isEtherDeposit}
        allowTradingCheckboxDisabled={allowTradingCheckboxDisabled}
        submitButtonDisabled={submitButtonDisabled}
        handleChangeConvertAmount={this.handleChangeConvertAmount}
        toggleShouldAllowTrading={this.toggleShouldAllowTrading}
        toggleShouldConvert={this.toggleShouldConvert}
        toggleTokenSuggest={this.toggleTokenSuggest}
        showTokenSuggest={showTokenSuggest}
        handleChangeToken={this.handleChangeToken}
        handleSubmitChangeToken={this.handleSubmitChangeToken}
        handleConfirm={this.handleConfirm}
        transactionStatus={this.transactionStatus()}
        {...allowTx}
        {...convertTx}
      />
    )
  }
}

export default DepositForm
