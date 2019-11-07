import createStore from '../configureStore'
import { getSigner } from '../services/signer'
import getTransferTokensFormSelector from './transferTokensForm'
import * as actionCreators from './transferTokensForm'
import { mockEtherTxParams } from '../../mockData'

import { Contract } from 'ethers'

jest.mock('ethers')
jest.mock('../services/signer')

let selector

it('handles validateEtherTx (valid) correctly', async () => {
  const toNumber = jest.fn(() => 'estimated Gas')
  const estimateGas = jest.fn(() => Promise.resolve({ toNumber }))
  const getSignerMock = jest.fn(() => ({ provider: { estimateGas } }))
  getSigner.mockImplementation(getSignerMock)

  const { store } = createStore()
  selector = getTransferTokensFormSelector(store.getState())
  await store.dispatch(actionCreators.validateEtherTx(mockEtherTxParams))

  selector = getTransferTokensFormSelector(store.getState())
  expect(selector.getGas()).toEqual('estimated Gas')
  expect(selector.getStatusMessage()).toEqual('Transaction Valid')
})

it('handles validateEtherTx (invalid) correctly', async () => {
  const estimateGas = jest.fn(() => Promise.reject(new Error('some error')))
  const getSignerMock = jest.fn(() => ({ provider: { estimateGas } }))
  getSigner.mockImplementation(getSignerMock)

  const { store } = createStore()
  selector = getTransferTokensFormSelector(store.getState())

  await store.dispatch(actionCreators.validateEtherTx({ mockEtherTxParams }))

  selector = getTransferTokensFormSelector(store.getState())
  expect(selector.getStatusMessage()).toEqual('some error')
})

it('handles sendEtherTx (transaction confirmed) correctly', async () => {
  const waitForTransaction = jest.fn(() => Promise.resolve({ hash: 'some hash', status: '0x1' }))
  const sendTransaction = jest.fn(() => Promise.resolve({ hash: 'some hash' }))
  const getSignerMock = jest.fn(() => ({ provider: { waitForTransaction }, sendTransaction }))
  getSigner.mockImplementation(getSignerMock)

  const { store } = createStore()
  selector = getTransferTokensFormSelector(store.getState())

  await store.dispatch(actionCreators.sendEtherTx(mockEtherTxParams))

  selector = getTransferTokensFormSelector(store.getState())
  expect(selector.getReceipt()).toEqual({
    hash: 'some hash',
    status: '0x1',
  })
})

it('handles sendEtherTx (failed) correctly', async () => {
  const waitForTransaction = jest.fn(() => Promise.resolve({ hash: 'some hash', status: '0x0' }))
  const sendTransaction = jest.fn(() => Promise.resolve({ hash: 'some hash' }))
  const getSignerMock = jest.fn(() => ({ provider: { waitForTransaction }, sendTransaction }))
  getSigner.mockImplementation(getSignerMock)

  const { store } = createStore()
  selector = getTransferTokensFormSelector(store.getState())
  await store.dispatch(actionCreators.sendEtherTx(mockEtherTxParams))

  selector = getTransferTokensFormSelector(store.getState())
  expect(selector.getStatus()).toEqual('reverted')
  expect(selector.getStatusMessage()).toEqual('Transaction Failed')
  expect(selector.getReceipt()).toEqual({ hash: 'some hash', status: '0x0' })
})

it('handles sendEtherTx (throwing an error) correctly', async () => {
  const waitForTransaction = jest.fn(() => Promise.resolve({ hash: 'some hash', status: '0x1' }))
  const sendTransaction = jest.fn(() => Promise.reject(new Error('some error')))
  const getSignerMock = jest.fn(() => ({ provider: { waitForTransaction }, sendTransaction }))
  getSigner.mockImplementation(getSignerMock)

  const { store } = createStore()
  selector = getTransferTokensFormSelector(store.getState())
  await store.dispatch(actionCreators.sendEtherTx(mockEtherTxParams))

  selector = getTransferTokensFormSelector(store.getState())
  expect(selector.getStatus()).toEqual('error')
  expect(selector.getStatusMessage()).toEqual('some error')
})

