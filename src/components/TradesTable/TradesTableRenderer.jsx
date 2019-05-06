// @flow
import React from 'react';
import styled from 'styled-components';
import { Loading, Colors, Text, CenteredMessage } from '../Common';
import { Icon, Button, Card, Tabs, Tab, Collapse } from '@blueprintjs/core';
// import { format } from 'date-fns'
import { relativeDate } from '../../utils/helpers';

import type { Trade } from '../../types/trades';
import type { TokenPair } from '../../types/tokens';
import { ResizableBox } from 'react-resizable';

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
    currentPair,
    isOpen,
    selectedTabId,
    onChange,
    trades,
    userTrades,
    toggleCollapse
  } = props;

  return (
    <div>
      <Wrapper className="trade-history">
        <TradesTableHeader>
          <Heading>
            Trades
            <Text muted>
              {' '}
              ({currentPair.baseTokenSymbol} / {currentPair.quoteTokenSymbol})
            </Text>
          </Heading>
          <Button
            icon={isOpen ? 'chevron-up' : 'chevron-down'}
            minimal
            onClick={toggleCollapse}
          />
        </TradesTableHeader>
        <Collapse isOpen={isOpen}>
          {/* <Tabs selectedTabId={selectedTabId} onChange={onChange}>
            <Tab id="24h" title="24H" panel={<Panel trades={tradeHistory} />} />
            <Tab id="all" title="All" panel={<Panel trades={userTradeHistory} />} />
          </Tabs> */}
          <Tabs selectedTabId={selectedTabId} onChange={onChange}>
            <Tab
              id="Market"
              title="Market"
              panel={<MarketTradesPanel trades={trades} />}
            />
            <Tab
              id="User"
              title="User"
              panel={<UserTradesPanel trades={userTrades} />}
            />
          </Tabs>
        </Collapse>
      </Wrapper>
    </div>
  );
};

const MarketTradesPanel = (props: { trades: Array<Trade> }) => {
  const { trades } = props;
  if (!trades) return <Loading />;
  if (trades.length === 0)
    return <CenteredMessage message="No trades for this token pair" />;

  return (
    <ResizableBox height={400} width={Infinity}>
      <ListHeader className="heading">
        <HeadingRow>
          <HeaderCell>PRICE</HeaderCell>
          <HeaderCell>AMOUNT</HeaderCell>
          <HeaderCell>STATUS</HeaderCell>
          <HeaderCell cellName="time">TIME</HeaderCell>
        </HeadingRow>
      </ListHeader>
      <ListBody className="list">
        {trades.map((trade, index) => (
          <Row
            color={
              trade.change === 'positive' ? Colors.BUY_MUTED : Colors.SELL_MUTED
            }
            key={index}
          >
            <Cell
              color={trade.change === 'positive' ? Colors.BUY : Colors.SELL}
            >
              <Icon
                icon={
                  trade.change === 'positive' ? 'chevron-up' : 'chevron-down'
                }
                iconSize={14}
              />
              {trade.price}
            </Cell>
            <Cell>{trade.amount}</Cell>
            <Cell side={trade.side}>{trade.status}</Cell>
            {/* {format(trade.time, 'DD/MM/YYYY HH:MM:SS Z ')} */}
            <Cell cellName="time" muted>
              {relativeDate(trade.time)}
            </Cell>
          </Row>
        ))}
      </ListBody>
    </ResizableBox>
  );
};

const UserTradesPanel = (props: { trades: Array<Trade> }) => {
  const { trades } = props;

  if (!trades) return <Loading />;
  if (trades.length === 0)
    return <CenteredMessage message="No trades for this token pair" />;

  return (
    <ResizableBox height={500} width={Infinity}>
      <ListHeader className="heading">
        <HeadingRow>
          <HeaderCell>PRICE</HeaderCell>
          <HeaderCell>AMOUNT</HeaderCell>
          <HeaderCell>STATUS</HeaderCell>
          <HeaderCell cellName="time">TIME</HeaderCell>
        </HeadingRow>
      </ListHeader>
      <ListBody className="list">
        {trades.map((trade, index) => (
          <Row
            color={
              trade.status === 'EXECUTED' ? Colors.BUY_MUTED : Colors.SELL_MUTED
            }
            key={index}
          >
            <Cell>{trade.price}</Cell>
            <Cell>{trade.amount}</Cell>
            <Cell>{trade.status}</Cell>
            <Cell cellName="time" muted>
              {relativeDate(trade.time)}
            </Cell>
          </Row>
        ))}
      </ListBody>
    </ResizableBox>
  );
};

const TradesTableHeader = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  grid-gap: 10px;
  align-items: center;
`;

const Heading = styled.h3`
  margin: auto;
`;

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
`;

const HeadingRow = styled.li`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
  padding-left: 10px;
`;

const Row = styled.li.attrs({
  className: 'row'
})`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
  border: 1px transparent;
  border-radius: 2px;
  box-shadow: inset 0px 1px 0 0 rgba(16, 22, 26, 0.15);
  padding: 7px;
  padding-left: 10px !important;
  background-color: ${props => props.color};
  /* background-color: ${props =>
    props.side === 'BUY' ? Colors.BUY_MUTED : Colors.SELL_MUTED}; */
`;

const Cell = styled.span`
  color: ${props => (props.color ? props.color : Colors.TEXT_MUTED)};
  min-width: 35px;
  width: ${props => (props.cellName === 'time' ? '43%' : '12%')};
`;

const HeaderCell = styled.span`
  min-width: 35px;
  width: ${props => (props.cellName === 'time' ? '43%' : '12%')};
`;

export default TradesTableRenderer;
