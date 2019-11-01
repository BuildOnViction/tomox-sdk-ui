// @flow

import React from 'react'
import MarketsTableRenderer from './MarketsTableRenderer'

import type { TokenPair } from '../../types/tokens'

type Props = {
  pairs: Array<TokenPair>,
  quoteTokens: Array<string>,
  redirectToTradingPage: (baseTokenSymbol: string, quoteTokenSymbol: string) => void,
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
  };

  handleSearchInputChange = (e: SyntheticInputEvent<>) => {
    this.setState({ searchInput: e.target.value.trim() })
  };

  handleChangeTab = (selectedTab: string) => {
    this.setState({ selectedTab })
  }

  filterTokens = (pairs: Array<TokenPair>) => {
    const { searchInput, selectedTab } = this.state

    if (selectedTab.toLowerCase() !== 'all'
      && selectedTab.toLowerCase() !== 'favorites') pairs = pairs.filter(pair => pair.quoteTokenSymbol === selectedTab)

    if (selectedTab.toLowerCase() === 'favorites') pairs = pairs.filter(pair => pair.favorited)
    
    pairs = searchInput ? pairs.filter(pair => pair.baseTokenSymbol.indexOf(searchInput.toUpperCase()) > -1) : pairs

    return pairs
  }

  handleFavoriteClick = (e, pair, favorited) => {
    e.stopPropagation()

    const { updateFavorite } = this.props
    updateFavorite(pair, favorited)
  }

  render() {
    const {
      pairs,
      redirectToTradingPage,
      quoteTokens,
      currentReferenceCurrency,
      loading,
    } = this.props

    const {
      searchInput,
      selectedTab,
    } = this.state

    const filteredPairs = this.filterTokens(pairs)
    const tabs = ['Favorites', ...quoteTokens, 'All']

    return (
      <MarketsTableRenderer
        pairs={filteredPairs}
        searchInput={searchInput}
        handleSearchInputChange={this.handleSearchInputChange}
        redirectToTradingPage={redirectToTradingPage}
        quoteTokens={quoteTokens}
        tabs={tabs}
        selectedTab={selectedTab}
        handleChangeTab={this.handleChangeTab}
        currentReferenceCurrency={currentReferenceCurrency}
        updateFavorite={this.handleFavoriteClick}
        loading={loading}
      />
    )
  }
}

export default MarketsTable