it('handles validateTransferTokens (valid) correctly', async () => {
  const toNumber = jest.fn(() => 'estimated gas')
  const transfer = jest.fn(() => Promise.resolve({ toNumber }))
  const contractMock = jest.fn(() => ({ estimate: { transfer } }))
  Contract.mockImplementation(contractMock)
  getSigner.mockImplementation(jest.fn(() => 'signer'))

  const { store } = createStore()
  selector = getTransferTokensFormSelector(store.getState())
  await store.dispatch(actionCreators.validateTransferTokensTx(mockEtherTxParams))

  selector = getTransferTokensFormSelector(store.getState())
  expect(selector.getGas()).toEqual('estimated gas')
  expect(selector.getStatusMessage()).toEqual('Transaction Valid')
})

it('handles validateTransferTokens (invalid) correctly', async () => {
  const transfer = jest.fn(() => Promise.reject(new Error('some error')))
  const contractMock = jest.fn(() => ({ estimate: { transfer } }))
  Contract.mockImplementation(contractMock)
  getSigner.mockImplementation(jest.fn(() => 'signer'))

  const { store } = createStore()
  selector = getTransferTokensFormSelector(store.getState())
  await store.dispatch(actionCreators.validateTransferTokensTx(mockEtherTxParams))

  selector = getTransferTokensFormSelector(store.getState())
  expect(selector.getStatusMessage()).toEqual('some error')
})

it('handles sendTransferTokens (transaction confirmed) correctly', async () => {
  const transfer = jest.fn(() => Promise.resolve({ hash: 'some hash' }))
  const waitForTransaction = jest.fn(() => Promise.resolve({ hash: 'some hash', status: '0x1' }))
  const contractMock = jest.fn(() => ({ transfer }))
  const getSignerMock = jest.fn(() => ({ provider: { waitForTransaction } }))

  getSigner.mockImplementation(getSignerMock)
  Contract.mockImplementation(contractMock)

  const { store } = createStore()
  selector = getTransferTokensFormSelector(store.getState())
  await store.dispatch(actionCreators.sendTransferTokensTx(mockEtherTxParams))

  selector = getTransferTokensFormSelector(store.getState())
  expect(selector.getReceipt()).toEqual({
    hash: 'some hash',
    status: '0x1',
  })
})

it('handles sendTransferTokensTx (transaction failed) correctly', async () => {
  const waitForTransaction = jest.fn(() => Promise.resolve({ hash: 'some hash', status: '0x0' }))
  const getSignerMock = jest.fn(() => ({ provider: { waitForTransaction } }))
  const transfer = jest.fn(() => Promise.resolve({ hash: 'some hash' }))
  const contractMock = jest.fn(() => ({ transfer }))

  getSigner.mockImplementation(getSignerMock)
  Contract.mockImplementation(contractMock)

  const { store } = createStore()
  selector = getTransferTokensFormSelector(store.getState())
  await store.dispatch(actionCreators.sendTransferTokensTx(mockEtherTxParams))

  selector = getTransferTokensFormSelector(store.getState())
  expect(selector.getStatus()).toEqual('reverted')
  expect(selector.getStatusMessage()).toEqual('Transaction Failed')
  expect(selector.getReceipt()).toEqual({ hash: 'some hash', status: '0x0' })
})

it('handles sendTransferTokens (throwing an error) correctly', async () => {
  const waitForTransaction = jest.fn(() => Promise.resolve({ hash: 'some hash', status: '0x1' }))
  const getSignerMock = jest.fn(() => ({ provider: { waitForTransaction } }))
  const transfer = jest.fn(() => Promise.reject(new Error('some error')))
  const contractMock = jest.fn(() => ({ transfer }))

  getSigner.mockImplementation(getSignerMock)
  Contract.mockImplementation(contractMock)

  const { store } = createStore()
  selector = getTransferTokensFormSelector(store.getState())
  await store.dispatch(actionCreators.sendTransferTokensTx(mockEtherTxParams))

  selector = getTransferTokensFormSelector(store.getState())
  expect(selector.getStatus()).toEqual('error')
  expect(selector.getStatusMessage()).toEqual('some error')
})
