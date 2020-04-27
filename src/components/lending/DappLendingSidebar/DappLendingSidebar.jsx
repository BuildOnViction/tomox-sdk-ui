import React from 'react'
import styled from 'styled-components'
import { Icon } from '@blueprintjs/core'
import { NavLink } from 'react-router-dom'

import { Theme, UtilityIcon } from '../../Common'

export default function DappLendingSidebar({ currentPair }) {
    if (!currentPair) return null
    const pair = currentPair.pair.replace(' ', '_').replace('/', '-')
    
    return (
        <Wrapper>
            <MenuItem>
                <Icon icon="timeline-bar-chart" iconSize={20} />
                <NavLink to={`/dapp/lending/${pair}`}>Home</NavLink>
            </MenuItem>
            <MenuItem>
                <UtilityIcon name="lending" color="#6E7793" /> 
                <NavLink to={`/dapp/lending/trade/${pair}`}>Lending</NavLink>
            </MenuItem>
            <MenuItem>
                <UtilityIcon name="wallet" /> 
                <NavLink to="/dapp/fund">Fund</NavLink>
            </MenuItem>
            <MenuItem>
                <Icon icon="user" iconSize={20} />
                <NavLink to="/dapp/account">Account</NavLink>
            </MenuItem>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    height: 50px;
    background-color: #2d3650;
    display: flex;
    align-items: center;
    justify-content: space-around;
    z-index: 20;
    padding: 0 5px;
`

const MenuItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: ${Theme.FONT_SIZE_XS};
`