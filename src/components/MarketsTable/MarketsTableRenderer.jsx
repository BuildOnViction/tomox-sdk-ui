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
    } = pairs[index]


    return (
      <Row key={key} onClick={() => redirectToTradingPage(baseTokenSymbol, quoteTokenSymbol)} style={style}>
        <Cell width="25px">
          <UtilityIcon name="Favorite" size={12} />
        </Cell>
        <Cell>
          <FlexRow alignItems="center">
            <CryptoIcon name={baseTokenSymbol} size={25} />
            <SmallText p={2} muted>{pair}</SmallText>
          </FlexRow>
        </Cell>
        <Cell>
          <PriceNumber muted>
            {formatNumber(lastPrice, { precision: 2 })}
          </PriceNumber>
          <PriceNumber muted>
            {currentReferenceCurrency}
            {formatNumber(lastPrice, { precision: 2 })} 
          </PriceNumber>
        </Cell>
        <Cell>
          <ChangeCell change={change}>{change ? `${change}%` : 'N.A'}</ChangeCell>
        </Cell>
        <Cell>
          <SmallText muted>
            {formatNumber(high, { precision: 2 })}
          </SmallText>
        </Cell>
        <Cell>
          <SmallText muted>
            {formatNumber(low, { precision: 2 })}
          </SmallText>
        </Cell>
        <Cell>
          <SmallText muted>
            {orderVolume ? formatNumber(orderVolume, { precision: 2 }) : 'N.A'}
          </SmallText>
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
        <HeaderWrapper style={{ marginBottom: '10px' }}>
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
          <TableHeaderCell>Pair</TableHeaderCell>
          <TableHeaderCell>Last Price</TableHeaderCell>
          <TableHeaderCell>24h Change</TableHeaderCell>
          <TableHeaderCell>24h High</TableHeaderCell>
          <TableHeaderCell>24h Low</TableHeaderCell>
          <TableHeaderCell>24h Volume</TableHeaderCell>
        </TableHeader>
        <Table>
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
        </Table>
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
            color={props.active ? '#fff' : ''} />
        </TabIcon>)}

      <TabTitle key={props.key}
        active={props.active}
        onClick={props.onClick}>
        {props.text}
      </TabTitle>
    </TabContent>
  )
}

const ChangeCell = styled(SmallText).attrs({ className: 'change' })`
  color: ${props => (props.change > 0 ? Colors.GREEN5 : Colors.RED4)} !important;
`

const PriceNumber = styled(SmallText)`
  margin-right: 25px;

  &:last-child {
    margin-right: 0;
  }
`

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  box-shadow: 0 0 0 1px #37405f;
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

const Table = styled.div.attrs({
  className: '',
})`
  width: 100%;
  border: none !important;
`

const TableSection = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const TableBody = styled.div`
  height: 80vh;
`

const TableHeader = styled.div`
  width: 100%;
  display: flex;
  padding: 0 20px;
  margin-top: 10px;
  margin-bottom: 20px;
`

const TableHeaderCell = styled.div`
  width: ${props => props.width || '15%'};
`

const Cell = styled.div`
  width: ${props => props.width || '15%'};
  display: flex;
  flex-direction: row;
  align-items: center;
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
  color: ${props => props.active ? '#fff' : 'inherit' };
  &:hover {
    color: '#fff';
  }
`

export default MarketsTableRenderer
