// @flow
import React from 'react';
import TradesTableRenderer from './TradesTableRenderer';
import type { Trade } from '../../types/trades';
import type { TokenPair } from '../../types/tokens';

type State = {
  selectedTabId: string,
  isOpen: boolean
};

type Props = {
  trades: Array<Trade>,
  currentPair: TokenPair
};

class TradesTable extends React.PureComponent<Props, State> {


  render() {
    const {
      props: { trades, currentPair },
    } = this
    // should order or filter?
    const sortedMarketTradeHistory = trades
    return (
      <TradesTableRenderer
        currentPair={currentPair}
        trades={sortedMarketTradeHistory}
      />
    );
  }
}

export default TradesTable;
