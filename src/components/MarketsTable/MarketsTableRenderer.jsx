// @flow
import React from 'react'
import styled from 'styled-components'

import {
  formatNumber,
} from 'accounting-js'

import {
  List,
  AutoSizer,
} from 'react-virtualized'

import {
  InputGroup,
} from '@blueprintjs/core'

import {
  CryptoIcon,
  UtilityIcon,
  Colors,
  DarkMode,
  TomoXLogo,
  Centered,
  LargeText,
  SmallText,
  FlexRow,
} from '../Common'

type Props = {
  searchInput: string,
  pairs: Array<Object>,
  handleSearchInputChange: (SyntheticInputEvent<>) => void,
  redirectToTradingPage: (baseTokenSymbol: string, quoteTokenSymbol: string) => void,
  selectedTab: string,
  handleChangeTab: string => void,
  tabs: Array<string>,
  quoteTokens: Array<string>,
  currentReferenceCurrency: string,
};

class MarketsTableRenderer extends React.PureComponent<Props> {

  rowRenderer = ({ key, index, style }: *) => {
    const {
      pairs,
      redirectToTradingPage,
      currentReferenceCurrency,
      updateFavorite,
    } = this.props

    const {
      pair,
      baseTokenSymbol,
      quoteTokenSymbol,
      lastPrice,
      high,
      low,
      change,
      orderVolume,
      favorited,
    } = pairs[index]


    return (
      <Row key={key} onClick={() => redirectToTradingPage(baseTokenSymbol, quoteTokenSymbol)} style={style}>
        <Cell width="25px" onClick={(e) => updateFavorite(e, pair, !favorited)}>
          <UtilityIcon name={favorited ? "Favorite-Solid" : "Favorite"} size={12} />
        </Cell>
        <Cell>
          <CryptoIcon name={baseTokenSymbol} size={25} />
          <PairTitle>{pair}</PairTitle>
        </Cell>
        <Cell width="25%">
          <PriceNumber>
            <ChangeCell change={change}>{formatNumber(lastPrice, { precision: 2 })}</ChangeCell>
          </PriceNumber>
          <PriceNumber>
            <SmallText muted>
              {currentReferenceCurrency}
              {formatNumber(lastPrice, { precision: 2 })} 
            </SmallText>
          </PriceNumber>
        </Cell>
        <Cell>
          <ChangeCell change={change}>
            {change > 0 ? `+${formatNumber(change, { precision: 2 })}` 
            : change === 0 ? formatNumber(change, { precision: 2 })
            : formatNumber(change, { precision: 2 })}%
          </ChangeCell>
        </Cell>
        <Cell>
            {formatNumber(high, { precision: 2 })}
        </Cell>
        <Cell>
          {formatNumber(low, { precision: 2 })}
        </Cell>
        <Cell align="flex-end" flexGrow={2}>
          {orderVolume ? formatNumber(orderVolume, { precision: 2 }) : 'N.A'}
        </Cell>
      </Row>
    )
  }

  noRowsRenderer = () => {
    return (
      <Centered my={4}>
        <TomoXLogo height="100em" width="100em" />
        <LargeText muted>No pairs to display!</LargeText>
      </Centered>
    )
  }

  render() {
    const {
      pairs,
      searchInput,
      handleSearchInputChange,
      selectedTab,
      handleChangeTab,
      tabs,
    } = this.props

    return (
      <TableSection>
        <HeaderWrapper>
          <TabsWrapper>
            {
              tabs.map((tab, i) => {
                return (
                  <TabItem
                    key={i}
                    icon={tab === 'Favorites' ? 'Favorite' : ''}
                    text={tab}
                    onClick={() => handleChangeTab(tab)}
                    active={selectedTab === tab}
                  />
                )
              })
            }
          </TabsWrapper>

          <SearchWrapper
            type="string"
            leftIcon="search"
            placeholder="Search"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </HeaderWrapper>

        <TableHeader>
          <TableHeaderCell width="25px"></TableHeaderCell>
          <TableHeaderCell><SmallText muted>Pair</SmallText></TableHeaderCell>
          <TableHeaderCell width="25%"><SmallText muted>Last Price</SmallText></TableHeaderCell>
          <TableHeaderCell><SmallText muted>24h Change</SmallText></TableHeaderCell>
          <TableHeaderCell><SmallText muted>24h High</SmallText></TableHeaderCell>
          <TableHeaderCell><SmallText muted>24h Low</SmallText></TableHeaderCell>
          <TableHeaderCell align="flex-end" flexGrow={2}><SmallText muted>24h Volume</SmallText></TableHeaderCell>
        </TableHeader>

        <TableBody>
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={pairs.length}
                rowHeight={60}
                rowRenderer={this.rowRenderer}
                noRowsRenderer={this.noRowsRenderer}
                overscanRowCount={0}
                pairs={pairs}
              />
            )}
          </AutoSizer>
        </TableBody>
      </TableSection>
    )
  }
}

const TabItem = (props) => {
  return (
    <TabContent>
      {props.icon && (
        <TabIcon>
          <UtilityIcon name={props.name} 
            size={12}
            color={props.active ? DarkMode.WHITE : ''} />
        </TabIcon>)}

      <TabTitle
        active={props.active}
        onClick={props.onClick}>
        {props.text}
      </TabTitle>
    </TabContent>
  )
}

const ChangeCell = styled.span`
  color: ${({change}) => (change > 0 ? DarkMode.GREEN : (change === 0) ? DarkMode.WHITE : DarkMode.RED)} !important;
`

const PriceNumber = styled.span`
  margin-right: 25px;

  &:last-child {
    margin-right: 0;
  }
`

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  box-shadow: 0 1px 0 0 #37405f;
  padding-bottom: 20px;
`

const SearchWrapper= styled(InputGroup)`
  .bp3-input {
    color: #6e7793;
    min-width: 300px;
    background: ${DarkMode.BLACK};
    border-radius: 0;
    &:focus, 
    &.bp3-active {
      box-shadow: none;
    }
  }
`

const TableSection = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: column;
  height: calc(100% - 145px);
  width: 100%;
  overflow: hidden;
`

const TableBody = styled.div`
  height: calc(100% - 100px);
  color: ${DarkMode.WHITE}
`

const TableHeader = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;  
  padding: 0 20px;
  &:last-child {
    flex-grow: 2;
  }
`

const TableHeaderCell = styled.div`
  display: flex;
  width: ${props => props.width || '15%'};
  justify-content: ${({align}) => align || 'flex-start'};
  flex-grow: ${({flexGrow}) => flexGrow || 0}
`

const Cell = styled.div`
  width: ${({width}) => width || '15%'};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({align}) => align || 'flex-start'}
  flex-grow: ${({flexGrow}) => flexGrow || 0}
`

const PairTitle = styled.div`
  color: ${DarkMode.WHITE};
  margin-left: 9px;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  cursor: pointer;

  &:nth-child(2n+1) {
    background: ${DarkMode.BLACK};
  }
`

const TabsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  & .bp3-button {
    margin-left: 5px;
  }
`

const TabContent = styled.div`
  display: flex;
  align-items: flex-end;
`

const TabIcon = styled.span`
  margin-right: 10px;
`

const TabTitle = styled.span`
  cursor: pointer;
  display: flex;
  margin-right: 60px;
  color: ${props => props.active ? DarkMode.WHITE : 'inherit' };
  &:hover {
    color: ${DarkMode.WHITE};
  }
`

export default MarketsTableRenderer
