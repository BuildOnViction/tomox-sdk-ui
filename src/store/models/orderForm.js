// @flow
import * as appActionCreators from '../actions/app'
import {
  getTokenPairsDomain,
  getOrderBookDomain,
  getAccountDomain,
  getAccountBalancesDomain,
} from '../domains/'
// import * as orderService from '../services/orders'

import { utils } from 'ethers'
import type { State, ThunkAction } from '../../types'
import type { Side } from '../../types/orders'
import { getSigner } from '../services/signer'
import { parseNewOrderError } from '../../config/errors'
import { joinSignature } from 'ethers/utils'
import { max, minOrderAmount } from '../../utils/helpers'

export default function getOrderFormSelector(state: State) {
  const tokenPairDomain = getTokenPairsDomain(state)
  const orderBookDomain = getOrderBookDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)

  const currentPair = tokenPairDomain.getCurrentPair()
  const baseToken = currentPair.baseTokenSymbol
  const quoteToken = currentPair.quoteTokenSymbol
  const makeFee = currentPair.makeFee
  const takeFee = currentPair.takeFee
  const baseTokenDecimals = currentPair.baseTokenDecimals
  const quoteTokenDecimals = currentPair.quoteTokenDecimals
  const baseTokenBalance = accountBalancesDomain.get(baseToken)
  const quoteTokenBalance = accountBalancesDomain.get(quoteToken)
  const askPrice = orderBookDomain.getAskPrice()
  const bidPrice = orderBookDomain.getBidPrice()
  const selectedOrder = orderBookDomain.getSelectedOrder()

  return {
    selectedOrder,
    currentPair,
    baseToken,
    quoteToken,
    baseTokenBalance,
    quoteTokenBalance,
    baseTokenDecimals,
    quoteTokenDecimals,
    askPrice,
    bidPrice,
    makeFee,
    takeFee,
  }
}

export const defaultFunction = (): ThunkAction => {
  return async (dispatch, getState) => {}
}

