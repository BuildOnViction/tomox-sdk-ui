// @flow
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Loading, Centered, Theme, TmColors, Text, UtilityIcon } from '../Common'
import { formatDate } from '../../utils/helpers'
import type { Trade } from '../../types/trades'
import type { TokenPair } from '../../types/tokens'

type Props = {
  currentPair: TokenPair,
  trades: Array<Trade>,
};

const columnWidth = ['30%', '30%', '40%']

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

const NoData = () => {
  return (
    <Centered my={4}>
      <UtilityIcon name="not-found" width={32} height={32} />
      <Text sm={true} color={TmColors.GRAY}><FormattedMessage id="exchangePage.noTradesHistory" />.</Text>
    </Centered>
  )
}

const MarketTradesPanel = (props: { trades: Array<Trade> }) => {
  const { trades } = props
  if (!trades) return <Loading />
  if (trades.length === 0) return <NoData />

  return (
    <React.Fragment>
      <ListHeader className="header">
        <HeadingRow>
          <HeaderCell 
            width={columnWidth[0]}
            textAlign="left"><FormattedMessage id="exchangePage.time" /></HeaderCell>
          <HeaderCell 
            width={columnWidth[1]}
            textAlign="right"><FormattedMessage id="exchangePage.price" /></HeaderCell>
          <HeaderCell 
            width={columnWidth[2]}
            textAlign="right"><FormattedMessage id="exchangePage.amount" /></HeaderCell>
        </HeadingRow>
      </ListHeader>
      <ListBody>
        {trades.map((trade, index) => (
          <Row key={index}>
            <Cell 
              width={columnWidth[0]}
              textAlign="left">
              {formatDate(trade.time, 'HH:mm:ss')}
            </Cell>
            <Cell
              width={columnWidth[1]}
              textAlign="right"
              className={trade.side === 'BUY' ? 'up' : 'down'}>
              <Ellipsis>{trade.price}</Ellipsis>
            </Cell>
            <Cell 
              textAlign="right"
              width={columnWidth[2]}>
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
  padding: 3.5px 6px 3.5px 0 !important;
  cursor: default;
  font-family: 'Ubuntu', sans-serif;
  font-size: 13px;

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
