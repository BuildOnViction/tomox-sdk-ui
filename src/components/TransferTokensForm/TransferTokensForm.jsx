// @flow
import React from 'react'
import TransferTokensFormRenderer from './TransferTokensFormRenderer'

// import {
//   convertToWei
// } from '../../utils/bignumber'

import { NATIVE_TOKEN_ADDRESS } from '../../config/tokens'
import type { TOMOTxParams, TransferTokensTxParams } from '../../types/transferTokensForm'
import type { Token } from '../../types/tokens'

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
    token: this.props.token || this.props.tokens[0],
    amount: 0,
    receiver: '',
    sender: '',
    customGas: null,
    customGasPrice: null,
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
    const { value, name } = e.target

    this.setState({ [name]: value }, () => {
      let { amount, receiver, token, customGasPrice, customGas } = this.state
      let { gas, gasPrice, validateEtherTx, validateTransferTokensTx } = this.props

      gas = customGas || gas
      gasPrice = customGasPrice || gasPrice

      if (token.address === NATIVE_TOKEN_ADDRESS && amount && receiver) {
        validateEtherTx({ amount, receiver, gas, gasPrice })
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
    this.setState({ token }, () => {
      const { amount, receiver, token } = this.state
      const { gas, gasPrice, validateEtherTx, validateTransferTokensTx, resetForm } = this.props

      resetForm()

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
    gas = customGas || gas
    gasPrice = customGasPrice || gasPrice
          
    // console.log(amount, receiver, gas, gasPrice, token)
    
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
      })
    }
  }

  render() {
    let { tokens, loading, error, status, statusMessage, gas, gasPrice, hash, receipt } = this.props
    let { token, amount, receiver, customGas, customGasPrice } = this.state
    gas = customGas || gas
    gasPrice = customGasPrice || gasPrice

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
        gasPrice={gasPrice}
        hash={hash}
        receipt={receipt}
        tokens={tokens}
        token={token}
        amount={amount}
        receiver={receiver}
      />
    )
  }
}

export default TransferTokensForm
