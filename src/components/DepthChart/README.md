```js
import OrderBook from '../../components/DepthChart';
```

#### Properties
* `quoteToken` - Quote Token/Coin/currenct
* `baseToken` - Base Token/Coin/currenct
* `sellOrderList` - List of Sell orders
* `buyOrderList` - List of Buy orders

#### Example
```js
<OrderBook
  buyOrderList={buyOrderList}
  sellOrderList={sellOrderList}
  baseToken="TOMO"
  quoteToken="USDT"
/>
```