// @flow
import { utils, Contract } from 'ethers'
import {
  getAccountBalancesDomain,
  getAccountDomain,
  getSignerDomain,
  getGetStartedModalDomain,
} from '../domains'

import * as notificationActionCreators from '../actions/app'
import * as actionCreators from '../actions/getStartedModal'
import { push } from 'connected-react-router'

import { getSigner } from '../services/signer'
import { EXCHANGE_ADDRESS, WETH_ADDRESS } from '../../config/contracts'
import { WETH } from '../../config/abis'
import { ALLOWANCE_THRESHOLD } from '../../utils/constants'
import type { State, ThunkAction } from '../../types'

export default function convertTokensFormSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const signerDomain = getSignerDomain(state)
  const getStartedModalDomain = getGetStartedModalDomain(state)

  return {
    TOMOAddress: () => accountDomain.address(),
    TomoBalance: () => accountBalancesDomain.tomoBalance(),
    WETHBalance: () => accountBalancesDomain.tokenBalance('WETH'),
    networkID: () => signerDomain.getNetworkID(),
    convertTxState: () => getStartedModalDomain.convertTxState(),
    approveTxState: () => getStartedModalDomain.approveTxState(),
  }
}

export const convertETH = (convertAmount: number): ThunkAction => {
  return async (dispatch, getState) => {
    try {
      const signer = getSigner()
      const networkID = signer.provider.network.chainId
      const weth = new Contract(WETH_ADDRESS[networkID], WETH, signer)
      const signerAddress = await signer.getAddress()
      const txCount = await signer.provider.getTransactionCount(signerAddress)

      const convertTxPromise = weth.deposit({
        value: utils.parseEther(convertAmount.toString()),
        nonce: txCount,
      })

      const allowTxPromise = weth.approve(
        EXCHANGE_ADDRESS[networkID],
        ALLOWANCE_THRESHOLD,
        { nonce: txCount + 1 }
      )

      const [convertTx, allowTx] = await Promise.all([
        convertTxPromise,
        allowTxPromise,
      ])
      dispatch(actionCreators.sendConvertTx(convertTx.hash))
      dispatch(actionCreators.sendApproveTx(allowTx.hash))

      const [convertTxReceipt, allowTxReceipt] = await Promise.all([
        signer.provider.waitForTransaction(convertTx.hash),
        signer.provider.waitForTransaction(allowTx.hash),
      ])

      convertTxReceipt.status === 0
        ? dispatch(actionCreators.revertConvertTx(convertTxReceipt))
        : dispatch(actionCreators.confirmConvertTx(convertTxReceipt))

      allowTxReceipt.status === 0
        ? dispatch(actionCreators.revertApproveTx(allowTxReceipt))
        : dispatch(actionCreators.confirmApproveTx(allowTxReceipt))

      convertTxReceipt.status === 0 || allowTxReceipt.status === 0
        ? dispatch(
            notificationActionCreators.addErrorNotification({
              message: 'TOMO conversion transaction failed',
            })
          )
        : dispatch(
            notificationActionCreators.addSuccessNotification({
              message: 'TOMO conversion transaction successful!',
            })
          )
    } catch (error) {
      console.log(error.message)
    }
  }
}

export const redirectToTradingPage = (): ThunkAction => {
  return async (dispatch, getState) => {
    dispatch(push('/trade'))
  }
}

export const approveWETH = (): ThunkAction => {
  return async (dispatch, getState) => {
    try {
      const signer = getSigner()
      const networkID = signer.provider.network.chainId
      const weth = new Contract(WETH_ADDRESS[networkID], WETH, signer)

      const tx = await weth.approve(
        EXCHANGE_ADDRESS[networkID],
        ALLOWANCE_THRESHOLD
      )
      const txReceipt = await signer.provider.waitForTransaction(tx.hash)

      txReceipt.status === 0
        ? dispatch(actionCreators.revertApproveTx(txReceipt))
        : dispatch(actionCreators.confirmConvertTx(txReceipt))
    } catch (error) {
      console.log(error.message)
    }
  }
}
