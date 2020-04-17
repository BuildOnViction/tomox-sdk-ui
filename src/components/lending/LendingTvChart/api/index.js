/* eslint-disable */
import { socket } from '../../../../store/services'
import { timeSpans, getDurationByTimeSpan } from '../../../../store/models/ohlcv'

import { fetchLendingOHLCV } from '../../../../store/services/api/ohlcv'
import { parseLendingOHLCV } from '../../../../utils/parsers'

const supportedResolutions = ["1", "5", "15", "30", "60", "120", "240", "D", "1W", "1M"]

const config = {
    supported_resolutions: supportedResolutions
}; 

export default {
	onReady: cb => {
	// console.log('=====onReady running')	
		setTimeout(() => cb(config), 0)
		
	},
	searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
		// console.log('====Search Symbols running')
	},
	resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
		// expects a symbolInfo object in response
		// console.log('======resolveSymbol running')
		// console.log('resolveSymbol:', symbolName)
		const [pair, term, lendingToken, lendingTokenDecimals] = symbolName.split('-')
		
		var symbol_stub = {
			name: symbolName,
			description: '',
			type: 'crypto',
			session: '24x7',
			timezone: 'Etc/UTC',
			ticker: pair,
			exchange: 'TomoDex',
			minmov: 1,
			pricescale: Math.pow(10, 2),
			has_intraday: true,
			intraday_multipliers: supportedResolutions,
			supported_resolution:  supportedResolutions,
			volume_precision: 8,
			data_status: 'streaming',
			term, 
			lendingToken,
			lendingTokenDecimals,
		}

		setTimeout(function() {
			onSymbolResolvedCallback(symbol_stub)
			// console.log('Resolving that symbol....', symbol_stub)
		}, 0)
		
		
		// onResolveErrorCallback('Not feeling it today')

	},
	getBars: async function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
		// console.log('=====getBars running')
		// console.log('function args',arguments)
		// console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
		const { term, lendingToken, lendingTokenDecimals } = symbolInfo
		const { interval } = window.lendingTvWidget.symbolInterval()

		if (firstDataRequest) {
			const currentTimeSpan = timeSpans.find(timeSpan => timeSpan.value === interval)
			const currentDuration = getDurationByTimeSpan(currentTimeSpan)

			window.lendingOnHistoryCallback = onHistoryCallback
			socket.subscribeLendingChart(
				{
					term, 
					lendingToken,
				},
				currentTimeSpan.label,
				currentDuration.label,
			)
		} else {
			const intervals = {
				1: '1m',
				5: '5m',
				15: '15m',
				30: '30m',
				60: '1h',
				120: '2h',
				240: '4h',
				'1D': '1d',
				'1W': '1w',
				'1M': '1mo',
			}

			const ohlcv = await fetchLendingOHLCV(term, lendingToken, from, to, intervals[interval])
			if (ohlcv.length > 0) {
				const ohlcvParsed  = parseLendingOHLCV(ohlcv, lendingTokenDecimals)
				onHistoryCallback(ohlcvParsed, {noData: false})
			} else {
				onHistoryCallback([], {noData: true})
			}
		}
	},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		// console.log('=====subscribeBars runnning')
		window.lendinOnRealtimeCallback = onRealtimeCallback
	},
	unsubscribeBars: subscriberUID => {
		// console.log('=====unsubscribeBars running')

		socket.unsubscribeChart()
		window.lendingOnHistoryCallback = null
		window.lendinOnRealtimeCallback = null
		window.lendingOhlcvLastBar = null
	},
	calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
		//optional
		// console.log('=====calculateHistoryDepth running')
		// while optional, this makes sure we request 24 hours of minute data at a time
		// CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
		return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
	},
	getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		// console.log('=====getMarks running')
	},
	getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		// console.log('=====getTimeScaleMarks running')
	},
	getServerTime: cb => {
		// console.log('=====getServerTime running')
	}
}
