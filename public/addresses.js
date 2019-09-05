(async () => {
    //Todo: need handle error, at the moment it a little mess
    try {
        const ENGINE_HTTP_URL='http://127.0.0.1:8080'
        const tokensResponse = await fetch(`${ENGINE_HTTP_URL}/tokens`)        
        if(!tokensResponse.ok) throw new Error('Could not connect to network')

        const tokens = {}
        tokens["0x0000000000000000000000000000000000000001"] = {
            "name": "Tomochain",
            "symbol": "TOMO",
            "decimals": 18,
            "makeFee": "1",
            "takeFee": "2"
        }
        const tokensJson = await tokensResponse.json()
        const tokensRaw = tokensJson.data

        for (let i = 0; i < tokensRaw.length; i++) {

            tokens[tokensRaw[i].contractAddress] = {
            'name': tokensRaw[i].symbol,
            'symbol': tokensRaw[i].symbol,
            'decimals': tokensRaw[i].decimals,
            'makeFee': tokensRaw[i].makeFee,
            'takeFee': tokensRaw[i].takeFee,
            }
        }

        const pairsResponse = await fetch(`${ENGINE_HTTP_URL}/pairs`)
        if(!pairsResponse.ok) throw new Error('Could not connect to network')

        const pairsJson = await pairsResponse.json()
        const pairsRaw = pairsJson.data

        const pairs = []

        for (let j = 0; j < pairsRaw.length; j++) {
            const pair = `${pairsRaw[j].baseTokenSymbol}/${pairsRaw[j].quoteTokenSymbol}`
            pairs.push(pair)
        }

        const addresses = {
            tokens,
            pairs,
        }

        sessionStorage.setItem('addresses', JSON.stringify(addresses))
    } catch (error) {
        sessionStorage.setItem('addresses', null)
        console.log(error)
    }
})()