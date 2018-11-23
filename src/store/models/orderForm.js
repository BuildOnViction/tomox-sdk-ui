// @flow
import * as appActionCreators from '../actions/app';
import {
  getTokenPairsDomain,
  getOrderBookDomain,
  getAccountBalancesDomain
} from '../domains/';
// import * as orderService from '../services/orders'

import { utils } from 'ethers';
import type { State, ThunkAction } from '../../types';
import { getSigner } from '../services/signer';
import { parseNewOrderError } from '../../config/errors';
import { splitSignature } from 'ethers/utils';

export default function getOrderFormSelector(state: State) {
  let tokenPairDomain = getTokenPairsDomain(state);
  let orderBookDomain = getOrderBookDomain(state);
  let accountBalancesDomain = getAccountBalancesDomain(state);

  let currentPair = tokenPairDomain.getCurrentPair();
  let baseToken = currentPair.baseTokenSymbol;
  let quoteToken = currentPair.quoteTokenSymbol;
  let baseTokenBalance = accountBalancesDomain.get(baseToken);
  let quoteTokenBalance = accountBalancesDomain.get(quoteToken);
  let askPrice = orderBookDomain.getAskPrice();
  let bidPrice = orderBookDomain.getBidPrice();

  return {
    currentPair,
    baseToken,
    quoteToken,
    baseTokenBalance,
    quoteTokenBalance,
    askPrice,
    bidPrice
  };
}

export const defaultFunction = (): ThunkAction => {
  return async (dispatch, getState) => {};
};

export const sendNewOrder = (
  side: string,
  amount: number,
  price: number
): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    try {
      let state = getState();
      let tokenPairDomain = getTokenPairsDomain(state);
      let accountBalancesDomain = getAccountBalancesDomain(state);
      let pair = tokenPairDomain.getCurrentPair();
      let {
        baseTokenSymbol,
        quoteTokenSymbol,
        baseTokenDecimals,
        quoteTokenDecimals
      } = pair;

      let signer = getSigner();
      let userAddress = await signer.getAddress();
      let makeFee = '0';
      let takeFee = '0';

      let params = {
        side,
        userAddress,
        pair,
        amount,
        price,
        makeFee,
        takeFee
      };

      let defaultPriceMultiplier = utils.bigNumberify(1e9);
      let decimalsPriceMultiplier = utils.bigNumberify(
        (10 ** (baseTokenDecimals - quoteTokenDecimals)).toString()
      );
      let pricepointMultiplier = defaultPriceMultiplier.mul(
        decimalsPriceMultiplier
      );

      let order = await signer.createRawOrder(params);
      let sellTokenSymbol, sellAmount;
      console.log(order, pricepointMultiplier);
      sellTokenSymbol =
        order.side === 'BUY' ? quoteTokenSymbol : baseTokenSymbol;

      sellAmount =
        order.side === 'BUY'
          ? utils
              .bigNumberify(order.amount)
              .mul(utils.bigNumberify(order.pricepoint))
              .div(pricepointMultiplier)
          : utils.bigNumberify(order.amount);

      // let buyTokenSymbol = pair.baseTokenAddress === order.buyToken ? pair.baseTokenSymbol : pair.quoteTokenSymbol
      // let sellTokenSymbol = pair.baseTokenAddress === order.sellToken ? pair.baseTokenSymbol : pair.quoteTokenSymbol
      // let buyTokenBalance = accountBalancesDomain.getBigNumberBalance(buyTokenSymbol)

      // let WETHBalance = accountBalancesDomain.getBigNumberBalance('WETH');
      let sellTokenBalance = accountBalancesDomain.getBigNumberBalance(
        sellTokenSymbol
      );

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

      if (sellTokenBalance.lt(sellAmount)) {
        return dispatch(
          appActionCreators.addErrorNotification({
            message: `Insufficient ${sellTokenSymbol} balance`
          })
        );
      }

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

      socket.sendNewOrderMessage(order);
      
      // get request then update swarm feed       
      // const feedOrder = 
      // [{
      //   id: '0x5b8ba1e94971a5143fe0908e',
      //   amount: utils.bigNumberify(order.amount),
      //   baseToken: order.baseToken,
      //   filledAmount: utils.bigNumberify('0'),
      //   timestamp: 1542000614,
      //   exchangeAddress: order.exchangeAddress,
      //   makeFee: utils.bigNumberify('0'),
      //   nonce: utils.bigNumberify(order.nonce),
      //   pairName: 'AE/WETH',
      //   pricepoint: utils.bigNumberify(order.pricepoint),
      //   quoteToken: order.quoteToken,
      //   side: order.side,
      //   status: order.status,
      //   takeFee: utils.bigNumberify(order.takeFee),
      //   userAddress: order.userAddress,
      //   hash: order.hash,
      //   signature: splitSignature(order.signature),          
      // }]     
      // signer.updateSwarmFeed(order.baseToken, feedOrder);

    } catch (e) {
      console.log(e);

      // if (e.message === errors.invalidJSON) {
      //   return dispatch(appActionCreators.addErrorNotification({ message: 'Connection error' }))
      // }

      // return dispatch(appActionCreators.addErrorNotification({ message: 'Unknown error' }))

      let message = parseNewOrderError(e);
      return dispatch(appActionCreators.addErrorNotification({ message }));
    }
  };
};
