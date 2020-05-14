//@flow
import React from 'react'
import DappLendingTokenSearcherRenderer from './DappLendingTokenSearcherRenderer'
import { sortTable } from '../../../utils/helpers'

//TODO not sure exactly where to define this type.
type Token = {
  pair: string,
  lastPrice: string,
  change: string,
  low: string,
  high: string,
  volume: string,
  base: string,
  quote: string,
  favorited: boolean,
}

type Props = {
  tokenPairsByQuoteToken: { [string]: Array<Token> },
  currentPair: Object,
  baseTokenBalance: number,
  quoteTokenBalance: number,
  updateFavorite: (string, boolean) => void,
  updateCurrentPair: string => void,
}

type State = {
  quoteTokens: Array<string>,
  searchFilter: string,
  filterName: string,
  sortOrder: string,
  selectedTabId: string,
  orderChanged: boolean,
  isOpen: boolean,
}

class DappLendingTokenSearcher extends React.PureComponent<Props, State> {
  state = {
    searchFilter: '',
    filterName: 'symbol',
    sortOrder: 'asc',
    selectedTabId: '',
    orderChanged: false,
    isOpen: true,
    isShowSearchResult: false,
  }

  static getDerivedStateFromProps(props, state) {
    const { currentPair } = props

    if (!state.selectedTabId && currentPair.pair) {
      const lendingToken = currentPair.pair.split('/')[1]
      return {selectedTabId: lendingToken}
    }
    
    return null
  }

  onChangeSearchFilter = (event) => {
    this.setState({ searchFilter: event.target.value })
  };

  showSearchResult = () => {
    this.setState({ isShowSearchResult: true })
  }

  hideSearchResult = () => {
    // Because onBlur event on search input to fast
    // so we can't catch event onClick on the search result item
    // to resolve we delay onBlur event
    setTimeout(() => {
      this.setState({ 
        searchFilter: '',
        isShowSearchResult: false,
      })
    }, 300) 
  }

  onChangeFilterName = (filter: string) => {
    const { filterName, orderChanged } = this.state
    
    if (filter === filterName && !orderChanged) {
      this.setState({
        filterName: filter,
        sortOrder: 'desc',
        orderChanged: true,
      })
    } else {
      this.setState({
        filterName: filter,
        sortOrder: 'asc',
        orderChanged: false,
      })
    }
  };

  onChangeSortOrder = (value: string) => {
    this.setState({ sortOrder: value })
  };

  changeTab = (tabId: string) => {    
    this.setState({ selectedTabId: tabId })
  };

  filterTokens = () => {
    let result = {pairs: [], searchResults: []}
    const { selectedTabId, searchFilter, filterName, sortOrder } = this.state
    const { pairs } = this.props

    if (selectedTabId !== 'favorites') {
      result.pairs = pairs.filter(pair => pair.lendingTokenSymbol === selectedTabId)
    }
    
    if (selectedTabId === 'favorites') result.pairs = pairs.filter(pair => pair.favorited)

    if (searchFilter) {
      result.searchResults = pairs.filter(pair => pair.pair.toLowerCase().includes(searchFilter.toLowerCase()))
    } else {
      result.searchResults = [...pairs]
    }

    result.pairs = sortTable(result.pairs, filterName, sortOrder)
        
    return result
  }

  changeSelectedToken = (pair) => {
    this.props.toggleLendingTokenSearcherDapp(false)
    this.props.updateCurrentPair(pair)
  };

  render() {
    const {
      state: { 
        selectedTabId, 
        searchFilter, 
        sortOrder, 
        filterName, 
        isShowSearchResult,
      },
      props: { 
        updateFavorite, 
        lendingTokens,
      },
      onChangeSearchFilter,
      onChangeFilterName,
      onChangeSortOrder,
      changeTab,
      changeSelectedToken,
      showSearchResult,
      hideSearchResult,
    } = this

    const filteredPairs = this.filterTokens()
    const tabs = ['favorites', ...lendingTokens]

    //Temporary loading condition
    const loading = !selectedTabId

    return (
      <DappLendingTokenSearcherRenderer
        loading={loading}
        tabs={tabs}
        selectedTabId={selectedTabId}
        searchFilter={searchFilter}
        sortOrder={sortOrder}
        filterName={filterName}
        filteredPairs={filteredPairs}
        updateFavorite={updateFavorite}
        onChangeSearchFilter={onChangeSearchFilter}
        showSearchResult={showSearchResult}
        hideSearchResult={hideSearchResult}
        isShowSearchResult={isShowSearchResult}
        onChangeFilterName={onChangeFilterName}
        onChangeSortOrder={onChangeSortOrder}
        changeTab={changeTab}
        changeSelectedToken={changeSelectedToken}
      />
    )
  }
}

export default DappLendingTokenSearcher
