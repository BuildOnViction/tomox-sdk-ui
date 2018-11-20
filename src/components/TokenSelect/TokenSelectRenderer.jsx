//@flow
import React from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import HighlightText from '../Common/HighlightText';

type Props = {
  items: Array<Object>,
  item: Object,
  onChange: (SyntheticEvent<>) => void
};

const TokenSelectRenderer = ({ item, items, onChange }: Props) => {
  return (
    <Select
      items={items}
      filterable={true}
      itemRenderer={renderItem}
      itemPredicate={filterItem}
      noResults={<MenuItem disabled text="No results." />}
      onItemSelect={onChange}
      popoverProps={{ minimal: true }}
    >
      <Button
        text={item ? `${item.symbol}` : '(No selection)'}
        righticonname="double-caret-vertical"
        fill={true}
        intent="primary"
      />
    </Select>
  );
};

const filterItem = (query, item) => {
  return `${item.symbol}`.indexOf(query.toUpperCase()) > -1;
};

const renderItem = (item, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  const text = `${item.rank}. ${item.symbol}`;
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={item.address}
      key={item.rank}
      onClick={handleClick}
      text={<HighlightText text={text} query={query} />}
    />
  );
};

export default TokenSelectRenderer;
