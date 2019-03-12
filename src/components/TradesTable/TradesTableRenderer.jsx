// @flow
import React from 'react';
import styled from 'styled-components';
import { Loading, CenteredMessage } from '../Common';
import { Card } from '@blueprintjs/core';
import { formatDate } from '../../utils/helpers';

import type { Trade } from '../../types/trades';
import type { TokenPair } from '../../types/tokens';

type Props = {
  selectedTabId: string,
  currentPair: TokenPair,
  onChange: string => void,
  trades: Array<Trade>,
  userTrades: Array<Trade>,
  toggleCollapse: (SyntheticEvent<>) => void,
  isOpen: boolean
};

const TradesTableRenderer = (props: Props) => {
  const {
    trades,
  } = props

  return (
    <div>
      <Wrapper className="trade-history">
        <MarketTradesPanel trades={trades} />
      </Wrapper>
    </div>
  )
}

const MarketTradesPanel = (props: { trades: Array<Trade> }) => {
  const { trades } = props
  if (!trades) return <Loading />
  if (trades.length === 0)
    return <CenteredMessage message="No trades for this token pair" />;

  return (
    <React.Fragment>
      <ListHeader className="heading">
        <HeadingRow>
          <HeaderCell 
            width="33%"
            textAlign="left">Time</HeaderCell>
          <HeaderCell 
            width="34%"
            textAlign="center">Price</HeaderCell>
          <HeaderCell 
            width="33%"
            textAlign="right">Amount</HeaderCell>
        </HeadingRow>
      </ListHeader>
      <ListBody className="list">
        {trades.map((trade, index) => (
          <Row key={index}>
            <Cell 
              width="33%"
              textAlign="left">
              {formatDate(trade.time, 'pp')}
            </Cell>
            <Cell
              width="34%"
              textAlign="center"
              className={trade.change === 'positive' ? 'up' : 'down'}>
              {trade.price}
            </Cell>
            <Cell 
              textAlign="right"
              width="33%">{trade.amount}</Cell>
          </Row>
        ))}
      </ListBody>
    </React.Fragment>
  )
}

const Wrapper = styled(Card)`
  margin: auto;
  height: 100% !important;
`;

const ListHeader = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0px;
`;

const ListBody = styled.ul`
  height: 90%;
  max-height: 500px;
  overflow-y: auto;
  margin: 0;
`

const HeadingRow = styled.li.attrs({
  className: 'title',
})`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
`

const Row = styled.li.attrs({
  className: 'row'
})`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
`

const Cell = styled.span`
  min-width: 35px;
  width: ${props => props.width};
  text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
`

const HeaderCell = styled.span`
  min-width: 35px;
  width: ${props => props.width};
  text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
`

export default TradesTableRenderer
