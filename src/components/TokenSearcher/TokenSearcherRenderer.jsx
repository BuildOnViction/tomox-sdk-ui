// @flow
import React from 'react'
import {
  Icon,
  Tabs,
  Tab,
  InputGroup,
} from '@blueprintjs/core'
import {
  Theme,
  Centered,
  Chevron,
  OverlaySpinner,
  DarkMode,
} from '../Common'
import styled from 'styled-components'
import { ResizableBox } from 'react-resizable'

type Token = {
  pair: string,
  lastPrice: string,
  change: string,
  high: string,
  low: string,
  volume: string,
  base: string,
  quote: string,
  favorited: boolean
}

type Props = {
  loading: boolean,
  filteredPairs: any,
  selectedTabId: string,
  baseTokenBalance: number,
  quoteTokenBalance: number,
  searchFilter: string,
  selectedPair: Token,
  filterName: string,
  sortOrder: string,
  isOpen: boolean,
  quoteTokens: Array<string>,
  onChangeSortOrder: string => void,
  changeTab: string => void,
  updateFavorite: (string, boolean) => void,
  onChangeSearchFilter: (SyntheticInputEvent<>) => void,
  onChangeFilterName: (SyntheticInputEvent<>) => void,
  changeSelectedToken: Token => void,
  toggleCollapse: () => void
}

const TokenSearchRenderer = (props: Props) => {
  const {
    loading,
    filteredPairs,
    quoteTokens,
    selectedTabId,
    searchFilter,
    selectedPair,
    sortOrder,
    filterName,
    updateFavorite,
    onChangeFilterName,
    onChangeSearchFilter,
    onChangeSortOrder,
    changeTab,
    changeSelectedToken,
  } = props
  return (
    <React.Fragment>
      {loading ? (
        <OverlaySpinner visible={loading} transparent />
      ) : (
        <TokenSearchCard>
          <SearchInput
            leftIcon="search"
            onChange={onChangeSearchFilter}
            value={searchFilter}
            placeholder="Search"
          />
          
          <TokenSearchTabs selectedTabId={selectedTabId} onChange={changeTab}>
            <Tab
              id="star"
              title={<Icon icon="star" />}
              panel={
                <Panel
                  tokenPairs={filteredPairs.favorites}
                  filterName={filterName}
                  sortOrder={sortOrder}
                  searchFilter={searchFilter}
                  selectedTabId={selectedTabId}
                  selectedPair={selectedPair}
                  changeSelectedToken={changeSelectedToken}
                  updateFavorite={updateFavorite}
                  onChangeSearchFilter={onChangeSearchFilter}
                  onChangeFilterName={onChangeFilterName}
                  onChangeSortOrder={onChangeSortOrder}
                />
              }
            />
            {quoteTokens.map((quote, index) => (
              <Tab
                id={quote}
                key={index}
                title={quote}
                panel={
                  <Panel
                    tokenPairs={filteredPairs[quote]}
                    filterName={filterName}
                    sortOrder={sortOrder}
                    searchFilter={searchFilter}
                    selectedTabId={selectedTabId}
                    selectedPair={selectedPair}
                    filteredPairs={filteredPairs}
                    changeSelectedToken={changeSelectedToken}
                    updateFavorite={updateFavorite}
                    onChangeSearchFilter={onChangeSearchFilter}
                    onChangeFilterName={onChangeFilterName}
                    onChangeSortOrder={onChangeSortOrder}
                  />
                }
              />
            ))}
          </TokenSearchTabs>
        </TokenSearchCard>
      )}
    </React.Fragment>
  )
}

export default TokenSearchRenderer

type PanelProps = {
  filterName: string,
  sortOrder: string,
  searchFilter: string,
  selectedTabId: string,
  selectedPair: Token,
  tokenPairs: Array<Token>,
  changeSelectedToken: Token => void,
  updateFavorite: (string, boolean) => void,
  onChangeSearchFilter: (SyntheticInputEvent<>) => void,
  onChangeFilterName: (SyntheticInputEvent<>) => void,
  onChangeSortOrder: string => void
};

