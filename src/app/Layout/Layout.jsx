// @flow
import type { Node } from 'react'
import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { Icon, Switch } from '@blueprintjs/core'
import {
  Alignment,
  Menu,
  MenuDivider,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position,
  Tooltip,
} from '@blueprintjs/core'

import {
  NavbarDivider,
  Theme,
  DarkMode,
} from '../../components/Common'
import Notifier from '../../components/Notifier'
import TomoXLogo from '../../components/Common/TomoXLogo'
import TokenSearcher from '../../components/TokenSearcher'
import { formatNumber } from 'accounting-js'
import { pricePrecision, amountPrecision } from '../../config/tokens'
import { getChangePriceText, getChangePercentText } from '../../utils/helpers'

export type Props = {
  TomoBalance: string,
  WETHBalance: string,
  WETHAllowance: string,
  children?: Node,
  authenticated: boolean,
  accountLoading: boolean,
  address: string,
  locale: string,
  currentBlock?: string,
  createProvider?: () => {},
  changeLocale?: string => {},
}

export type State = {}

class Layout extends React.PureComponent<Props, State> {
  componentDidMount() {
    const { createProvider, queryAppData } = this.props

    queryAppData()
    if (createProvider) {
      createProvider()
    }
  }

  changeLocale = (e: Object) => {
    const locale = e.target.value.toLowerCase()
    this.props.changeLocale && this.props.changeLocale(locale)
  }

  isTradingPage = (pathname: string) => {
    return pathname.includes('/trade')
  }

  handleThemeChange = () => {

  }

  render() {
    const { 
      children, 
      authenticated, 
      address, 
      currentPair, 
      currentPairData,
      pathname, 
      referenceCurrency,
    } = this.props

    const menu = (
      <Menu>
        <MenuItem>
          <MenuItemLink to="/">Current Account: {address}</MenuItemLink>
        </MenuItem>
        <MenuDivider />
        <MenuItem>
          <MenuItemLink to="/logout" icon="log-out">
            Logout
          </MenuItemLink>
        </MenuItem>
      </Menu>
    )

    return (
      <Wrapper className={this.isTradingPage(pathname) ? "exchange-page" : ""}>
        <Notifier />
        <Header className="tm-header">
          <Navbar>
            <NavbarHeading className="logo">
              <TomoXLogo height={40} width={40} alt="TomoX Logo" />
            </NavbarHeading>

            <NavbarGroup align={Alignment.LEFT}>
            {this.isTradingPage(pathname) 
            && (
              <TokenInfo className="token-info">
                {currentPair && (
                  <TokenSearcherPopover
                    content={<TokenSearcher />}
                    position={Position.BOTTOM_LEFT}
                    minimal>
                    <TokenPaisDropDown>
                      <span>{currentPair.pair}</span> 
                      <i className="arrow"></i>
                    </TokenPaisDropDown>
                  </TokenSearcherPopover>
                )}

                <NavbarDivider />

                {currentPairData && 
                  (<TokenTick className="token-tick">
                    <div className="tick last-price">
                      <div className="title">Last Price</div>
                      <div>
                        <span>{formatNumber(currentPairData.last_trade_price, {precision: pricePrecision})}</span>
                        <span className="up">{referenceCurrency.symbol}{currentPairData.usd ? formatNumber(currentPairData.usd, {precision: 2}) : '_.__'}</span>
                      </div>
                    </div>

                    <div className="tick change">
                      <div className="title">24h Change</div>
                      <div className={ (currentPairData.ticks[0].close - currentPairData.ticks[0].open) >= 0 ? 'up' : 'down'}>
                        <span>{getChangePriceText(currentPairData.ticks[0].open, currentPairData.ticks[0].close, pricePrecision)}</span>
                        <span>{getChangePercentText(currentPairData.ticks[0].change)}</span>
                      </div>
                    </div>

                    <div className="tick high">
                      <div className="title">24h High</div>
                      <div className="up">
                        <span>{formatNumber(currentPairData.ticks[0].high, {precision: pricePrecision})}</span>
                      </div>
                    </div>

                    <div className="tick low">
                      <div className="title">24h Low</div>
                      <div className="down">
                        <span>{formatNumber(currentPairData.ticks[0].low, {precision: pricePrecision})}</span>
                      </div>
                    </div>

                    <div className="tick volume">
                      <div className="title">24h Volume</div>
                      <div>
                        <span>{formatNumber(currentPairData.ticks[0].volume, {precision: amountPrecision})}</span>
                      </div>
                    </div>
                  </TokenTick>)
                }
              </TokenInfo>
            )}
            </NavbarGroup>

            <NavbarGroup className="utilities-menu" align={Alignment.RIGHT}>
              <SupportItem className="utility-item support">
                  <i>support</i>
              </SupportItem>

              <NotificationItem className="utility-item notification">
                  <i>notification</i>
              </NotificationItem>

              <UserItem className="utility-item notification">
                {!authenticated ? (
                  <NavbarLink to="/login">
                    <span>Login</span>/<span>Register</span></NavbarLink>
                ) : (
                  <React.Fragment>
                    <Popover
                      content={menu}
                      position={Position.BOTTOM_RIGHT}
                      minimal
                    >
                      <Icon icon="user" iconSize={20} />
                    </Popover>
                  </React.Fragment>
                )}
              </UserItem>

              <LanguageItem className="utility-item language">
                <i>language</i>              

                <Popover
                  content={'todo: languages list'}
                  position={Position.BOTTOM_RIGHT}
                  minimal>
                  <div className="languages-dropdown">
                    <span>English</span> 
                    <span className="arrow"></span>
                  </div>
                </Popover>  
              </LanguageItem>
            </NavbarGroup>
          </Navbar>
        </Header>
        <MainContainer>
          <Sidebar className="sidebar"> 
            <NavLink className="sidebar-item markets-link" to="/markets">
              <SidebarItemBox>
                <Tooltip disabled={!this.isTradingPage(pathname)} 
                  portalClassName="sidebar-tooltip"
                  content="Markets" 
                  position={Position.RIGHT}
                  transitionDuration={0}>
                  <i></i> 
                </Tooltip>
                <SidebarItemTitle>Markets</SidebarItemTitle>
              </SidebarItemBox>
            </NavLink>  
            <NavLink className="sidebar-item exchange-link" to={`/trade/${currentPair.baseTokenSymbol}-${currentPair.quoteTokenSymbol}`}>
              <SidebarItemBox>
                <Tooltip disabled={!this.isTradingPage(pathname)} 
                  portalClassName="sidebar-tooltip"
                  content="Exchange" 
                  position={Position.RIGHT}
                  transitionDuration={0}>
                  <i></i> 
                </Tooltip>
                <SidebarItemTitle>Exchange</SidebarItemTitle>
              </SidebarItemBox>
            </NavLink>         
            <NavLink className="sidebar-item portfolio-link" to="/wallet">
              <SidebarItemBox>
                <Tooltip disabled={!this.isTradingPage(pathname)} 
                  portalClassName="sidebar-tooltip"
                  content="Portfolio" 
                  position={Position.RIGHT}
                  transitionDuration={0}>
                  <i></i> 
                </Tooltip> 
                <SidebarItemTitle>Portfolio</SidebarItemTitle>
              </SidebarItemBox>
              </NavLink>   

              <NavExternalLink target="_blank" href="https://docs.tomochain.com">
                <SidebarItemBox>
                  <Tooltip disabled={!this.isTradingPage(pathname)} 
                    portalClassName="sidebar-tooltip"
                    content="Docs/FAQ" 
                    position={Position.RIGHT}
                    transitionDuration={0}>
                    <i></i> 
                  </Tooltip> 
                  <SidebarItemTitle>Docs/FAQ</SidebarItemTitle>
                </SidebarItemBox>
              </NavExternalLink>
            <Switch className="switch-theme" checked={true} label="Dark mode" alignIndicator={Alignment.RIGHT} onChange={this.handleThemeChange} />
          </Sidebar>
          <MainContent className="main-content">{children}</MainContent>
        </MainContainer>
      </Wrapper>
    )
  }
}

