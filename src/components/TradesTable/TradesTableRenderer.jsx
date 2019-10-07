// @flow
import React from 'react'
import styled from 'styled-components'
import { Loading, CenteredMessage, Theme } from '../Common'
import { formatDate } from '../../utils/helpers'

import type { Trade } from '../../types/trades'
import type { TokenPair } from '../../types/tokens'

type Props = {
  currentPair: TokenPair,
  trades: Array<Trade>,
};

const TradesTableRenderer = (props: Props) => {
  const {
    trades,
  } = props

  return (
    <Wrapper>
      <MarketTradesPanel trades={trades} />
    </Wrapper>
  )
}

const MarketTradesPanel = (props: { trades: Array<Trade> }) => {
  const { trades } = props
  if (!trades) return <Loading />
  if (trades.length === 0)
    return <CenteredMessage message="No trades for this token pair" />;

  return (
    <React.Fragment>
      <ListHeader className="header">
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
      <ListBody>
        {trades.map((trade, index) => (
          <Row key={index}>
            <Cell 
              width="33%"
              textAlign="left">
              {formatDate(trade.time, 'HH: mm: ss')}
            </Cell>
            <Cell
              width="34%"
              textAlign="left"
              className={trade.side === 'BUY' ? 'up' : 'down'}>
              <Ellipsis>{trade.price}</Ellipsis>
            </Cell>
            <Cell 
              textAlign="right"
              width="33%">
              <Ellipsis>{trade.amount}</Ellipsis>
            </Cell>
          </Row>
        ))}
      </ListBody>
    </React.Fragment>
  )
}

const Wrapper = styled.div.attrs({
  className: "trade-history",
})`
  margin: auto;
  height: 100% !important;
  font-size: ${Theme.FONT_SIZE_SM};

  .header {  
    height: 16px;    
  }
  .content {
    height: calc(100% - 16px);
  }

  @media only screen and (max-width: 680px) {
    .tomo-wallet & .content {
      height: 396px;
    }
  }
`

const ListHeader = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0px;
`

const ListBody = styled.ul.attrs({
  className: 'content',
})`
  overflow-y: auto;
  margin: 0;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      overflow-y: hidden;
    }
  }
`

const HeadingRow = styled.li.attrs({
  className: 'title',
})`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
  padding-right: 10px;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      padding-left: 10px;
    }
  }
`

const Row = styled.li.attrs({
  className: 'row',
})`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 3.5px 10px 3.5px 0 !important;
  cursor: default;

  &:hover {
    background-color: ${props => props.theme.orderbookHover};
  }

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      padding-left: 10px !important;
    }
  }
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

const Ellipsis = styled.span`
  width: 100%;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default TradesTableRenderer
