// @flow
import React from 'react'
import BigNumber from 'bignumber.js'

import TransferTokensFormRenderer from './TransferTokensFormRenderer'
import { NATIVE_TOKEN_ADDRESS } from '../../config/tokens'
import type { TOMOTxParams, TransferTokensTxParams } from '../../types/transferTokensForm'
import type { Token } from '../../types/tokens'

BigNumber.config({ ROUNDING_MODE: 1 })

type State = {
  token: Token,
  amount: number,
  receiver: string,
  customGas: ?number,
  customGasPrice: ?number,
}

type Props = {
  address: string,
  token: Token,
  tokens: Array<Token>,
  loading: boolean,
  error: string,
  status: string,
  statusMessage: string,
  gas: number,
  gasPrice: number,
  hash: string,
  receipt: Object,
  validateEtherTx: TOMOTxParams => void,
  validateTransferTokensTx: TransferTokensTxParams => void,
  sendEtherTx: TOMOTxParams => void,
  sendTransferTokensTx: TransferTokensTxParams => void,
  resetForm: void => void
}

class TransferTokensForm extends React.PureComponent<Props, State> {
  state = {
    token: this.props.tokens[0] || {},
    amount: '',
    receiver: '',
    sender: '',
    customGas: this.props.gas,
    customGasPrice: this.props.gasPrice,
    balanceError: false,
  }

  componentDidMount() {
    const { address, decimals } = this.state.token
    const { gasPrice } = this.props

    if (address === NATIVE_TOKEN_ADDRESS) {
      this.props.estimateTransferTomoFee({ gasPrice })
    } else {
      this.props.estimateTransferTokensFee({ address, decimals, amount: 0 })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.token.symbol !== prevState.token.symbol || this.props.gas !== prevProps.gas) {
      this.setState({customGas: this.props.gas})
    }

    const token = this.props.tokens.find(token => token.symbol === this.state.token.symbol)
    if (token && token.availableBalance !== this.state.token.availableBalance) {
      this.setState({ token })
    }
  }

  componentWillUnmount() {
    this.setState({
      token: this.props.token || this.props.tokens[0],
      amount: 0,
      receiver: '',
      customGas: null,
      customGasPrice: null,
    }, this.props.resetForm())
  }

  handleChange = (e: SyntheticInputEvent<>) => {
    let { value, name } = e.target

    value = (name === 'receiver') ? value.trim() : value

    this.setState({ [name]: value }, () => {
      const { amount, receiver, token, customGasPrice, customGas } = this.state
      let { gas, gasPrice, validateEtherTx, validateTransferTokensTx, transferFee } = this.props

      if (amount && (Number(amount) + Number(transferFee) > Number(token.availableBalance))) return (this.setState({ balanceError: true }))
      this.setState({ balanceError: false })

      gas = customGas
      gasPrice = customGasPrice

      if (token.address === NATIVE_TOKEN_ADDRESS && amount && receiver) {
        validateEtherTx({ amount, receiver, gas, gasPrice, tokenDecimals: token.decimals })
      } else if (amount && receiver && token) {
        validateTransferTokensTx({ 
          amount, 
          receiver, 
          gas, 
          gasPrice, 
          tokenAddress: token.address, 
          tokenDecimals: token.decimals,
        })
      }
    })
  }

  handleTokenChange = (token: Object) => {
    this.props.resetForm()

    this.setState({ token }, async () => {
      const { amount, receiver, token } = this.state
      const { gas, gasPrice, validateEtherTx, validateTransferTokensTx } = this.props

      if (token.address === NATIVE_TOKEN_ADDRESS) {
        await this.props.estimateTransferTomoFee({ gasPrice })
      } else {      
        await this.props.estimateTransferTokensFee({ address: token.address, decimals: token.decimals, amount })
      }

      if (amount && (Number(amount) + Number(this.props.transferFee) > Number(token.availableBalance))) return (this.setState({ balanceError: true }))
      this.setState({ balanceError: false })

      if (token.address === NATIVE_TOKEN_ADDRESS && amount && receiver) {
        validateEtherTx({ amount, receiver, gas, gasPrice })
      } else if (token && amount && receiver) {
        validateTransferTokensTx({ 
          amount, 
          receiver, 
          gas, 
          gasPrice, 
          tokenAddress: token.address, 
          tokenDecimals: token.decimals,
        })
      }
    })
  }

  handleSubmit = () => {
    const { amount, receiver, token, customGas, customGasPrice } = this.state
    let { address, gas, gasPrice, sendEtherTx, sendTransferTokensTx } = this.props
    gas = customGas
    gasPrice = customGasPrice
              
    if (this.state.token.address === NATIVE_TOKEN_ADDRESS) {
      sendEtherTx({ amount, receiver, gas, gasPrice, address })
    } else {
      sendTransferTokensTx({ 
        amount, 
        receiver, 
        gas, 
        gasPrice, 
        tokenAddress: token.address, 
        tokenDecimals: token.decimals,
        tokenSymbol: token.symbol,
      })
    }
  }

  isInvalidInput = () => {
    const { amount, receiver, balanceError } = this.state

    return !amount || !receiver || balanceError
  }

  sendMaxAmount = (token) => {
    if (Number(token.availableBalance) <= Number(this.props.transferFee)) return this.setState({ amount: 0, balanceError: true })

    const amountWithoutFee = BigNumber(token.availableBalance).minus(this.props.transferFee).toFixed(8)
    
    this.setState({ amount: Number(amountWithoutFee), balanceError: false }, () => {
      const { gas, gasPrice, validateEtherTx, validateTransferTokensTx } = this.props
      const { amount, receiver } = this.state

      if (token.address === NATIVE_TOKEN_ADDRESS && receiver) {
        validateEtherTx({ gas, gasPrice, amount, receiver })
      } else if (receiver) {                
        validateTransferTokensTx({
          amount,
          receiver,
          tokenAddress: token.address, 
          tokenDecimals: token.decimals,
        })
      }
    })
  }

  render() {
    let { tokens, loading, error, status, statusMessage, gas, gasPrice, hash, receipt, estimatedGas, transferFee } = this.props
    const { token, amount, receiver, customGas, customGasPrice, balanceError } = this.state
    gas = customGas
    gasPrice = customGasPrice

    return (
      <TransferTokensFormRenderer
        handleChange={this.handleChange}
        handleTokenChange={this.handleTokenChange}
        handleSubmit={this.handleSubmit}
        loading={loading}
        error={error}
        status={status}
        statusMessage={statusMessage}
        gas={gas}
        estimatedGas={estimatedGas}
        gasPrice={gasPrice}
        hash={hash}
        receipt={receipt}
        tokens={tokens}
        token={token}
        amount={amount}
        receiver={receiver}
        isInvalidInput={this.isInvalidInput()}
        sendMaxAmount={this.sendMaxAmount}
        transferFee={transferFee}
        balanceError={balanceError}
      />
    )
  }
}

export default TransferTokensForm
