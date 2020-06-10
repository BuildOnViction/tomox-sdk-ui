import React from 'react'
import styled from 'styled-components'
import { Icon } from '@blueprintjs/core'
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { Theme } from '../Common'

export default function DappSidebar({ currentPair }) {
    if (!currentPair.pair) return null
    const pair = currentPair.pair.replace(' ', '_').replace('/', '-')
    
    return (
        <Wrapper>
            <MenuItem to={`/dapp/spot/${pair}`}>
                <i className="fa fa-home" aria-hidden="true"></i>
                <Typo><FormattedMessage id="dapp.menu.home" /></Typo>
            </MenuItem>
            <MenuItem to={`/dapp/trade/${pair}`}>
                <Icon icon="timeline-bar-chart" iconSize={20} /> 
                <Typo><FormattedMessage id="dapp.menu.trade" /></Typo>
            </MenuItem>
            <MenuItem to="/dapp/spot/fund">
                <i className="tomoicons-wallet"></i> 
                <Typo><FormattedMessage id="exchangePage.funds" /></Typo>
            </MenuItem>
            <MenuItem to="/dapp/spot/account">
                <Icon icon="user" iconSize={20} />
                <Typo><FormattedMessage id="dapp.menu.account" /></Typo>
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