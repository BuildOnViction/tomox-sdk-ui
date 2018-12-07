// @flow
import type { Node } from 'react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Link, NavLink } from 'react-router-dom';
import { SvgIcon, Footer, Indent } from '../../components/Common';
import Notifier from '../../components/Notifier';
import ConnectionStatus from '../../components/ConnectionStatus';
import styled from 'styled-components';
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
  Tag
} from '@blueprintjs/core';

export type Props = {
  ETHBalance: string,
  WETHBalance: string,
  WETHAllowance: string,
  children?: Node,
  authenticated: boolean,
  accountLoading: boolean,
  address: string,
  locale: string,
  messages: { [id: string]: string },
  currentBlock?: string,
  createProvider?: () => {}
};

export type State = {};

class Layout extends React.PureComponent<Props, State> {
  componentDidMount() {
    if (this.props.createProvider) {
      this.props.createProvider();
    }
  }
  render() {
    const {
      children,
      authenticated,
      address,
      locale,
      messages,
      currentBlock
    } = this.props;
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
    );

    return (
      <IntlProvider locale={locale} messages={messages}>
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
                      target="_blank"
                    >
                      {currentBlock}
                    </a>
                  </Block>
                )}

                {/* <ProviderStatus>
                  <SvgIcon
                    style={{ marginRight: '10px' }}
                    width="20px"
                    icon="connect-signal"
                    intent={authenticated ? 'success' : 'error'}
                  />
                  <p>{authenticated ? 'Connected' : 'Not Connected'}</p>
                </ProviderStatus> */}

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
              </NavbarGroup>
            </Navbar>
          </Header>
          <MainContent>{children}</MainContent>
          <Footer />
        </Wrapper>
      </IntlProvider>
    );
  }
}

export default Layout;

const Wrapper = styled.div.attrs({ className: 'bp3-dark' })`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header``;

const MainContent = styled.main`
  flex: 1;
`;

const ProviderStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 50px;
  & p {
    margin: 0;
  }
`;

const Block = styled.div`
  word-wrap: break-word;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 20px;
  & span {
    margin-right: 5px;
  }
`;

const NavbarHeaderLink = styled(Link).attrs({
  className: 'bp3-button bp3-minimal bp3-intent-primary',
  role: 'button'
})``;

const NavbarLink = styled(NavLink).attrs({
  activeClassName: 'bp3-active bp3-intent-primary',
  className: 'bp3-button bp3-minimal',
  role: 'button'
})``;

const MenuItem = styled.li``;

const MenuItemLink = styled(NavLink).attrs({
  activeClassName: 'bp3-active bp3-intent-primary',
  className: props =>
    `bp3-menu-item bp3-popover-dismiss bp3-icon-${props.icon}`,
  role: 'button'
})``;
