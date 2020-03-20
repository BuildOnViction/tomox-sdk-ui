import React from 'react'
import styled from 'styled-components'
import { MenuItem, Button, Position } from "@blueprintjs/core"
import { Select } from "@blueprintjs/select"
  
const filterFilm = (query, collateral) => {
    return collateral.symbol.toLowerCase().indexOf(query.toLowerCase()) >= 0
}
 
const renderCollateral = (collateral, { handleClick, modifiers }) => {
    if (!modifiers.matchesPredicate) {
        return null
    }
    
    return (
        <MenuItem
            active={modifiers.active}
            key={collateral.address}
            onClick={handleClick}
            text={collateral.symbol}
        />
    )
}

function SelectCollaterals(props) {
    const { activeItem, items, onItemSelect } = props

    if (!items) return <StyledButton text="Loading..." />

    return (
        <StyledSelect 
            itemPredicate={filterFilm} 
            itemRenderer={renderCollateral} 
            items={items} 
            onItemSelect={onItemSelect}
            filterable={false}
            popoverProps={{minimal: true, usePortal: false, position: Position.BOTTOM_RIGHT}}>

            <StyledButton 
                rightIcon="caret-down"
                text={activeItem ? activeItem.symbol : 'No collateral is selected'} />
        </StyledSelect>
    )
}

const StyledSelect = styled(Select)`
    &.bp3-popover-wrapper,
    .bp3-popover-target {
        display: block;
        width: 100%;
    }

    .bp3-menu {
        color: ${props => props.theme.selectColor};
        background-color: ${props => props.theme.selectBackground} !important;
    }
`

const StyledButton = styled(Button)`
    &.bp3-button {
        width: 40%;
        display: flex;
        justify-content: space-between;
        color: ${props => props.theme.selectSecondColor} !important;
        box-shadow: none !important;
        background-image: none !important;
        background-color: ${props => props.theme.selectBackground} !important;
    }
`

export default SelectCollaterals