export default Layout

const Wrapper = styled.div.attrs({ className: 'tm-theme tm-theme-dark' })`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.header``

const TokenSearcherPopover = styled(Popover)`
  width: 100px;
`

const TokenPaisDropDown = styled.div.attrs({
  className: 'tokens-dropdown',
})`
  color: ${DarkMode.LIGHT_GRAY};
  cursor: pointer;
`

const MainContainer = styled.div.attrs({
  className: 'main-container',
})`
  display: grid;
  grid-template-columns: 155px 1fr;
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const SidebarItemBox = styled.div.attrs({
  className: 'sidebar-item-box',
})`
  .bp3-popover-target {
    display: flex;
    align-items: center;
  }
`

const SidebarItemTitle = styled.span.attrs({
  className: 'sidebar-item-title',
})`
  height: 40px;
  padding-top: 1px;
`

const MainContent = styled.main`
  flex: 1;
  height: calc(100vh - ${Theme.HEADER_HEIGHT_LG});

  @media only screen and (max-width: 1280px) {
    height: calc(100vh - ${Theme.HEADER_HEIGHT_MD});
  }
`

const TokenInfo = styled.div`
  .arrow {
    transition: transform .5s ease;
  }

  .bp3-popover-open .arrow {
    transform: rotate(180deg);
  }
`

const TokenTick = styled.div``

const SupportItem = styled.div``

const NotificationItem = styled.div``

const LanguageItem = styled.div``

const UserItem = styled.div``

const NavbarLink = styled(NavLink).attrs({
  activeClassName: 'bp3-active bp3-intent-primary',
  className: 'bp3-button bp3-minimal',
  role: 'button',
})``

const NavExternalLink = styled.a.attrs({
  className: 'sidebar-item docs-faq-link',
})``

const MenuItem = styled.li``

const MenuItemLink = styled(NavLink).attrs({
  activeClassName: 'bp3-active bp3-intent-primary',
  className: props =>
    `bp3-menu-item bp3-popover-dismiss bp3-icon-${props.icon}`,
  role: 'button',
})``
