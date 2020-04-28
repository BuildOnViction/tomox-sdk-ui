import React from 'react'
import styled from 'styled-components'
import { Icon } from '@blueprintjs/core'
import { NavLink } from 'react-router-dom'

import { Theme } from '../../Common'

export default function DappLendingSidebar({ currentPair }) {
    if (!currentPair.pair) return null
    const pair = currentPair.pair.replace(' ', '_').replace('/', '-')
    
    return (
        <Wrapper>
            <MenuItem to={`/dapp/lending/${pair}`}>
                <Icon icon="timeline-bar-chart" iconSize={20} />
                <Typo>Home</Typo>
            </MenuItem>
            <MenuItem to={`/dapp/lending/trade/${pair}`}>
                <i class="tomoicons-lending"></i> 
                <Typo>Lending</Typo>
            </MenuItem>
            <MenuItem to="/dapp/fund">
                <i class="tomoicons-wallet"></i> 
                <Typo>Fund</Typo>
            </MenuItem>
            <MenuItem to="/dapp/account">
                <Icon icon="user" iconSize={20} />
                <Typo>Account</Typo>
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

const MenuItem = styled(NavLink)`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #6e7793;
    font-size: ${Theme.FONT_SIZE_XS};

    &.active,
    &.active i::before {
        color: #fff;
    }

    i {
        font-size: 20px;
    }
`

const Typo = styled.div``