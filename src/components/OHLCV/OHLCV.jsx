// @flow
import React from 'react';
import SmallChart from './SmallChart';
import type { SendTimelineParams } from '../../types/ohlcv';

type Props = {
  /** Open, high, low, close chart data */
  ohlcvData: Array<Object>,
  currentTimeSpan: Object,
  currentDuration: Object,
  noOfCandles: number,
  updateTimeLine: SendTimelineParams => void,
  saveDuration: Object => void,
  saveTimeSpan: Object => void,
};

type State = {};

export default class OHLCV extends React.PureComponent<Props, State> {
  render() {
    const {
      ohlcvData,
      currentDuration,
      noOfCandles,
      currentTimeSpan,
      updateTimeLine,
      saveTimeSpan,
      saveDuration,
    } = this.props;

    return (
      <SmallChart
        updateTimeLine={updateTimeLine}
        ohlcvData={ohlcvData}
        currentTimeSpan={currentTimeSpan}
        currentDuration={currentDuration}
        saveDuration={saveDuration}
        saveTimeSpan={saveTimeSpan}
        noOfCandles={noOfCandles}
      />
    );
  }
}
