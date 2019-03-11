// @flow
import type { Node } from 'react'
import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { HTMLSelect, Icon, Switch } from '@blueprintjs/core'
import {
  Alignment,
  Button,
  Menu,
  MenuDivider,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position,
  Tag,
} from '@blueprintjs/core'

import {
  NavbarDivider,
} from '../../components/Common'

import { Indent } from '../../components/Common'
import {
  Devices,
} from '../../components/Common/Variables'
import Notifier from '../../components/Notifier'
import ConnectionStatus from '../../components/ConnectionStatus'
import locales from '../../config/locales'
import { REACT_APP_DEX_VERSION } from '../../config/environment'
import TomoXLogo from '../../components/Common/TomoXLogo'
import TokenSearcher from '../../components/TokenSearcher'

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
    if (this.props.createProvider) {
      this.props.createProvider()
    }
  }

  changeLocale = (e: Object) => {
    const locale = e.target.value.toLowerCase()
    this.props.changeLocale && this.props.changeLocale(locale)
  }

  handleThemeChange = () => {

  }

  render() {
    const { children, authenticated, address, currentBlock, currentPair } = this.props

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
      <Wrapper>
        <Notifier />
        <Header className="tm-header">
          <Navbar>
            <NavbarGroup align={Alignment.LEFT}>
              <NavbarHeading>
                <TomoXLogo height={40} width={40} alt="TomoX Logo" />
              </NavbarHeading>

              <TokenInfo className="token-info">
                {currentPair && (
                  <Popover
                    content={<TokenSearcher />}
                    position={Position.BOTTOM_LEFT}
                    minimal>
                    <div className="tokens-dropdown">
                      <span>{currentPair.pair}</span> 
                      <i className="arrow"></i>
                    </div>
                  </Popover>
                )}

                <NavbarDivider />

                <TokenTick className="token-tick">
                  <div className="tick last-price">
                    <div className="title">Last Price</div>
                    <div>
                      <span>0.00382726</span>
                      <span className="up">$0.40</span>
                    </div>
                  </div>

                  <div className="tick change">
                    <div className="title">24h Change</div>
                    <div className="down">
                      <span>-0.00002726</span>
                      <span>-6.33%</span>
                    </div>
                  </div>

                  <div className="tick high">
                    <div className="title">24h High</div>
                    <div className="up">
                      <span>0.00382783</span>
                    </div>
                  </div>

                  <div className="tick low">
                    <div className="title">24h Low</div>
                    <div className="down">
                      <span>0.00382783</span>
                    </div>
                  </div>

                  <div className="tick volume">
                    <div className="title">24h Volume</div>
                    <div>
                      <span>247.382783</span>
                    </div>
                  </div>
                </TokenTick>
              </TokenInfo>
            </NavbarGroup>

            <NavbarGroup align={Alignment.RIGHT}>
              {currentBlock && (
                <Block>
                  <span>Current Block: </span>
                  <a
                    href={
                      'https://scan.testnet.tomochain.com/blocks/' +
                      currentBlock
                    }
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {currentBlock}
                  </a>
                </Block>
              )}

              {!authenticated ? (
                <NavbarLink to="/login">Login</NavbarLink>
              ) : (
                <React.Fragment>
                  <ConnectionStatus />
                  <Popover
                    content={menu}
                    position={Position.BOTTOM_RIGHT}
                    minimal
                  >
                    <Button icon="key" text={address} />
                  </Popover>
                </React.Fragment>
              )}

              <Navbar.Divider />

              <Icon icon="globe" />
              <HTMLSelect
                large
                minimal
                onChange={this.changeLocale}
                value={this.props.locale}
              >
                {locales.map(locale => {
                  return (
                    <option key={locale.value} value={locale.value}>
                      {locale.label}
                    </option>
                  )
                })}
              </HTMLSelect>
            </NavbarGroup>
          </Navbar>
        </Header>
        <MainContainer>
          <MenuBar className="sidebar"> 
            <NavLink className="sidebar-item markets-link" to="/markets"><span><i></i> Markets</span></NavLink>  
            <NavLink className="sidebar-item exchange-link" to="/trade"><span><i></i> Exchange</span></NavLink>         
            <NavLink className="sidebar-item portfolio-link" to="/wallet"><span><i></i> Portfolio</span></NavLink>                      
            <NavLink className="sidebar-item docs-faq-link" to="/settings"><span><i></i> Docs/FAQ</span></NavLink>
            {/* <NavLink className="sidebar-item" to="/settings">Settings</NavLink> */}
            <Switch className="switch-theme" checked={true} label="Dark mode" alignIndicator={Alignment.RIGHT} onChange={this.handleThemeChange} />
          </MenuBar>
          <MainContent>{children}</MainContent>
        </MainContainer>
      </Wrapper>
    )
  }
}

export default Layout

const Wrapper = styled.div.attrs({ className: 'tm-theme-dark' })`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.header``

const DexVersion = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
`

const MainContainer = styled.main`
  display: grid;
  grid-template-columns: 11% auto;
`

const MenuBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const MainContent = styled.main`
  flex: 1;
`

const TokenInfo = styled.div``

const TokenTick = styled.div``

const Block = styled.div`
  word-wrap: break-word;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 20px;
  & span {
    margin-right: 5px;
  }
`

const NavbarLink = styled(NavLink).attrs({
  activeClassName: 'bp3-active bp3-intent-primary',
  className: 'bp3-button bp3-minimal',
  role: 'button',
})``

const MenuItem = styled.li``

const MenuItemLink = styled(NavLink).attrs({
  activeClassName: 'bp3-active bp3-intent-primary',
  className: props =>
    `bp3-menu-item bp3-popover-dismiss bp3-icon-${props.icon}`,
  role: 'button',
})``
