// @flow
import type { Node } from 'react'
import React from 'react'
import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'
import { HTMLSelect, Icon } from '@blueprintjs/core'
import {
  Alignment,
  Button,
  Menu,
  MenuDivider,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position,
  Tag,
} from '@blueprintjs/core'

import { Footer, Indent } from '../../components/Common'
import Notifier from '../../components/Notifier'
import ConnectionStatus from '../../components/ConnectionStatus'
import { locales } from '../../locale'

export type Props = {
  ETHBalance: string,
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

  render() {
    const { children, authenticated, address, currentBlock } = this.props
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
        <Header>
          <Navbar>
            <NavbarGroup align={Alignment.LEFT}>
              <NavbarHeading>
                <NavbarHeaderLink to="/">Tomochain</NavbarHeaderLink>
                <Indent />
                <Tag minimal intent="success">
                  BETA
                </Tag>
              </NavbarHeading>
              {authenticated && (
                <React.Fragment>
                  <NavbarDivider />
                  {/* <NavbarDivider /> */}
                  <NavbarLink to="/wallet">Wallet</NavbarLink>
                  <NavbarLink to="/trade">Exchange</NavbarLink>
                  <NavbarLink to="/settings">Settings</NavbarLink>
                  <NavbarDivider />
                </React.Fragment>
              )}
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
              
              <Icon icon="globe"/>
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
        <MainContent>{children}</MainContent>
        <Footer />
      </Wrapper>
    )
  }
}

export default Layout

const Wrapper = styled.div.attrs({ className: 'bp3-dark' })`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.header``

const MainContent = styled.main`
  flex: 1;
`

// const ProviderStatus = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-right: 50px;
//   & p {
//     margin: 0;
//   }
// `;

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

const NavbarHeaderLink = styled(Link).attrs({
  className: 'bp3-button bp3-minimal bp3-intent-primary',
  role: 'button',
})``

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
