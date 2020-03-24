// @flow

import React from 'react'
import MarketsTableRenderer from './MarketsTableRenderer'

import type { TokenPair } from '../../../types/tokens'
import { sortTable } from '../../../utils/helpers'

type Props = {
  pairs: Array<TokenPair>,
  lendingTokens: Array<string>,
  redirectToLendingPage: (baseTokenSymbol: string, quoteTokenSymbol: string) => void,
  currentReferenceCurrency: string,
  loading: Boolean,
};

type State = {
  searchInput: string,
  selectedTab: string
};

class MarketsTable extends React.PureComponent<Props, State> {
  static defaultProps = {
    pairs: [],
  }

  state = {
    searchInput: '',
    selectedTab: 'All',
    filter: '',
    order: 'asc',
  };

  handleSearchInputChange = (e: SyntheticInputEvent<>) => {
    this.setState({ searchInput: e.target.value })
  };

  handleChangeTab = (selectedTab: string) => {
    this.setState({ selectedTab })
  }

  filterTokens = (pairs) => {
    const { searchInput, selectedTab, filter, order } = this.state

    if (selectedTab.toLowerCase() !== 'all'
      && selectedTab.toLowerCase() !== 'favorites') pairs = pairs.filter(pair => pair.lendingTokenSymbol === selectedTab)

    if (selectedTab.toLowerCase() === 'favorites') pairs = pairs.filter(pair => pair.favorited)
    
    pairs = searchInput ? pairs.filter(pair => pair.termSymbol.toLowerCase().includes(searchInput.toLowerCase())) : pairs

    if (filter) pairs = sortTable(pairs, filter, order)

    return pairs
  }

  handleFavoriteClick = (e, pair, favorited) => {
    e.stopPropagation()

    const { updateFavorite } = this.props
    updateFavorite(pair, favorited)
  }

  onChangeFilter = (column: string) => {
    const { filter, order } = this.state

    if (filter === column) {
      this.setState({
        order: (order === 'asc') ? 'des' : 'asc',
      })
    } else {
      this.setState({
        filter: column,
        order: 'asc',
      })
    }
  }

  render() {
    const {
      pairs,
      redirectToLendingPage,
      lendingTokens,
      currentReferenceCurrency,
      loading,
    } = this.props

    const {
      searchInput,
      selectedTab,
      filter,
      order,
    } = this.state
             
    const filteredPairs = this.filterTokens(pairs)
    const tabs = ['Favorites', ...lendingTokens, 'All']

    return (
      <MarketsTableRenderer
        pairs={filteredPairs}
        searchInput={searchInput}
        handleSearchInputChange={this.handleSearchInputChange}
        redirectToLendingPage={redirectToLendingPage}
        tabs={tabs}
        selectedTab={selectedTab}
        handleChangeTab={this.handleChangeTab}
        currentReferenceCurrency={currentReferenceCurrency}
        updateFavorite={this.handleFavoriteClick}
        loading={loading}
        onChangeFilter={this.onChangeFilter}
        filter={filter}
        order={order}
      />
    )
  }
}

export default MarketsTable


