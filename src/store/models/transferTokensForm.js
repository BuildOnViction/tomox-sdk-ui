// @flow
import { utils, Contract } from 'ethers'
import BigNumber from 'bignumber.js'

import {
  getTransferTokensFormDomain,
  getTokenDomain,
  getAccountDomain,
  getAccountBalancesDomain,
} from '../domains'
import * as actionCreators from '../actions/transferTokensForm'
import * as notificationActionCreators from '../actions/app'
import type {
  TOMOTxParams,
  TransferTokensTxParams,
} from '../../types/transferTokensForm'
import type { State, GetState, Dispatch, ThunkAction } from '../../types'

import type { RankedToken } from '../../types/tokens'

import { getSigner } from '../services/signer'

import TRC21 from '../../config/TRC21.json'

import {
  parseTransferEtherError,
  parseTransferTokensError,
} from '../../config/errors'

export default function sendEtherSelector(state: State) {
  const tokenDomain = getTokenDomain(state)
  const transferTokensFormDomain = getTransferTokensFormDomain(state)
  const accountDomain = getAccountDomain(state)
  const tokensBalance = getAccountBalancesDomain(state).balances()

  let tokens: Array<RankedToken> = tokenDomain.rankedTokens()
  tokens = tokens.map(token => {
    return {...token, ...tokensBalance[token.symbol]}
  })

  return {
    getState: () => transferTokensFormDomain.getState(),
    getAddress: () => accountDomain.address(),
    isLoading: () => transferTokensFormDomain.isLoading(),
    getStatus: () => transferTokensFormDomain.getStatus(),
    getStatusMessage: () => transferTokensFormDomain.getStatusMessage(),
    getGas: () => transferTokensFormDomain.getGas(),
    getGasPrice: () => transferTokensFormDomain.getGasPrice(),
    getHash: () => transferTokensFormDomain.getHash(),
    getReceipt: () => transferTokensFormDomain.getReceipt(),
    tokens: () => tokens,
    getEstimatedGas: () => transferTokensFormDomain.getEstimatedGas(),
    getTransferFee: () => transferTokensFormDomain.getTransferFee(),
  }
}

export const estimateTransferTomoFee = ({
  gasPrice,
}: TOMOTxParams): ThunkAction => {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const gasLimit = 21000
      const transferFee = BigNumber(gasLimit).multipliedBy(gasPrice).div(10 ** 18).toNumber()

      dispatch(actionCreators.updateTransferFee(transferFee))
    } catch (error) {
      console.log(error)
    }
  }
}

export const validateEtherTx = ({
  gas,
  gasPrice,
  receiver,
  amount,
}: TOMOTxParams): ThunkAction => {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const signer = getSigner()

      const tx = {
        gasLimit: parseFloat(gas),
        gasPrice: parseFloat(gasPrice),
        to: receiver,
        value: utils.parseEther(amount.toString()),
      }

      let estimatedGas = await signer.provider.estimateGas(tx)
      estimatedGas = estimatedGas.toNumber()

      dispatch(actionCreators.validateTx('transactionValid', estimatedGas))
    } catch (error) {
      console.log(error)
      const errorMessage = parseTransferEtherError(error)
      dispatch(actionCreators.invalidateTx(errorMessage))
    }
  }
}

export const sendEtherTx = ({
  amount,
  receiver,
  gas,
  gasPrice,
}: TOMOTxParams): ThunkAction => {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const signer = getSigner()

      const rawTx = {
        gasLimit: parseFloat(gas),
        gasPrice: parseFloat(gasPrice),
        to: receiver,
        value: utils.parseEther(amount.toString()),
      }

      const tx = await signer.sendTransaction(rawTx)
      dispatch(actionCreators.sendTx(tx.hash))

      const receipt = await signer.provider.waitForTransaction(tx.hash)
      if (receipt.status === 0) {
        dispatch(actionCreators.revertTx('transactionFailed', receipt))
        dispatch(
          notificationActionCreators.addErrorNotification({
            message: 'Token transfer failed.',
          })
        )
      } else {
        dispatch(actionCreators.confirmTx(receipt))
        dispatch(
          notificationActionCreators.addSuccessNotification({
            message: 'Token transfer successful!',
          })
        )
      }
    } catch (error) {
      console.log(error)
      const errorMessage = parseTransferEtherError(error)
      dispatch(actionCreators.invalidateTx(errorMessage))
    }
  }
}

export const estimateTransferTokensFee = (
  params: TransferTokensTxParams
): ThunkAction => {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const { address, decimals } = params
      const signer = getSigner()
      const token = new Contract(address, TRC21, signer)

      let transferFee = await token.minFee()
      transferFee = BigNumber(transferFee).div(10**decimals).toFixed(18)

      dispatch(actionCreators.updateTransferFee(transferFee))
    } catch (error) {
      console.log(error)
    }
  }
}

export const validateTransferTokensTx = (
  params: TransferTokensTxParams
): ThunkAction => {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const { receiver, amount, tokenAddress, tokenDecimals } = params
      const signer = getSigner()
      const token = new Contract(tokenAddress, TRC21, signer)
      const amountTokens = BigNumber(amount).multipliedBy(10**tokenDecimals).toFixed(0)

      let estimatedGas = await token.estimate.transfer(receiver, amountTokens) // Just to validate receiver, estimatedGas seem not work with metamask
      estimatedGas = 2000000

      dispatch(actionCreators.validateTx('transactionValid', estimatedGas))
    } catch (error) {
      console.log(error)
      const errorMessage = parseTransferTokensError(error)
      dispatch(actionCreators.invalidateTx(errorMessage))
    }
  }
}

export const sendTransferTokensTx = (
  params: TransferTokensTxParams
): ThunkAction => {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const {
        receiver,
        amount,
        gas,
        gasPrice,
        tokenAddress,
        tokenDecimals,
        tokenSymbol,
      } = params
      const signer = getSigner()
      const token = new Contract(tokenAddress, TRC21, signer)

      const txOpts = {
        gasLimit: parseFloat(gas),
        gasPrice: parseFloat(gasPrice),
      }

      const state = getState()
      const transferFee = getTransferTokensFormDomain(state).getTransferFee()
      const amountWithFee = BigNumber(amount).plus(transferFee).toNumber()
      const tokenBalance = getAccountBalancesDomain(state).tokenBalance(tokenSymbol) || 0
      
      if (amountWithFee > Number(tokenBalance.availableBalance)) throw new Error('')

      const amountTokens = BigNumber(amount).multipliedBy(10**tokenDecimals).toFixed(0)

      const tx = await token.functions.transfer(receiver, amountTokens, txOpts)

      dispatch(actionCreators.sendTx(tx.hash))

      const receipt = await signer.provider.waitForTransaction(tx.hash)

      if (receipt.status === 0) {
        dispatch(actionCreators.revertTx('Transaction Failed', receipt))
        dispatch(
          notificationActionCreators.addErrorNotification({
            message: 'Token transfer failed.',
          })
        )
      } else {
        dispatch(actionCreators.confirmTx(receipt))
        dispatch(
          notificationActionCreators.addSuccessNotification({
            message: 'Token transfer successful!',
          })
        )
      }
    } catch (error) {
      console.log(error)
      const errorMessage = parseTransferTokensError(error)
      dispatch(actionCreators.txError('error', errorMessage))
    }
  }
}

export const resetForm = (): ThunkAction => {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      dispatch(actionCreators.resetForm())
    } catch (error) {
      console.log(error)
      const errorMessage = parseTransferTokensError(error)
      dispatch(actionCreators.txError('error', errorMessage))
    }
  }
}
