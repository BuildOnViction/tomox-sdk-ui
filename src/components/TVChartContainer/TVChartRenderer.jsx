import * as React from 'react'

import './index.css'
import Datafeed from './api/'

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)')
	const results = regex.exec(window.location.search)
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

const isExpired = (timestamp, expireDays) => {
	const now = Date.now()
	const expire = expireDays * 24 * 60 * 60 * 1000
	return (now - timestamp) > expire
}

export default class TVChartRenderer extends React.PureComponent {

	static defaultProps = {
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	}

	createWidget() {
		const { 
			ohlcv: {
				currentTimeSpan,
			},
			changeTimeSpan,
			currentPair: { pair, baseTokenAddress, quoteTokenAddress, pricePrecision },
			mode,
			modes,
		} = this.props

		const { location: { origin } } = window
		const custom_css_url = `${ origin }/tvchart.css`
		// Intl maybe incorrect depend browser and it's version
		let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
		timezone = (timezone === 'Asia/Saigon') ? 'Asia/Ho_Chi_Minh' : timezone

		let saved_data = JSON.parse(localStorage.getItem(`savedChart.${this.props.currentPair.pair}`))
		if (saved_data && isExpired(saved_data.createdAt, 7)) {
			saved_data = null
			localStorage.removeItem(`savedChart.${this.props.currentPair.pair}`)
		}

		const widgetOptions = {
			debug: false,
			symbol: [pair, baseTokenAddress, quoteTokenAddress].join('-'),
			datafeed: Datafeed,
			interval: currentTimeSpan.value,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			locale: getLanguageFromURL() || 'en',
			disabled_features: [
				'use_localstorage_for_settings', 
				'volume_force_overlay', 
				'symbol_search_hot_key',
				'header_symbol_search', 
				'header_screenshot',
				'header_compare',
				'header_saveload',
				'header_undo_redo',
			],
			enabled_features: [],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			theme: mode,
			custom_css_url,
			overrides: {
				...modes[mode],
				'mainSeriesProperties.minTick': `${Math.pow(10, pricePrecision)},1,false`,
				'paneProperties.legendProperties.showSeriesOHLC': true,
				'paneProperties.legendProperties.showLegend': false,
				'paneProperties.legendProperties.showBarChange': true,
				'mainSeriesProperties.candleStyle.upColor': "#00c38c",
				'mainSeriesProperties.candleStyle.downColor': "#f94d5c",
				'mainSeriesProperties.candleStyle.drawWick': true,
				'mainSeriesProperties.candleStyle.wickUpColor': "#00c38c",
				'mainSeriesProperties.candleStyle.wickDownColor': "#f94d5c",
				'mainSeriesProperties.candleStyle.drawBorder': true,
				'mainSeriesProperties.candleStyle.borderUpColor': "#00c38c",
				'mainSeriesProperties.candleStyle.borderDownColor': "#f94d5c",			
				'scalesProperties.fontSize': 12,
				'scalesProperties.textColor' : "#6e7793",
			},
			time_frames: [],
			timezone,
			saved_data,
		}

		const widget = window.tvWidget = new window.TradingView.widget(widgetOptions)

		widget.onChartReady(() => {
			widget.chart().onIntervalChanged().subscribe(null, function(interval, obj) {
				changeTimeSpan(interval)
			})
		})
	}

	componentDidMount() {
		this.createWidget()
	}

	componentWillUnmount() {
		if (window.tvWidget !== null) {
			window.tvWidget.onChartReady(_ => {
				window.tvWidget.save(data => {
					localStorage.setItem(
						`savedChart.${this.props.currentPair.pair}`, 
						JSON.stringify({...data, createdAt: Date.now()})
					)
				})
				window.tvWidget.remove()
				window.tvWidget = null
			})
		}		
	}

	render() {

		return (
			<div
				id={ this.props.containerId }
				className={ 'TVChartRenderer' }
			/>
		)
	}
}
