// @flow
import { Contract } from 'ethers'
import {
  getAccountBalancesDomain,
  getAccountDomain,
  getDepositFormDomain,
  getSignerDomain,
  getTokenDomain,
  getDepositDomain,
} from '../domains'

import * as actionCreators from '../actions/accountBalances'
import * as depositFormActionCreators from '../actions/depositForm'
// import * as accountBalancesService from '../services/accountBalances';
import { getSigner } from '../services/signer'
import { EXCHANGE_ADDRESS, WETH_ADDRESS } from '../../config/contracts'
import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'
import { ERC20, WETH } from '../../config/abis'

import type { Token, TokenBalance, TokenBalances } from '../../types/tokens'
import type { Chain } from '../../types/deposit'
import type { PairAddresses } from '../../types/pairs'
import type { State, ThunkAction } from '../../types'

export default function depositFormSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const tokenDomain = getTokenDomain(state)
  const depositDomain = getDepositDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const signerDomain = getSignerDomain(state)
  const depositFormDomain = getDepositFormDomain(state)

  return {
    accountAddress: () => accountDomain.address(),
    associatedAddress: () => depositFormDomain.getAssociatedAddress(),
    tokens: () => tokenDomain.tokens(),
    rankedTokens: () => tokenDomain.rankedTokens(),
    blockchain: () => depositDomain.blockchain(),
    getAddressAssociation: (chain: Chain) =>
      depositDomain.getAddressAssociation(chain),
    symbols: () => tokenDomain.symbols(),
    tokenIsSubscribed: (symbol: string) =>
      accountBalancesDomain.isSubscribed(symbol),
    balances: () => accountBalancesDomain.balances(),
    networkId: () => signerDomain.getNetworkId(),
    getStep: () => depositFormDomain.getStep(),
    getAllowTxState: () => depositFormDomain.getAllowTxState(),
    getConvertTxState: () => depositFormDomain.getConvertTxState(),
  }
}

export function queryBalances(): ThunkAction {
  return async (dispatch, getState, { api }) => {
    try {
      const state = getState()
      const accountAddress = depositFormSelector(state).accountAddress()
      let tokens = depositFormSelector(state).tokens()
      tokens = tokens.filter(
        (token: Token) => token.symbol !== NATIVE_TOKEN_SYMBOL
      )

      if (!accountAddress) throw new Error('Account address is not set')

      // const tokenBalances: TokenBalances = await accountBalancesService.queryTokenBalances(
      //   accountAddress,
      //   tokens
      // );
      // const tomoBalance: TokenBalance = await accountBalancesService.queryTomoBalance(
      //   accountAddress
      // );

      // const tokenBalances: TokenBalances = await provider.queryTokenBalances(
      //   accountAddress,
      //   tokens
      // )
      // const tomoBalance: TokenBalance = await provider.queryTomoBalance(
      //   accountAddress
      // )

      const tomoBalance: TokenBalance = await api.fetchTomoBalance(accountAddress)
      const tokenBalances: TokenBalances = await api.fetchTokenBalances(accountAddress, tokens)

      const balances = [tomoBalance].concat(tokenBalances)
      dispatch(actionCreators.updateBalances(balances))
    } catch (error) {
      console.log('queryBalances', error.message)
    }
  }
}

export function subscribeBalance(token: Token): ThunkAction {
  return async (dispatch, getState, { provider }) => {
    try {
      let unsubscribe
      const { symbol } = token
      const state = getState()
      const accountAddress = depositFormSelector(state).accountAddress()
      const tokenSymbols = depositFormSelector(state).symbols()
      const tokenIsSubscribed = depositFormSelector(state).tokenIsSubscribed(
        symbol
      )

      const updateBalanceHandler = balance => {
        dispatch(actionCreators.updateBalance(symbol, balance))
        dispatch(depositFormActionCreators.deposit())
      }

      if (tokenIsSubscribed) return
      if (!accountAddress) throw new Error('Account address is not set')
      if (tokenSymbols.indexOf(symbol) === -1)
        throw new Error('Token is not subscribed')

      dispatch(actionCreators.subscribeBalance(symbol))

      // token.address === '0x0'
      //   ? (unsubscribe = await accountBalancesService.subscribeTomoBalance(
      //       accountAddress,
      //       updateBalanceHandler
      //     ))
      //   : (unsubscribe = await accountBalancesService.subscribeTokenBalance(
      //       accountAddress,
      //       token,
      //       updateBalanceHandler
      //     ));

      const assignUnsubscribe = token => {
        return token.address === '0x0'
          ? provider.subscribeTomoBalance(accountAddress, updateBalanceHandler)
          : provider.subscribeTokenBalance(
              accountAddress,
              token,
              updateBalanceHandler
            )
      }

      unsubscribe = await assignUnsubscribe(token)
      // token.address === '0x0'
      //   ? (unsubscribe = await provider.subscribeTomoBalance(accountAddress, updateBalanceHandler))
      //   : (unsubscribe = await provider.subscribeTokenBalance(accountAddress, token, updateBalanceHandler));

      return async () => {
        unsubscribe()

        //Then we resubscribe the update balance listener.
        // const updateBalanceHandler = balance =>
        //   dispatch(actionCreators.updateBalance(symbol, balance));
        // token.address === '0x0'
        // ? (unsubscribe = await provider.subscribeTomoBalance(accountAddress, updateBalanceHandler))
        // : (unsubscribe = await provider.subscribeTokenBalance(accountAddress, token, updateBalanceHandler))
        unsubscribe = await assignUnsubscribe(token)
        dispatch(actionCreators.unsubscribeBalance(symbol))
      }
    } catch (error) {
      console.log(error.message)
    }
  }
}

