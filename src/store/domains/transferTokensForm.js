// @flow
import type { TxReceipt } from '../../types/common'
import type { TransferTokensFormState } from '../../types/transferTokensForm'

const initialState: TransferTokensFormState = {
  loading: false,
  status: 'incomplete',
  statusMessage: null,
  gas: 2000000,
  estimatedGas: '',
  gasPrice: 250000000,
  hash: null,
  receipt: null,
  transferFee: '',
}

export const initialized = () => {
  const event = (state: TransferTokensFormState = initialState) => state
  return event
}

export const txValidated = (statusMessage, estimatedGas) => {
  const event = (state: TransferTokensFormState) => ({
    ...state,
    status: 'valid',
    statusMessage,
    estimatedGas,
    gas: estimatedGas,
  })
  return event
}

export const txInvalidated = (statusMessage: string) => {
  const event = (state: TransferTokensFormState) => ({
    ...state,
    status: 'invalid',
    statusMessage,
  })
  return event
}

export const txSent = (hash: string) => {
  const event = (state: TransferTokensFormState) => ({
    ...state,
    loading: true,
    status: 'sent',
    statusMessage: null,
    receipt: null,
    hash,
  })
  return event
}

export const txReverted = (statusMessage: string, receipt: TxReceipt) => {
  const event = (state: TransferTokensFormState) => ({
    ...state,
    loading: false,
    status: 'reverted',
    statusMessage,
    receipt,
  })
  return event
}

export const txError = (status: string, statusMessage: string) => {
  const event = (state: TransferTokensFormState) => ({
    ...state,
    loading: false,
    status,
    statusMessage,
  })
  return event
}

export const txConfirmed = (receipt: TxReceipt) => {
  const event = (state: TransferTokensFormState) => ({
    ...state,
    loading: false,
    status: 'confirmed',
    receipt,
  })
  return event
}

export const resetForm = () => {
  const event = (state: TransferTokensFormState) => ({
    ...state,
    loading: false,
    status: 'incomplete',
    hash: null,
    receipt: null,
    transferFee: '',
  })
  return event
}

export const updateTransferFee = (transferFee) => {
  const event = (state: TransferTokensFormState) => ({
    ...state,
    transferFee,
  })
  return event
}

export default function transferTokensFormDomain(
  state: TransferTokensFormState
) {
  return {
    getState: () => state,
    isLoading: () => state.loading,
    getStatus: () => state.status,
    getStatusMessage: () => state.statusMessage,
    getGas: () => state.gas,
    getGasPrice: () => state.gasPrice,
    getHash: () => state.hash,
    getReceipt: () => state.receipt,
    getEstimatedGas: () => state.estimatedGas,
    getTransferFee: () => state.transferFee || 0,
  }
}
