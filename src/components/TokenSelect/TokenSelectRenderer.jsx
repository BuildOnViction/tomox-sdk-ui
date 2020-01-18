//@flow
import React from 'react'
import styled from 'styled-components'
import { Button, MenuItem } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import HighlightText from '../Common/HighlightText'

type Props = {
  items: Array<Object>,
  item: Object,
  onChange: (SyntheticEvent<>) => void
}

const TokenSelectRenderer = ({ item, items, onChange }: Props) => {
  return (
    <StyledSelect
      items={items}
      filterable={true}
      itemRenderer={renderItem}
      itemPredicate={filterItem}
      noResults={<MenuItem disabled text="No results." />}
      onItemSelect={onChange}
      popoverProps={{ minimal: true, usePortal: false }}
    >
      <StyledButton
        text={item ? `${item.symbol}` : '(No selection)'}
        rightIcon="caret-down"
        fill={true}
      />
    </StyledSelect>
  )
}

const filterItem = (query, item) => {
  return `${item.symbol}`.indexOf(query.toUpperCase()) > -1
}

const renderItem = (item, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
    return null
  }
  const text = `${item.rank}. ${item.symbol}`
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={item.address}
      key={item.rank}
      onClick={handleClick}
      text={<HighlightText text={text} query={query} />}
    />
  )
}

const StyledButton = styled(Button)`
  height: 40px;
  background: ${props => props.theme.subBg} !important;
  box-shadow: none !important;
`

const StyledSelect = styled(Select)`
  .bp3-popover-content,
  li {
    background: ${props => props.theme.inputBackground} !important;
  }
`

export default TokenSelectRenderer
