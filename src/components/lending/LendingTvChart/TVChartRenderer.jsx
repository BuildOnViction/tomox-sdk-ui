import * as React from 'react'

import './index.css'
import Datafeed from './api/'
import { isTomoWallet, isMobile, getLocaleTradingView } from '../../../utils/helpers'
import { DEX_VERSION } from '../../../config/environment'

const isExpired = (timestamp, expireDays: number = 1) => {
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
			currentPair: { 
				pair,
				termValue,
				lendingTokenAddress,
				lendingTokenDecimals,
			},
			mode,
			modes,
			locale,
		} = this.props

		const { location: { origin } } = window
		const custom_css_url = `${ origin }/tvchart_lending_07052020.css`
		// Intl maybe incorrect depend browser and it's version
		let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
		timezone = (timezone === 'Asia/Saigon') ? 'Asia/Ho_Chi_Minh' : timezone

		let saved_data = JSON.parse(localStorage.getItem(`${DEX_VERSION}:savedChart.${this.props.currentPair.pair}`))
		if (saved_data && isExpired(saved_data.createdAt, 1)) {
			saved_data = null
			localStorage.removeItem(`${DEX_VERSION}:savedChart.${this.props.currentPair.pair}`)
		}

		const widgetOptions = {
			debug: false,
			symbol: [pair, termValue, lendingTokenAddress, lendingTokenDecimals].join('-'),
			datafeed: Datafeed,
			interval: currentTimeSpan.value,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			locale: getLocaleTradingView(locale),
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
			// charts_storage_url: this.props.chartsStorageUrl,
			// charts_storage_api_version: this.props.chartsStorageApiVersion,
			// client_id: this.props.clientId,
			// user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			theme: mode,
			custom_css_url,
			overrides: {
				...modes[mode],
				'mainSeriesProperties.minTick': `${Math.pow(10, 2)},1,false`,
				"mainSeriesProperties.visible": true,
				"mainSeriesProperties.showPriceLine": true,

				'mainSeriesProperties.candleStyle.upColor': "#00c38c",
				'mainSeriesProperties.candleStyle.downColor': "#f94d5c",
				'mainSeriesProperties.candleStyle.drawWick': true,
				'mainSeriesProperties.candleStyle.wickUpColor': "#00c38c",
				'mainSeriesProperties.candleStyle.wickDownColor': "#f94d5c",
				'mainSeriesProperties.candleStyle.drawBorder': true,
				'mainSeriesProperties.candleStyle.borderUpColor': "#00c38c",
				'mainSeriesProperties.candleStyle.borderDownColor': "#f94d5c",

				'paneProperties.legendProperties.showSeriesOHLC': true,
				'paneProperties.legendProperties.showLegend': false,
				'paneProperties.legendProperties.showBarChange': true,
				"paneProperties.legendProperties.showSeriesTitle": false,

				'scalesProperties.fontSize': 12,
				'scalesProperties.textColor' : "#6e7793",
				"scalesProperties.lineColor": "#394362",

				"timeScale.rightOffset": 5,
				"volumePaneSize": "medium",
			},
			time_frames: [],
			timezone,
			saved_data,
		}

		const widget = window.lendingTvWidget = new window.TradingView.widget(widgetOptions)
		
		widget.onChartReady(() => {
			// This is a workaround detail see the issue #171
			widget.applyOverrides({...modes[mode]})

			if (isTomoWallet() || isMobile()) {
				window.lendingTvWidget.chart().executeActionById('drawingToolbarAction')
			}

			widget.chart().onIntervalChanged().subscribe(null, function(interval, obj) {
				changeTimeSpan(interval)
			})
		})
	}

	componentDidMount() {
		this.createWidget()
	}

	componentWillUnmount() {
		if (window.lendingTvWidget !== null) {
			window.lendingTvWidget.onChartReady(_ => {
				window.lendingTvWidget.save(data => {
					// This is a workaround detail see the issue #171
					delete data.charts[0].chartProperties.paneProperties.background
					data.charts[0].timeScale = {
						m_barSpacing: 6,
						m_rightOffset: 10,
					}

					localStorage.setItem(
						`savedChart.${this.props.currentPair.pair}`, 
						JSON.stringify({...data, createdAt: Date.now()})
					)
				})
				window.lendingTvWidget.remove()
				window.lendingTvWidget = null
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
