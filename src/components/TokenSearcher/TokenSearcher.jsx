//@flow
import React from 'react'
import TokenSearcherRenderer from './TokenSearcherRenderer'
import { sortTable } from '../../utils/helpers'

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
  selectedPair: ?Token,
  filterName: string,
  sortOrder: string,
  selectedTabId: string,
  orderChanged: boolean,
  isOpen: boolean,
}

class TokenSearcher extends React.PureComponent<Props, State> {
  state = {
    quoteTokens: [],
    searchFilter: '',
    selectedPair: null,
    filterName: 'symbol',
    sortOrder: 'asc',
    selectedTabId: '',
    orderChanged: false,
    isOpen: true,
    isShowSearchResult: false,
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { tokenPairsByQuoteToken, currentPair } = nextProps
    const quoteTokens: Array<string> = Object.keys(tokenPairsByQuoteToken)
    const currentQuoteToken = currentPair.quoteTokenSymbol
    
    const defaultPairs = tokenPairsByQuoteToken[currentQuoteToken]
    const selectedPair = defaultPairs.filter(pair => pair.pair === currentPair.pair)[0]

    if (!prevState.selectedPair) {
      return {
        quoteTokens,
        selectedTabId: currentQuoteToken,
        selectedPair, // selectedPair: defaultPairs[0],
      }
    } return null
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
    const result = { favorites: [], searchResult: [] }
    const { tokenPairsByQuoteToken } = this.props
    const { searchFilter, filterName, sortOrder } = this.state

    for (const quote of Object.keys(tokenPairsByQuoteToken)) {
      if (searchFilter) {
        const tokenPairs = tokenPairsByQuoteToken[quote].filter(tokenPair => {
          return tokenPair.pair.includes(searchFilter.toLocaleUpperCase())
        })

        result['searchResult'] = result['searchResult'].concat(tokenPairs)
      } else {
        result['searchResult'] = result['searchResult'].concat(tokenPairsByQuoteToken[quote])
      }

      result[quote] = tokenPairsByQuoteToken[quote]

      result['favorites'] = result['favorites'].concat(tokenPairsByQuoteToken[quote].filter(pairObj => { 
        return pairObj.favorited
      }))

      result['favorites'] = sortTable(
        result['favorites'],
        filterName,
        sortOrder
      )

      result[quote] = sortTable(result[quote], filterName, sortOrder)

      result['searchResult'] = sortTable(result['searchResult'], 'pair', 'asc')
    }

    return result
  }

  changeSelectedToken = (token: Token) => {
    if (this.props.toggleTokenSearcherMobile) this.props.toggleTokenSearcherMobile(false)
    if (token.pair === this.state.selectedPair.pair) return
    this.setState({ selectedPair: token })
    this.props.updateCurrentPair(token.pair)
  };

  render() {
    const {
      state: { 
        selectedTabId, 
        searchFilter, 
        selectedPair, 
        sortOrder, 
        filterName, 
        quoteTokens, 
        isShowSearchResult,
      },
      props: { 
        updateFavorite, 
        baseTokenBalance, 
        quoteTokenBalance,
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

    //Temporary loading condition
    const loading = typeof selectedPair === 'undefined'

    return (
      <TokenSearcherRenderer
        loading={loading}
        quoteTokens={quoteTokens}
        selectedTabId={selectedTabId}
        searchFilter={searchFilter}
        baseTokenBalance={baseTokenBalance}
        quoteTokenBalance={quoteTokenBalance}
        // silence-error: couldn't resolve selectedPair === undefined case
        selectedPair={selectedPair}
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

export default TokenSearcher
