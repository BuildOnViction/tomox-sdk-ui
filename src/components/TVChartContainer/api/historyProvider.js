/* eslint-disable */
import configureStore from '../../../store/configureStore';
import { parseOHLCV } from '../../../utils/parsers'
import * as actionCreators from '../../../store/actions/socketController'
import { ENGINE_HTTP_URL } from '../../../config/environment';

var rp = require('request-promise').defaults({json: true})

const api_root = ENGINE_HTTP_URL
const history = {}
const { store } = configureStore

export default {
	history: history,

    getBars: function(symbolInfo, resolution, from, to, first, limit) {
		const url = '/ohlcv'
		const unit = (resolution.slice(-1) === 'D') ? 'day' : 'min'
		const duration = (resolution === 'D' || resolution === '1D') ? 1 : resolution
		const symbols = symbolInfo.name.split(/[:/]/)
		const pair = store.getState().tokenPairs.byPair[`${symbols[1]}/${symbols[2]}`]
		const baseToken = pair.baseTokenAddress
		const quoteToken = symbols[2] === 'TOMO' ? '0x0000000000000000000000000000000000000001' : pair.quoteTokenAddress

		const qs = {
			baseToken,
			quoteToken,
			pairName: `${symbols[1]}/${symbols[2]}`,
			unit,
			duration,
			from,
			to,
		}
		// console.log(qs)

        return rp({
                url: `${api_root}${url}`,
                qs,
            })
            .then(result => {
                console.log({result})
				if (result.Response && result.Response === 'Error') {
					console.log('CryptoCompare API error:',result.Message)
					return []
				}
				
				const ohlcv = parseOHLCV(result.data, pair)
				store.dispatch(actionCreators.initOHLCV(ohlcv))
				return ohlcv
			})
	}
}
