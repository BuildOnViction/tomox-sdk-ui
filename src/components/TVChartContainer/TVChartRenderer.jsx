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
		// pair: 'ETH/TOMO',
		interval: '1',
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

	componentDidMount() {
		const { 
			// currentDuration, 
			// currentTimeSpan,
			// updateDuration,
			// updateTimeSpan,
			currentPair: { pair },
		} = this.props

		const { location: { origin } } = window
		const custom_css_url = `${ origin }/tvchart.css`

		const widgetOptions = {
			debug: false,
			symbol: pair,
			datafeed: Datafeed,
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			locale: getLanguageFromURL() || 'en',
			disabled_features: [
				'use_localstorage_for_settings', 
				'volume_force_overlay', 
				'header_symbol_search', 
				'symbol_search_hot_key',
				'header_screenshot',
				'header_compare',
				'border_around_the_chart',
				'header_saveload',
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
				"symbolWatermarkProperties.transparency": 90,
				"scalesProperties.textColor" : "#6e7793",
				"scalesProperties.fontSize": 12,
				"scalesProperties.lineColor": "#394362",
				"mainSeriesProperties.candleStyle.wickUpColor": '#336854',
				"mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
				"timeScale.rightOffset": 5,
			}
		};

		const widget = window.tvWidget = new window.TradingView.widget(widgetOptions)

		widget.onChartReady(() => {		
			console.log('Chart loaded!')
		})
	}

	render() {

		return (
			<div
				id={ this.props.containerId }
				className={ 'TVChartRenderer' }
			/>
		);
	}
}
