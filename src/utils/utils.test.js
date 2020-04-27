import { parseJSONData, parseJSONToFixed, parseOrders, parseTrades, parseOrderBookData } from './parsers'

describe('Parsers', () => {
  it('parseJSONData parses JSON data', () => {
    const data = {
      key1: '1',
      key2: 'some string',
      key3: '1.234',
      key4: {
        key5: {
          key6: ['1.234', 1, 'some other string'],
          key7: 10.2342,
        },
      },
      key8: NaN,
      key9: undefined,
    }

    const expected = {
      key1: 1,
      key2: 'some string',
      key3: 1.234,
      key4: {
        key5: {
          key6: [1.234, 1, 'some other string'],
          key7: 10.2342,
        },
      },
      key8: NaN,
      key9: undefined,
    }

    const parsed = parseJSONData(data)
    expect(parsed).toEqual(expected)
  })

  it('parseJSONToFixed parses JSON data', () => {
    const data = {
      key1: '1',
      key2: 'some string',
      key3: '1.234',
      key4: {
        key5: {
          key6: ['1.234', 1, 'some other string'],
          key7: 10.2342,
        },
      },
      key8: NaN,
      key9: undefined,
    }

    const expected = {
      key1: 1,
      key2: 'some string',
      key3: 1.23,
      key4: {
        key5: {
          key6: [1.23, 1, 'some other string'],
          key7: 10.23,
        },
      },
      key8: NaN,
      key9: undefined,
    }

    const parsed = parseJSONToFixed(data, 2)
    expect(parsed).toEqual(expected)
  })

  it('parseOrders return correct data', () => {
    const pairs = [
      {
        baseTokenAddress: "0x4d7ea2ce949216d6b120f3aa10164173615a2b6c",
        baseTokenDecimals: 18,
        baseTokenSymbol: "BTC",
        pair: "BTC/TOMO",
        quoteTokenAddress: "0x0000000000000000000000000000000000000001",
        quoteTokenDecimals: 18,
        quoteTokenSymbol: "TOMO",
      },
    ]

    const data = [
      {
        amount: "150000000000000000",
        baseToken: "0x4d7ea2ce949216d6b120f3aa10164173615a2b6c",
        createdAt: "2019-11-27T03:06:20.029Z",
        exchangeAddress: "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
        filledAmount: "150000000000000000",
        hash: "0xafada15cbde1e30e01b949864e4a2102197859db9587b92d9c9facef22acb58f",
        key: "afada15cbde1e30e01b949864e4a2102197859db9587b92d9c9facef22acb58f",
        nonce: "3",
        orderID: "0",
        pairName: "BTC/TOMO",
        pricepoint: "27518430000000000000000",
        quoteToken: "0x0000000000000000000000000000000000000001",
        side: "BUY",
        status: "FILLED",
        type: "LO",
        updatedAt: "2019-11-27T03:06:20.029Z",
        userAddress: "0x17f2bed710ba50ed27aea52fc4bd7bda5ed4a037",
      },
      {
        amount: "400000000000000000",
        baseToken: "0x4d7ea2ce949216d6b120f3aa10164173615a2b6c",
        createdAt: "2019-11-27T03:05:04.036Z",
        exchangeAddress: "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
        filledAmount: "400000000000000000",
        hash: "0x35b1e0162dda423d2325dc64910ba88e64d99a925b550cc16e792e7bc4677288",
        key: "35b1e0162dda423d2325dc64910ba88e64d99a925b550cc16e792e7bc4677288",
        nonce: "2",
        orderID: "9808",
        pairName: "BTC/TOMO",
        pricepoint: "27245430000000000000000",
        quoteToken: "0x0000000000000000000000000000000000000001",
        side: "SELL",
        status: "FILLED",
        type: "LO",
        updatedAt: "2019-11-27T03:06:02.043Z",
        userAddress: "0x17f2bed710ba50ed27aea52fc4bd7bda5ed4a037",
      },
      {
        amount: "500000000000000000",
        baseToken: "0x4d7ea2ce949216d6b120f3aa10164173615a2b6c",
        createdAt: "2019-11-27T03:04:32.032Z",
        exchangeAddress: "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
        filledAmount: "500000000000000000",
        hash: "0xd1ae3beb4a5ba7ff596d588804b69c7487dfa0a3ad5f3ab963feef1ca5117724",
        key: "d1ae3beb4a5ba7ff596d588804b69c7487dfa0a3ad5f3ab963feef1ca5117724",
        nonce: "1",
        orderID: "0",
        pairName: "BTC/TOMO",
        pricepoint: "27491130000000000000000",
        quoteToken: "0x0000000000000000000000000000000000000001",
        side: "BUY",
        status: "FILLED",
        type: "LO",
        updatedAt: "2019-11-27T03:04:32.032Z",
        userAddress: "0x17f2bed710ba50ed27aea52fc4bd7bda5ed4a037",
      },
    ]

    const expected = [
      {
        "amount": 0.15,
        "baseTokenAddress": "0x4d7ea2ce949216d6b120f3aa10164173615a2b6c",
        "filled": 0.15,
        "hash": "0xafada15cbde1e30e01b949864e4a2102197859db9587b92d9c9facef22acb58f",
        "orderID": "0",
        "pair": "BTC/TOMO",
        "price": 27518.43,
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "side": "BUY",
        "status": "FILLED",
        "time": "2019-11-27T03:06:20.029Z",
        "type": "LO",
      },
      {
        "amount": 0.4,
        "baseTokenAddress": "0x4d7ea2ce949216d6b120f3aa10164173615a2b6c",
        "filled": 0.4,
        "hash": "0x35b1e0162dda423d2325dc64910ba88e64d99a925b550cc16e792e7bc4677288",
        "orderID": "9808",
        "pair": "BTC/TOMO",
        "price": 27245.43,
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "side": "SELL",
        "status": "FILLED",
        "time": "2019-11-27T03:05:04.036Z",
        "type": "LO",
      },
      {
        "amount": 0.5,
        "baseTokenAddress": "0x4d7ea2ce949216d6b120f3aa10164173615a2b6c",
        "filled": 0.5,
        "hash": "0xd1ae3beb4a5ba7ff596d588804b69c7487dfa0a3ad5f3ab963feef1ca5117724",
        "orderID": "0",
        "pair": "BTC/TOMO",
        "price": 27491.13,
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "side": "BUY",
        "status": "FILLED",
        "time": "2019-11-27T03:04:32.032Z",
        "type": "LO",
      },
    ]

    const parsed = parseOrders(data, pairs)
    expect(parsed).toEqual(expected)
  })

  it('parseTrades return correct data', () => {
    const pair = {
      baseTokenAddress: "0x4d7ea2ce949216d6b120f3aa10164173615a2b6c",
      baseTokenDecimals: 18,
      baseTokenSymbol: "BTC",
      pair: "BTC/TOMO",
      quoteTokenAddress: "0x0000000000000000000000000000000000000001",
      quoteTokenDecimals: 18,
      quoteTokenSymbol: "TOMO",
    }

    const data = [
      {
        amount: "128100000000000000",
        baseToken: "0x4d7eA2cE949216D6b120f3AA10164173615A2b6C",
        createdAt: "2019-11-27T03:04:32.032Z",
        hash: "0xab5d2afe7aa395bb47b6267b27586c961e307aed78ca61b734aecea0ff38a2a0",
        makeFee: "349713384300000000",
        maker: "0x16a73f3a64eca79e117258e66dfd7071cc8312a9",
        makerOrderHash: "0x76d78901c11d4d1956881313070590429f70954dfb6b7165caf5541c2e8d6ca9",
        pairName: "BTC/TOMO",
        pricepoint: "27300030000000000000000",
        quoteToken: "0x0000000000000000000000000000000000000001",
        status: "SUCCESS",
        takeFee: "349713384300000000",
        taker: "0x17f2bed710ba50ed27aea52fc4bd7bda5ed4a037",
        takerOrderHash: "0xd1ae3beb4a5ba7ff596d588804b69c7487dfa0a3ad5f3ab963feef1ca5117724",
        takerOrderSide: "BUY",
        txHash: "0x44a977514a3c2a9d15cc6cca006705f74f696f3a9d4fe47ba0d8c90c894384fe",
      },
      {
        amount: "168360000000000000",
        baseToken: "0x4d7eA2cE949216D6b120f3AA10164173615A2b6C",
        createdAt: "2019-11-27T03:04:32.032Z",
        hash: "0x30fbbba6ec3d066794a3f9c5f7ab7dcc0c7f58991c1c65e9e4a6ca18b7e0643b",
        makeFee: "460082927880000000",
        maker: "0x16a73f3a64eca79e117258e66dfd7071cc8312a9",
        makerOrderHash: "0xb28df1bd4c50a1f92e2f32727667f16dcf592e3ece7025510256c14195273294",
        pairName: "BTC/TOMO",
        pricepoint: "27327330000000000000000",
        quoteToken: "0x0000000000000000000000000000000000000001",
        status: "SUCCESS",
        takeFee: "460082927880000000",
        taker: "0x17f2bed710ba50ed27aea52fc4bd7bda5ed4a037",
        takerOrderHash: "0xd1ae3beb4a5ba7ff596d588804b69c7487dfa0a3ad5f3ab963feef1ca5117724",
        takerOrderSide: "BUY",
        txHash: "0x44a977514a3c2a9d15cc6cca006705f74f696f3a9d4fe47ba0d8c90c894384fe",
      },
      {
        amount: "51240000000000000",
        baseToken: "0x4d7eA2cE949216D6b120f3AA10164173615A2b6C",
        createdAt: "2019-11-27T03:04:32.032Z",
        hash: "0x4e5d01a718065c10749bfabf74158e78bc47a82c6d7e274203e6b9702e6e5a17",
        makeFee: "140165124120000000",
        maker: "0x16a73f3a64eca79e117258e66dfd7071cc8312a9",
        makerOrderHash: "0x2970559db352e2bbd39ec8a6ed70a3192f4df6cc17c6d1dbd1366fd99bb17b1d",
        pairName: "BTC/TOMO",
        pricepoint: "27354630000000000000000",
        quoteToken: "0x0000000000000000000000000000000000000001",
        status: "SUCCESS",
        takeFee: "140165124120000000",
        taker: "0x17f2bed710ba50ed27aea52fc4bd7bda5ed4a037",
        takerOrderHash: "0xd1ae3beb4a5ba7ff596d588804b69c7487dfa0a3ad5f3ab963feef1ca5117724",
        takerOrderSide: "BUY",
        txHash: "0x44a977514a3c2a9d15cc6cca006705f74f696f3a9d4fe47ba0d8c90c894384fe",
      },
    ]

    const expected = [
      {
        "amount": 0.1281,
        "hash": "0xab5d2afe7aa395bb47b6267b27586c961e307aed78ca61b734aecea0ff38a2a0",
        "maker": "0x16a73f3A64EcA79E117258e66dFd7071Cc8312A9",
        "orderHash": undefined,
        "pair": "BTC/TOMO",
        "price": 27300.03,
        "side": "BUY",
        "status": "EXECUTED",
        "taker": "0x17F2beD710ba50Ed27aEa52fc4bD7Bda5ED4a037",
        "time": "2019-11-27T03:04:32.032Z",
        "txHash": "0x44a977514a3c2a9d15cc6cca006705f74f696f3a9d4fe47ba0d8c90c894384fe",
        "type": undefined,
      },
      {
        "amount": 0.16836,
        "hash": "0x30fbbba6ec3d066794a3f9c5f7ab7dcc0c7f58991c1c65e9e4a6ca18b7e0643b",
        "maker": "0x16a73f3A64EcA79E117258e66dFd7071Cc8312A9",
        "orderHash": undefined,
        "pair": "BTC/TOMO",
        "price": 27327.33,
        "side": "BUY",
        "status": "EXECUTED",
        "taker": "0x17F2beD710ba50Ed27aEa52fc4bD7Bda5ED4a037",
        "time": "2019-11-27T03:04:32.032Z",
        "txHash": "0x44a977514a3c2a9d15cc6cca006705f74f696f3a9d4fe47ba0d8c90c894384fe",
        "type": undefined,
      },
      {
        "amount": 0.05124,
        "hash": "0x4e5d01a718065c10749bfabf74158e78bc47a82c6d7e274203e6b9702e6e5a17",
        "maker": "0x16a73f3A64EcA79E117258e66dFd7071Cc8312A9",
        "orderHash": undefined,
        "pair": "BTC/TOMO",
        "price": 27354.63,
        "side": "BUY",
        "status": "EXECUTED",
        "taker": "0x17F2beD710ba50Ed27aEa52fc4bD7Bda5ED4a037",
        "time": "2019-11-27T03:04:32.032Z",
        "txHash": "0x44a977514a3c2a9d15cc6cca006705f74f696f3a9d4fe47ba0d8c90c894384fe",
        "type": undefined,
      },
    ]

    const parsed = parseTrades(data, pair)
    expect(parsed).toEqual(expected)
  })

  it('parseOrderBookData return correct data', () => {
    const pair = {
      baseTokenAddress: "0x4d7ea2ce949216d6b120f3aa10164173615a2b6c",
      baseTokenDecimals: 18,
      baseTokenSymbol: "BTC",
      pair: "BTC/TOMO",
      quoteTokenAddress: "0x0000000000000000000000000000000000000001",
      quoteTokenDecimals: 18,
      quoteTokenSymbol: "TOMO",
    }

    const data = {
      asks: [
        {
          amount: "18300000000000000",
          pricepoint: "27245430000000000000000",
        },
        {
          amount: "47580000000000000",
          pricepoint: "27272730000000000000000",
        },
        {
          amount: "113460000000000000",
          pricepoint: "27300030000000000000000",
        },
      ],
      bids: [
        {
          amount: "139080000000000000",
          pricepoint: "27218130000000000000000",
        },
        {
          amount: "65880000000000000",
          pricepoint: "27190830000000000000000",
        },
        {
          amount: "62220000000000000",
          pricepoint: "27163530000000000000000",
        },
      ],      
    }

    const expected = {
      asks: [
        {
          "amount": 0.0183,
          "price": 27245.43,
        },
        {
          "amount": 0.04758,
          "price": 27272.73,
        },
        {
          "amount": 0.11346,
          "price": 27300.03,
        },
      ],
      bids: [
        {
          "amount": 0.13908,
          "price": 27218.13,
        },
        {
          "amount": 0.06588,
          "price": 27190.83,
        },
        {
          "amount": 0.06222,
          "price": 27163.53,
        },
      ],
    }

    const parsed = parseOrderBookData(data, pair)
    expect(parsed).toEqual(expected)
  })
})