export const confirmEtherDeposit = (
  shouldConvert: boolean,
  shouldAllow: boolean,
  convertAmount: number
): ThunkAction => {
  return async (dispatch, getState) => {
    try {
      dispatch(depositFormActionCreators.confirm())
      const signer = getSigner()
      const network = depositFormSelector(getState()).networkId()
      const weth = new Contract(WETH_ADDRESS[network], WETH, signer)

      if (shouldConvert) {
        if (shouldAllow) {
          // let convertTxParams = { value: 1000 };
          const convertTxPromise = weth.deposit()

          // let allowTxParams = {};
          const allowTxPromise = weth.approve(EXCHANGE_ADDRESS[network], -1, {})

          const [convertTx, allowTx] = await Promise.all([
            convertTxPromise,
            allowTxPromise,
          ])

          dispatch(depositFormActionCreators.sendConvertTx(convertTx.hash))
          dispatch(depositFormActionCreators.sendAllowTx(allowTx.hash))

          const [convertTxReceipt, allowTxReceipt] = await Promise.all([
            signer.provider.waitForTransaction(convertTx.hash),
            signer.provider.waitForTransaction(allowTx.hash),
          ])

          convertTxReceipt.status === '0x0'
            ? dispatch(
                depositFormActionCreators.revertConvertTx(convertTxReceipt)
              )
            : dispatch(
                depositFormActionCreators.confirmConvertTx(convertTxReceipt)
              )

          allowTxReceipt.status === '0x0'
            ? dispatch(depositFormActionCreators.revertAllowTx(allowTxReceipt))
            : dispatch(depositFormActionCreators.confirmAllowTx(allowTxReceipt))
        } else {
          // let convertTxParams = { value: 1000 };
          const convertTx = await weth.convert()
          dispatch(depositFormActionCreators.sendConvertTx(convertTx.hash))
          const convertTxReceipt = await signer.provider.waitForTransaction(
            convertTx.hash
          )

          convertTxReceipt.status === '0x0'
            ? dispatch(
                depositFormActionCreators.revertConvertTx(convertTxReceipt)
              )
            : dispatch(
                depositFormActionCreators.confirmConvertTx(convertTxReceipt)
              )
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }
}

export const confirmTokenDeposit = (
  { address }: Token,
  shouldAllow: boolean
): ThunkAction => {
  return async (dispatch, getState) => {
    try {
      const signer = getSigner()
      const exchange = EXCHANGE_ADDRESS[signer.provider.network.chainId]
      const token = new Contract(address, ERC20, signer)

      if (shouldAllow) {
        const allowTx = await token.approve(exchange, -1)
        dispatch(depositFormActionCreators.sendAllowTx(allowTx.hash))

        const allowTxReceipt = await signer.provider.waitForTransaction(
          allowTx.hash
        )

        allowTxReceipt.status === '0x0'
          ? dispatch(depositFormActionCreators.revertAllowTx(allowTxReceipt))
          : dispatch(depositFormActionCreators.confirmAllowTx(allowTxReceipt))
      }

      dispatch(depositFormActionCreators.confirm())
    } catch (error) {
      console.log(error.message)
    }
  }
}

export const updateAddressAssociation = (
  chain: string,
  associatedAddress: string,
  pairAddresses: PairAddresses
): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    socket.sendNewDepositMessage(chain, associatedAddress, pairAddresses)
  }
}
