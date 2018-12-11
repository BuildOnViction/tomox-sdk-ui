//@flow

import type { Order } from './orders';

export type OrderBookState = {
  +selected: ?Order,
  +quoteToken: string,
  +baseToken: string,
  +bids: Object,
  +asks: Object,
  +sortedBids: Array<number>,
  +sortedAsks: Array<number>
};

export type OrderBookData = {
  +bids: Array<Object>,
  +asks: Array<Object>
};

export type OrderListPropsTypes = {
  orderList: Array<Object>,
  bookName: string,
  baseToken: string,
  quoteToken: string,
  decimals: number
};

export type SingleOrderPropsTypes = {
  order: Object,
  index: number,
  decimals: number
};
