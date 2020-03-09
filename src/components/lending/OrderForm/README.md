```js
import OrderForm from '../../components/OrderForm';
```

#### Properties
* `formName` - Name of Form Sell/Buy
* `askPrice` - Current Ask Price of quote token
* `bidPrice` - Current Bid price of quote token
* `quoteToken` - Quote token/coin/currency (TOMO/BTC) => TOMO
* `baseToken` - Base token/coin/currency (TOMO/BTC) => BTC
* `totalQuoteBalance` - Total Balance of quote
* `totalBaseBalance` - Total Balance of base

#### Example
```js
<OrderForm
  formName="Sell"
  quoteToken="TOMO"
  baseToken="BTC"
  askPrice={0.25}
  bidPrice={0.29}
  totalQuoteBalance={1000}
  totalBaseBalance={10}
/>
```