export const sendNewOrder = (
  side: Side,
  amount: number,
  price: number
): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    try {
      const state = getState()
      const tokenPairDomain = getTokenPairsDomain(state)
      const accountBalancesDomain = getAccountBalancesDomain(state)
      const accountDomain = getAccountDomain(state)
      const pair = tokenPairDomain.getCurrentPair()
      const exchangeAddress = accountDomain.exchangeAddress()

      const {
        baseTokenSymbol,
        quoteTokenSymbol,
        baseTokenDecimals,
        quoteTokenDecimals,
      } = pair

      const signer = getSigner()
      const userAddress = await signer.getAddress()
      const makeFee = pair.makeFee || '0'
      const takeFee = pair.takeFee || '0'

      const params = {
        side,
        exchangeAddress,
        userAddress,
        pair,
        amount,
        price,
        makeFee,
        takeFee,
      }

      const pairMultiplier = utils.bigNumberify(10).pow(18 + baseTokenDecimals)
      const order = await signer.createRawOrder(params)
      let sellTokenSymbol, totalSellAmount
      const fee = max(makeFee, takeFee)

      order.side === 'BUY'
        ? (sellTokenSymbol = quoteTokenSymbol)
        : (sellTokenSymbol = baseTokenSymbol)

      const sellTokenBalance = accountBalancesDomain.getBigNumberBalance(
        sellTokenSymbol
      )
      const baseAmount = utils.bigNumberify(order.amount)
      const quoteAmount = utils
        .bigNumberify(order.amount)
        .mul(utils.bigNumberify(order.pricepoint))
        .div(pairMultiplier)
      const minQuoteAmount = minOrderAmount(makeFee, takeFee)
      const formattedMinQuoteAmount = utils.formatUnits(
        minQuoteAmount,
        quoteTokenDecimals
      )

      //In case the order is a sell, the fee is subtracted from the received amount of quote token so there is no requirement
      order.side === 'BUY'
        ? (totalSellAmount = quoteAmount.add(fee))
        : (totalSellAmount = baseAmount)

      if (quoteAmount.lt(minQuoteAmount)) {
        return dispatch(
          appActionCreators.addErrorNotification({
            message: `Order value should be higher than ${formattedMinQuoteAmount} ${quoteTokenSymbol}`,
          })
        )
      }

      if (sellTokenBalance.lt(totalSellAmount)) {
        return dispatch(
          appActionCreators.addErrorNotification({
            message: `Insufficient ${sellTokenSymbol} balance`,
          })
        )
      }

      console.log(order)
      socket.sendNewOrderMessage(order)

      // let defaultPriceMultiplier = utils.bigNumberify(1e9);
      // let decimalsPriceMultiplier = utils.bigNumberify(
      //   (10 ** (baseTokenDecimals - quoteTokenDecimals)).toString()
      // );
      // let pricepointMultiplier = defaultPriceMultiplier.mul(
      //   decimalsPriceMultiplier
      // );

      // let order = await signer.createRawOrder(params);
      // let sellTokenSymbol, sellAmount;
      // console.log(order, pricepointMultiplier);
      // sellTokenSymbol =
      //   order.side === 'BUY' ? quoteTokenSymbol : baseTokenSymbol;

      // sellAmount =
      //   order.side === 'BUY'
      //     ? utils
      //         .bigNumberify(order.amount)
      //         .mul(utils.bigNumberify(order.pricepoint))
      //         .div(pricepointMultiplier)
      //     : utils.bigNumberify(order.amount);

      // let buyTokenSymbol = pair.baseTokenAddress === order.buyToken ? pair.baseTokenSymbol : pair.quoteTokenSymbol
      // let sellTokenSymbol = pair.baseTokenAddress === order.sellToken ? pair.baseTokenSymbol : pair.quoteTokenSymbol
      // let buyTokenBalance = accountBalancesDomain.getBigNumberBalance(buyTokenSymbol)

      // let WETHBalance = accountBalancesDomain.getBigNumberBalance('WETH');
      // let sellTokenBalance = accountBalancesDomain.getBigNumberBalance(
      //   sellTokenSymbol
      // );

      // let buyAmount = utils.bigNumberify(order.buyAmount)
      // let sellAmount = utils.bigNumberify(order.sellAmount)
      // let fee = utils.bigNumberify(makeFee);

      // if (buyTokenBalance.lt(buyAmount)) {
      //   return dispatch(
      //     appActionCreators.addErrorNotification({
      //       message: `Insufficient ${buyTokenSymbol} balance`
      //     })
      //   )
      // }

      // if (sellTokenBalance.lt(sellAmount)) {
      //   return dispatch(
      //     appActionCreators.addErrorNotification({
      //       message: `Insufficient ${sellTokenSymbol} balance`
      //     })
      //   );
      // }

      //TODO include the case where WETH is the token balance
      // if (WETHBalance.lt(fee)) {
      //   return dispatch(
      //     appActionCreators.addErrorNotification({
      //       message: 'Insufficient WETH Balance'
      //     })
      //   );
      // }

      // dispatch(
      //   appActionCreators.addSuccessNotification({ message: `Order valid` })
      // );

      // socket.sendNewOrderMessage(order);

      // update to swarm feed
      const feedOrder = [
        {
          id: '0x5b8ba1e94971a5143fe0908e',
          amount: utils.bigNumberify(order.amount),
          baseToken: order.baseToken,
          filledAmount: utils.bigNumberify('0'),
          timestamp: Math.round(Date.now() / 1000),
          exchangeAddress: order.exchangeAddress,
          makeFee: utils.bigNumberify('0'),
          nonce: utils.bigNumberify(order.nonce),
          pairName: `${baseTokenSymbol}/${quoteTokenSymbol}`,
          pricepoint: utils.bigNumberify(order.pricepoint),
          quoteToken: order.quoteToken,
          side: order.side,
          status: order.status,
          takeFee: utils.bigNumberify(order.takeFee),
          userAddress: order.userAddress,
          hash: order.hash,
          signature: joinSignature(order.signature),
        },
      ]
      // console.log(order.baseToken, feedOrder)
      await signer.updateSwarmFeed(order.baseToken, feedOrder)
      console.log("Send feed done")
    } catch (e) {
      console.log(e)

      // if (e.message === errors.invalidJSON) {
      //   return dispatch(appActionCreators.addErrorNotification({ message: 'Connection error' }))
      // }

      // return dispatch(appActionCreators.addErrorNotification({ message: 'Unknown error' }))

      const message = parseNewOrderError(e)
      return dispatch(appActionCreators.addErrorNotification({ message }))
    }
  }
}