const Panel = (props: PanelProps) => {
  const {
    filterName,
    tokenPairs,
    sortOrder,
    selectedTabId,
    updateFavorite,
    onChangeFilterName,
    changeSelectedToken,
  } = props
  const isFavoriteTokensList = selectedTabId === 'star'

  return (
    <TokenSearchPanelBox>
      <Header
        onChangeFilterName={onChangeFilterName}
        isFavoriteTokensList={isFavoriteTokensList}
        filterName={filterName}
        sortOrder={sortOrder}
      />
      {tokenPairs.map((token, index) => (
        <TokenRow
          key={index}
          index={index}
          token={token}
          selectedTabId={selectedTabId}
          isFavoriteTokensList={isFavoriteTokensList}
          updateFavorite={updateFavorite}
          changeSelectedToken={changeSelectedToken}
        />
      ))}
      {tokenPairs.length === 0 && <Centered>No Tokens to show</Centered>}
    </TokenSearchPanelBox>
  )
}

type TokenRowProps = {
  index: number,
  token: Token,
  isFavoriteTokensList: boolean,
  updateFavorite: (string, boolean) => void,
  changeSelectedToken: Object => void
};

const TokenRow = ({
  index,
  token,
  updateFavorite,
  isFavoriteTokensList,
  changeSelectedToken,
}: TokenRowProps) => {
  const { favorited, lastPrice, change, pair } = token

  return (
    <Row>
      <Cell width="5%">
        <Icon
          icon={favorited ? 'star' : 'star-empty'}
          onClick={() => updateFavorite(pair, !favorited)}
        />
      </Cell>
      <Cell width="30%" onClick={() => changeSelectedToken(token)}>
        {pair}
      </Cell>
      <Cell width="30%" onClick={() => changeSelectedToken(token)}>
        {lastPrice}
      </Cell>
      <Change24H width="35%" change={change} onClick={() => changeSelectedToken(token)}>
        {change}%
      </Change24H>
    </Row>
  )
}

type HeaderProps = {
  onChangeFilterName: (SyntheticInputEvent<>) => void,
  filterName: string,
  sortOrder: string,
  isFavoriteTokensList: boolean
};

const Header = ({
  onChangeFilterName,
  filterName,
  sortOrder,
  isFavoriteTokensList,
}: HeaderProps) => {
  return (
      <HeaderRow>
        <Cell width="5%">&nbsp;</Cell>
        <Cell width="30%" onClick={onChangeFilterName}>
          Pair
        </Cell>
        <Cell width="30%" onClick={onChangeFilterName}>
          Last Price
          {filterName === 'lastPrice' && (
            <span className="icon">
              <Chevron direction={sortOrder} />
            </span>
          )}
        </Cell>
        <Cell width="35%" onClick={onChangeFilterName}>
          24h Change
          {filterName === 'change' && (
            <span className="icon">
              <Chevron direction={sortOrder} />
            </span>
          )}
        </Cell>
      </HeaderRow>
  )
}

const TokenSearchCard = styled.div`
  position: relative;
  background: ${DarkMode.BLACK};
  color: ${DarkMode.WHITE};
  width: 550px;
  height: 300px;
  overflow: hidden;
  border: 1px solid ${DarkMode.LIGHT_BLUE};
  color: ${DarkMode.LIGHT_GRAY};

  .bp3-tab {
    color: ${DarkMode.LIGHT_GRAY};
  }

  .bp3-tab:hover,
  .bp3-tab[aria-selected="true"] {
    color: ${DarkMode.ORANGE};
  }

  .bp3-tab-list {
    padding: 10px;
    border-bottom: 1px solid ${DarkMode.LIGHT_BLUE};
  }
`

const Row = styled.div.attrs({
  className: 'row',
})`
  display: flex;
  width: 100%;
  height: 35px;
  cursor: pointer;
  padding: 0 10px;
`

const Cell = styled.div`
  width: ${({width}) => width || '15%'};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({align}) => align || 'flex-start'}
  flex-grow: ${({flexGrow}) => flexGrow || 0}
`

const TokenSearchTabs = styled(Tabs)`
  height: 100%;
`

const TokenSearchPanelBox = styled.div`
  height: 100%;
`

const SearchInput = styled(InputGroup)`
  width: 150px;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 5;

  .bp3-input {
    background: ${DarkMode.DARK_BLUE};
    color: ${DarkMode.LIGHT_GRAY};
    &::placeholder {
      color: ${DarkMode.LIGHT_GRAY};
    }
  }
`

const HeaderRow = styled(Row)`
  font-size: ${Theme.FONT_SIZE_SM};
  border-bottom: 1px solid ${DarkMode.LIGHT_BLUE};
`

const Change24H = styled(Cell)`
  color: ${props =>
    props.change > 0 ? DarkMode.GREEN : DarkMode.RED} !important;
`


