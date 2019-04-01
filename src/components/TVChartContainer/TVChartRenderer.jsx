import * as React from 'react';
import './index.css';
import Datafeed from './api/'


function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default class TVChartRenderer extends React.PureComponent {

	static defaultProps = {
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	};

	createWidget() {
		const { 
			ohlcv: {
				// currentDuration, 
				currentTimeSpan,
				// updateDuration,
				// updateTimeSpan,				
			},
			changeTimeSpan,
			currentPair: { pair },
		} = this.props

		const { location: { origin } } = window
		const custom_css_url = `${ origin }/tvchart.css`

		const widgetOptions = {
			debug: false,
			symbol: pair,
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
			theme: 'Dark',
			custom_css_url,
			overrides: {
				"volumePaneSize": "medium",
				"paneProperties.background": "#252C40",
				"paneProperties.vertGridProperties.color": "transparent",
				"paneProperties.horzGridProperties.color": "#394362",
				"paneProperties.legendProperties.showSeriesTitle": false,
				"scalesProperties.textColor" : "#6e7793",
				"scalesProperties.fontSize": 12,
				"scalesProperties.lineColor": "#394362",
				"mainSeriesProperties.candleStyle.wickUpColor": '#336854',
				"mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
				"timeScale.rightOffset": 5,
			},
			time_frames: [],
		}

		const widget = window.tvWidget = new window.TradingView.widget(widgetOptions)

		widget.onChartReady(() => {		
			console.log('Chart loaded!')

			widget.chart().onIntervalChanged().subscribe(null, function(interval, obj) {
				changeTimeSpan(interval)
			})
		})
	}

	componentDidMount() {
		this.createWidget()
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
