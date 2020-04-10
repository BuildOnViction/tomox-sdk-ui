import React from 'react'
import styled from "styled-components"
import { InputGroup } from "@blueprintjs/core"
import BigNumber from 'bignumber.js'

import { truncateZeroDecimal } from '../../../utils/helpers'
import { ButtonGroup, CancelButton, AcceptButton, Theme, TmColors } from '../../Common'
import Modal from '../../Modal'
import SelectCollaterals from '../../SelectCollaterals'

export default function TopUpModal({ 
    hash, 
    onTopUp,
    onClose,
    collaterals,
    collateralSelected,
    onCollateralSelect,
    onSelectCollateral,
    topUpAmount,
    onChangeAmount,
    error,
    selectAllAvailableBalance,
    ...rest 
}) {
    return (
        <Modal onClose={() => onClose(false)} {...rest}>
            <StyledInputGroup
                error={error}
                name="amount-collateral"
                type="number"
                onChange={e => onChangeAmount(e)}
                value={topUpAmount}
                autoComplete="off"
                rightElement={
                    <SelectCollaterals 
                        items={collaterals} 
                        activeItem={collateralSelected}
                        onItemSelect={onSelectCollateral} 
                    />
                }
            />
            <Row>
                <Title>Available:</Title>
                <Value onClick={selectAllAvailableBalance}>
                    {truncateZeroDecimal(BigNumber(collateralSelected.availableBalance).toFormat(8))} {collateralSelected.symbol}
                </Value>
            </Row>

            <ButtonGroup>
                <CancelButton
                    width="47%"
                    text="Cancel"
                    onClick={() => onClose(false)}
                />
                <AcceptButton
                    width="47%"
                    text="Top Up"
                    onClick={() => onTopUp(hash)} 
                />
            </ButtonGroup>
        </Modal>
    )
}

export const StyledInputGroup = styled(InputGroup).attrs({
        className: props => props.error ? 'bp3-fill has-error' : 'bp3-fil',
    })`
    margin-bottom: 10px;

    &.has-error .bp3-input {
        box-shadow: 0 0 0 1px ${TmColors.RED};
    }
  
    .bp3-input {
        height: unset;
        font-family: 'Ubuntu', sans-serif;
        font-size: ${Theme.FONT_SIZE_SM};
        padding-top: 5px !important;
        padding-bottom: 5px !important;
    
        &:focus {
            box-shadow: 0 0 0 1px ${TmColors.ORANGE} !important;
        }
    }

    .bp3-input-action {
        top: 50% !important;
        transform: translateY(-50%);
    }

    .bp3-button {
        width: 40% !important;
    }
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 35px;
`

const Title = styled.span``

const Value = styled.span`
    cursor: pointer;
    &:hover {
        color: ${props => props.theme.mainColorHover};
    }
`