//@flow
import React from 'react'
import styled from 'styled-components'
import { Button, MenuItem, PopoverPosition } from '@blueprintjs/core'
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
      noResults={<StyledMenuItem disabled text="No results." />}
      onItemSelect={onChange}
      popoverProps={{ minimal: true, usePortal: false, position: PopoverPosition.BOTTOM }}
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
    <StyledMenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={item.availableBalance}
      key={item.rank}
      onClick={handleClick}
      title={item.address}
      text={<HighlightText text={text} query={query} />}
    />
  )
}

const StyledButton = styled(Button)`
  height: 40px;
  background: ${props => props.theme.inputBackground} !important;
  box-shadow: none !important;
`

const StyledSelect = styled(Select)`
  .bp3-popover-content {
    background: ${props => props.theme.inputBackground} !important;
    width: 450px;
  }

  .bp3-input-group input {
    height: 40px;
    background: ${props => props.theme.inputBackground2} !important;
    border: 1px solid ${props => props.theme.selectTokenSearchBorder};
  }

  .bp3-input-group > .bp3-icon:first-child {
    margin: 12px 7px !important;
  }

  .bp3-input-action .bp3-button {
    margin: 8px;
  }

  .bp3-menu {
    max-height: 320px;
    overflow: auto;
    background: ${props => props.theme.inputBackground} !important;
  }
`

const StyledMenuItem = styled(MenuItem)`
  border-radius: 0 !important;
  align-items: center !important;
  height: 35px;
  background: ${props => props.theme.inputBackground} !important;

  &:hover {
    background: ${props => props.theme.inputBackground2} !important;
  }

  &.bp3-menu-item.bp3-disabled {
    background-color: ${props => props.theme.inputBackground} !important;
  }

  &.bp3-menu-item > .bp3-fill {
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
    width: 100px;
    margin-right: 0
    padding-right: 5px;
    color: ${props => props.theme.inputColor} !important;
  }

  .bp3-menu-item-label {
    font-family: 'monospace', san-serif;
    color: ${props => props.theme.inputColor} !important;
    width: calc(100% - 100px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
  }
`

export default TokenSelectRenderer
