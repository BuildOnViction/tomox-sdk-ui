/* eslint-disable */

import stream from './stream'
import { socket } from '../../../store/services'
import { timeSpans, getDurationByTimeSpan } from '../../../store/models/ohlcv'

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
		// console.log('resolveSymbol:',{symbolName})
		var symbol_stub = {
			name: symbolName,
			description: '',
			type: 'crypto',
			session: '24x7',
			timezone: 'Etc/UTC',
			ticker: symbolName,
			exchange: '',
			minmov: 1,
			pricescale: Math.pow(10, 4),
			has_intraday: true,
			intraday_multipliers: supportedResolutions,
			supported_resolution:  supportedResolutions,
			volume_precision: 8,
			data_status: 'streaming',
		}

		setTimeout(function() {
			onSymbolResolvedCallback(symbol_stub)
			// console.log('Resolving that symbol....', symbol_stub)
		}, 0)
		
		
		// onResolveErrorCallback('Not feeling it today')

	},
	getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
		// console.log('=====getBars running')
		// console.log('function args',arguments)
		// console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
		
		// const store = window.store

		// if (firstDataRequest) {
		// 	const { ohlcv: { ohlcvData } } = store.getState()	
		// 	onHistoryCallback(ohlcvData, {noData: false})
		// 	window.tvWidget.latestBar = JSON.parse(JSON.stringify(ohlcvData.slice(-1)[0]))
		// } else {
		// 	onHistoryCallback([], {noData: true})
		// }

		// call socket subscribe in here
		if (firstDataRequest) {
			const [pair, baseTokenAddress, quoteTokenAddress] = symbolInfo.name.split('-')
			const { interval } = window.tvWidget.symbolInterval()
			const currentTimeSpan = timeSpans.find(timeSpan => timeSpan.value === interval)
			const currentDuration = getDurationByTimeSpan(currentTimeSpan)

			window.onHistoryCallback = onHistoryCallback
			socket.subscribeChart(
				{
					pair,
					baseTokenAddress,
					quoteTokenAddress,
				},
				currentTimeSpan.label,
				currentDuration.label,
			)
		} else {
			onHistoryCallback([], {noData: true})
		}
	},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		// console.log('=====subscribeBars runnning')
		// stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
		window.onRealtimeCallback = onRealtimeCallback
	},
	unsubscribeBars: subscriberUID => {
		// console.log('=====unsubscribeBars running')

		// stream.unsubscribeBars(subscriberUID)

		// call socket unsubscribe in here
		socket.unsubscribeChart()
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
