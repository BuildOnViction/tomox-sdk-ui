import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import {
  Alignment,
  Position,
  Tooltip,
  Switch,
} from '@blueprintjs/core'

import { DEX_DOCS_URL } from '../../config/environment'
import { UtilityIcon } from '../../components/Common'

export default function Sidebar ({ disabled, mode, onChangeTheme }) {
  return (
    <Wrapper> 
      <MarketsLink to="/markets/trading">
        <SidebarItemBox>
          <Tooltip disabled={disabled} 
            portalClassName="sidebar-tooltip"
            content={<FormattedMessage id="mainMenuPage.spot" />} 
            position={Position.RIGHT}
            transitionDuration={0}>
            <i></i> 
          </Tooltip>
          <SidebarItemTitle><FormattedMessage id="mainMenuPage.spot" /></SidebarItemTitle>
        </SidebarItemBox>
      </MarketsLink>

      {/* <LendingMarketsLink mode={mode} to="/markets/lending">
        <SidebarItemBox>
          <Tooltip disabled={disabled} 
            portalClassName="sidebar-tooltip"
            content={<FormattedMessage id="mainMenuPage.lending" />} 
            position={Position.RIGHT}
            transitionDuration={0}>
            <UtilityIcon name="lending" />
          </Tooltip>
          <SidebarItemTitle><FormattedMessage id="mainMenuPage.lending" /></SidebarItemTitle>
        </SidebarItemBox>
      </LendingMarketsLink> */}

      <PortfolioLink to="/wallet">
        <SidebarItemBox>
          <Tooltip disabled={disabled} 
            portalClassName="sidebar-tooltip"
            content="Portfolio" 
            position={Position.RIGHT}
            transitionDuration={0}>
            <i></i> 
          </Tooltip> 
          <SidebarItemTitle><FormattedMessage id="mainMenuPage.portfolio" /></SidebarItemTitle>
        </SidebarItemBox>
      </PortfolioLink>   

      <NavExternalLink target="_blank" href={DEX_DOCS_URL}>
        <SidebarItemBox>
          <Tooltip disabled={disabled} 
            portalClassName="sidebar-tooltip"
            content="Docs/FAQ" 
            position={Position.RIGHT}
            transitionDuration={0}>
            <i></i> 
          </Tooltip> 
          <SidebarItemTitle><FormattedMessage id="mainMenuPage.docsFaq" /></SidebarItemTitle>
        </SidebarItemBox>
      </NavExternalLink>
      
      <SwitchTheme 
        checked={(mode === 'dark')} 
        label={(mode === "dark") ? "Dark mode" : "Light mode"} 
        alignIndicator={Alignment.RIGHT} 
        onChange={onChangeTheme} />
    </Wrapper>
  )
}

const Wrapper = styled.div.attrs({
  className: 'sidebar xs-hidden',
})`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const SidebarItem = styled(NavLink).attrs({
  className: 'sidebar-item',
})`
  padding: 30px 0 30px 2px;

  &.active .sidebar-item-box,
  &:hover .sidebar-item-box {
    color: ${props => props.theme.activeLink};
    box-shadow: -2px 0 0 0 ${props => props.theme.active};
  }
`

const MarketsLink = styled(SidebarItem).attrs({
  className: 'exchange-link',
})``

const LendingMarketsLink = styled(SidebarItem).attrs({
  className: 'markets-link',
})`
  svg {
    margin-right: 10px;
  }

  &:hover svg path,
  &.active svg path {
    fill: ${props => props.mode === 'dark' ? '#fff' : '#040404'};
  }
`

const PortfolioLink = styled(SidebarItem).attrs({
  className: 'portfolio-link',
})``

const SidebarItemBox = styled.div.attrs({
  className: 'sidebar-item-box',
})`
  .bp3-popover-target {
    display: flex;
    align-items: center;
  }

  color: ${props => props.theme.link};
  display: flex;
  height: 40px;
  line-height: 40px;
  padding-left: 18px;
  align-items: center;

  i {
    display: inline-block;
    height: 23px;
    width: 20px;
    margin-right: 10px;
  }
`

const SidebarItemTitle = styled.span.attrs({
  className: 'sidebar-item-title',
})`
  height: 40px;
  padding-top: 1px;
`

const NavExternalLink = styled.a.attrs({
  className: 'sidebar-item docs-faq-link',
})`
  padding: 30px 0 30px 2px;

  &:hover .sidebar-item-box {
    color: ${props => props.theme.activeLink};
    box-shadow: -2px 0 0 0 ${props => props.theme.active};
  }
`

const SwitchTheme = styled(Switch)`
  &.bp3-control.bp3-switch {
    color: #9ca4ba;
    padding-left: 20px;
    margin-top: auto;
    margin-bottom: 30px;
  }

  .bp3-control-indicator {
    width: 24px;
    height: 16px;
    background: transparent !important;
    border: 1px solid #9ca4ba !important;
    margin-top: 3px;
    &::before {
      top: -1px;
      width: 10px;
      height: 10px;
      background-color: #ff9a4d !important;
    }
  }

  input:checked ~ .bp3-control-indicator::before {
    left: calc(100% - 13px)
  }

  @media (max-width: 2560px) {
    width: 100%;
    font-size: 0;

    .bp3-control-indicator {
      float: none !important;
      margin-right: 0 !important;
      margin-left: -4px !important;
    }
  }
`