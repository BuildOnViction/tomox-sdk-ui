// @flow
import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { List, AutoSizer } from 'react-virtualized'
import { InputGroup } from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'

import {
  Theme,
  UtilityIcon,
  TmColors,
  Centered,
  Text,
  SmallText,
  // TokenImage,
} from '../../Common'
import { getChangePercentText } from '../../../utils/helpers'
import CenteredSpinner from '../../../components/Common/CenteredSpinner'

type Props = {
  searchInput: string,
  pairs: Array<Object>,
  handleSearchInputChange: (SyntheticInputEvent<>) => void,
  redirectToLendingPage: (baseTokenSymbol: string, quoteTokenSymbol: string) => void,
  selectedTab: string,
  handleChangeTab: string => void,
  tabs: Array<string>,
  quoteTokens: Array<string>,
  currentReferenceCurrency: string,
  onChangeFilter: Function,
};

class MarketsTableRenderer extends React.PureComponent<Props> {

  rowRenderer = ({ key, index, style }: *) => {
    const {
      pairs,
      redirectToLendingPage,
      updateFavorite,
    } = this.props

    const {
      name,
      baseTokenAddress,
      close,
      high,
      low,
      change,
      volume,
      favorited,
      pricePrecision,
    } = pairs[index]


    return (
      <Row key={key} style={style} onClick={() => redirectToLendingPage(name)}>
        <Cell width="25px" onClick={(e) => updateFavorite(e, name, !favorited)}>
          <UtilityIcon name={favorited ? "FavoriteSolid" : "Favorite"} width={12} height={12} />
        </Cell>
        <Cell>
          <PairTitle>{name}</PairTitle>
        </Cell>
        <Cell width="25%">
          <PriceNumber>
            <ChangeCell change={change}>{(close !== null) ? BigNumber(close).toFormat(pricePrecision) : "N.A"}&#37;</ChangeCell>
          </PriceNumber>
        </Cell>
        <Cell>
            <ChangeCell change={change}>
              {change !== null ? getChangePercentText(change) : "N.A"}
            </ChangeCell>
        </Cell>
        <Cell>
            {(high !== null) ? BigNumber(high).toFormat(pricePrecision): "N.A"}&#37;
        </Cell>
        <Cell>
          {(low !== null) ? BigNumber(low).toFormat(pricePrecision) : "N.A"}&#37;
        </Cell>
        <Cell align="flex-end" flexGrow={2}>
          {(volume !== null) ? BigNumber(volume).toFormat(2) : 'N.A'}
        </Cell>
      </Row>
    )
  }

  noRowsRenderer = () => {
    return (
      <Centered my={4}>
        <UtilityIcon name="not-found" />
        <Text color={TmColors.GRAY}><FormattedMessage id="marketsPage.pairs.notFound" />.</Text>
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
      loading,
      onChangeFilter,
      filter, 
      order,
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
            autoComplete="off"
            id="search"
            name="search"
          />
        </HeaderWrapper>

        <TableHeader>
          <TableHeaderCell width="25px"></TableHeaderCell>
          <TableHeaderCell onClick={() => onChangeFilter("pair")}>
            <SmallText muted>{<FormattedMessage dataColumn="pair" id="marketsPage.pair" />}</SmallText>
            {filter === 'pair' && (
              <UtilityIcon name={order === "asc" ? "arrow-up" : "arrow-down"} />
            )}
          </TableHeaderCell>
          <TableHeaderCell onClick={() => onChangeFilter("lastPrice")} width="25%">
            <SmallText muted>{<FormattedMessage id="lendingMarketsPage.lastMatch" />}</SmallText>
            {filter === 'lastPrice' && (
              <UtilityIcon name={order === "asc" ? "arrow-up" : "arrow-down"} />
            )}
          </TableHeaderCell>
          <TableHeaderCell onClick={() => onChangeFilter("change")}>
            <SmallText muted>{<FormattedMessage id="marketsPage.24hChange" />}</SmallText>
            {filter === 'change' && (
              <UtilityIcon name={order === "asc" ? "arrow-up" : "arrow-down"} />
            )}
          </TableHeaderCell>
          <TableHeaderCell onClick={() => onChangeFilter("high")}>
            <SmallText muted>{<FormattedMessage id="marketsPage.24hHigh" />}</SmallText>
            {filter === 'high' && (
              <UtilityIcon name={order === "asc" ? "arrow-up" : "arrow-down"} />
            )}
          </TableHeaderCell>
          <TableHeaderCell onClick={() => onChangeFilter("low")}>
            <SmallText muted>{<FormattedMessage id="marketsPage.24hLow" />}</SmallText>
            {filter === 'low' && (
              <UtilityIcon name={order === "asc" ? "arrow-up" : "arrow-down"} />
            )}
          </TableHeaderCell>
          <TableHeaderCell onClick={() => onChangeFilter("volume")} align="flex-end" flexGrow={2}>
            <SmallText muted>{<FormattedMessage id="marketsPage.24hVolume" />}</SmallText>
            {filter === 'volume' && (
              <UtilityIcon name={order === "asc" ? "arrow-up" : "arrow-down"} />
            )}
          </TableHeaderCell>
        </TableHeader>

        <TableBody>
          {loading && <CenteredSpinner />}
          {!loading && (
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
                  filter={filter}
                  order={order}
                />
              )}
            </AutoSizer>
          )}
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
            width={12}
            height={12}
            color={props.active ? TmColors.ORANGE : ''} />
        </TabIcon>)}

      <TabTitle
        active={props.active}
        onClick={props.onClick}>
        {props.text}
      </TabTitle>
    </TabContent>
  )
}

/* eslint-disable */
const ChangeCell = styled.span`
  color: ${({change, theme}) => (change > 0 ? TmColors.GREEN : (change === 0) ? theme.textTable : TmColors.RED)} !important;
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
  box-shadow: 0 1px 0 0 ${props => props.theme.border};
  padding-bottom: 20px;
`

const SearchWrapper= styled(InputGroup)`
  .bp3-input {
    color: #6e7793;
    min-width: 300px;
    background: ${props => props.theme.subBg};
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
  color: ${props => props.theme.textTable};
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
  flex-grow: ${({flexGrow}) => flexGrow || 0};
  cursor: pointer;
  user-select: none;
  align-items: center;

  svg {
    margin-left: 7px;
  }
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
  color: ${props => props.theme.textTable};
  margin-left: 9px;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  height: ${Theme.ROW_HEIGHT_LG};
  padding: 0 20px;
  cursor: pointer;

  &:nth-child(2n+1) {
    background: ${props => props.theme.subBg};
  }

  @media only screen and (max-width: ${Theme.BREAK_POINT_MD}) {
    height: ${Theme.ROW_HEIGHT_MD};
    font-size: ${Theme.FONT_SIZE_SM};
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
  color: ${props => props.active ? props.theme.orderTableTabActive : 'inherit' };
  &:hover {
    color: ${props => props.theme.orderTableTabActive};
  }
`

export default MarketsTableRenderer
