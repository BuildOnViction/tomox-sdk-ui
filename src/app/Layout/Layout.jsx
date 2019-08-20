// @flow
import type { Node } from 'react'
import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { NavLink } from 'react-router-dom'
import {
  Alignment,
  Menu,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position,
  Tooltip,
  Icon,
  Switch,
} from '@blueprintjs/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FormattedMessage } from 'react-intl'

import { locales } from '../../locales'
import {
  NavbarDivider,
  Theme,
  DarkMode,
  LightMode,
} from '../../components/Common'
import Notifier from '../../components/Notifier'
import Notifications from '../../components/Notifications'
import TomoXLogo from '../../components/Common/TomoXLogo'
import TokenSearcher from '../../components/TokenSearcher'
import { formatNumber } from 'accounting-js'
import { getChangePriceText, getChangePercentText } from '../../utils/helpers'
import globeGrayUrl from '../../assets/images/globe_icon_gray.svg'
import globeWhiteUrl from '../../assets/images/globe_icon_white.svg'
import arrowGrayUrl from '../../assets/images/arrow_down_gray.svg'

export type Props = {
  TomoBalance: string,
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

const theme = {
  dark: DarkMode,
  light: LightMode,
}

class Layout extends React.PureComponent<Props, State> {

  isCreateImportWalletPage = (pathname: string) => {
    return pathname.includes('/create') || pathname.includes('/unlock')
  }

  componentDidMount = () => {
    this.props.queryAppData()
  }

  componentWillUnmount = () => {
    this.props.releaseResource()
  }

  render() {
    const { pathname, mode } = this.props

    if (this.isCreateImportWalletPage(pathname)) {
      return (<CreateImportWallet {...this.props} />)
    }

    return (
      <ThemeProvider theme={theme[mode]}>
        <Default {...this.props} />
      </ThemeProvider>
    )
  }
}

class Default extends React.PureComponent<Props, State> {
  componentDidMount() {
    const { createProvider, authenticated, queryAccountData } = this.props

    if (createProvider) {
      createProvider()
    }

    if (authenticated) {
      queryAccountData()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.authenticated !== this.props.authenticated
      && this.props.authenticated) {
        this.props.queryAccountData()
    }
  }

  changeLocale = (e: Object) => {
    const locale = e.target.value.toLowerCase()
    this.props.changeLocale && this.props.changeLocale(locale)
  }

  isTradingPage = (pathname: string) => {
    return pathname.includes('/trade')
  }

  handleThemeChange = (e: Object) => {
    e.target.checked ? this.props.changeMode('dark') : this.props.changeMode('light')
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
      copyDataSuccess,
      locale,
      mode,
      changeLocale,
      newNotifications,
    } = this.props

    const menu = (
      <MenuWallet>
        <MenuItem>
          <MenuItemTitle>Wallet</MenuItemTitle>
          <AddressWalletBox>
            <AddressText>{address}</AddressText>

            <CopyToClipboard text={address} onCopy={copyDataSuccess}>
              <IconBox title="Coppy Address">              
                <Icon icon="applications" />              
              </IconBox>
            </CopyToClipboard>

            <IconBox title="Go to Tomoscan">
              <a target="_blank" rel="noreferrer noopener" href={`https://scan.tomochain.com/address/${address}`}><Icon icon="document-share" /></a>
            </IconBox>
          </AddressWalletBox>
        </MenuItem>

        <MenuItem>
          <MenuItemLink to="/logout">
            Close Wallet
          </MenuItemLink>
        </MenuItem>
      </MenuWallet>
    )

    return (
      <Wrapper mode={mode} className={this.isTradingPage(pathname) ? "exchange-page" : ""}>
        <Notifier />
        <Header>
          <Navbar>
            <MainLogoWrapper>
              <TomoXLogo height={40} width={40} alt="TomoX Logo" />
            </MainLogoWrapper>

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
                  (<TokenTick>
                    <div className="tick last-price">
                      <div className="title"><FormattedMessage id="priceBoard.lastPrice" /></div>
                      <div>
                        <span>{formatNumber(currentPairData.last_trade_price, {precision: 2})}</span>
                        <span className="up">{referenceCurrency.symbol}{currentPairData.usd ? formatNumber(currentPairData.usd, {precision: 2}) : '_.__'}</span>
                      </div>
                    </div>

                    <div className="tick change">
                      <div className="title"><FormattedMessage id="priceBoard.24hChange" /></div>
                      <div className={ (currentPairData.ticks[0].close - currentPairData.ticks[0].open) >= 0 ? 'up' : 'down'}>
                        <span>{getChangePriceText(currentPairData.ticks[0].open, currentPairData.ticks[0].close, 2)}</span>
                        <span>{getChangePercentText(currentPairData.ticks[0].change)}</span>
                      </div>
                    </div>

                    <div className="tick high">
                      <div className="title"><FormattedMessage id="priceBoard.24hHigh" /></div>
                      <div className="up">
                        <span>{formatNumber(currentPairData.ticks[0].high, {precision: 2})}</span>
                      </div>
                    </div>

                    <div className="tick low">
                      <div className="title"><FormattedMessage id="priceBoard.24hLow" /></div>
                      <div className="down">
                        <span>{formatNumber(currentPairData.ticks[0].low, {precision: 2})}</span>
                      </div>
                    </div>

                    <div className="tick volume">
                      <div className="title"><FormattedMessage id="priceBoard.24hVolume" /></div>
                      <div>
                        <span>{formatNumber(currentPairData.ticks[0].volume, {precision: 2})}</span>
                      </div>
                    </div>
                  </TokenTick>)
                }
              </TokenInfo>
            )}
            </NavbarGroup>

            <NavbarGroup className="utilities-menu" align={Alignment.RIGHT}>
              <SupportItem className="utility-item support">
                <a href="https://docs.tomochain.com/" target="_blank" rel="noopener noreferrer">
                  <i>support</i>
                </a>
              </SupportItem>

              <NotificationItem>
                {
                  (newNotifications.length > 0) && (<NumberNewNotifications />)
                } 
                <Popover
                  content={<Notifications />}
                  position={Position.BOTTOM_RIGHT}
                  minimal
                >
                  <i>notification</i>                 
                </Popover>
              </NotificationItem>

              <UserItem className="utility-item notification">
                {!authenticated ? (
                  <NavbarLink to="/unlock">
                    <WalletIconBox title="Unlock your wallet"></WalletIconBox>
                  </NavbarLink>
                ) : (
                  <React.Fragment>
                    <Popover
                      content={menu}
                      position={Position.BOTTOM_RIGHT}
                      minimal
                    >
                      <UserIcon icon="user" iconSize={20} />
                    </Popover>
                  </React.Fragment>
                )}
              </UserItem>

              <LanguageItem className="utility-item language">
                <i>language</i>              

                <Popover
                  content={<MenuLocales locale={locale} changeLocale={changeLocale} />}
                  position={Position.BOTTOM_RIGHT}
                  minimal>
                  <div className="languages-dropdown">
                    <span>{locales[locale]}</span> 
                    <span className="arrow"></span>
                  </div>
                </Popover>  
              </LanguageItem>
            </NavbarGroup>
          </Navbar>
        </Header>
        <MainContainer>
          <Sidebar className="sidebar"> 
            <MarketsLink to="/markets">
              <SidebarItemBox>
                <Tooltip disabled={!this.isTradingPage(pathname)} 
                  portalClassName="sidebar-tooltip"
                  content="Markets" 
                  position={Position.RIGHT}
                  transitionDuration={0}>
                  <i></i> 
                </Tooltip>
                <SidebarItemTitle><FormattedMessage id="mainMenuPage.markets" /></SidebarItemTitle>
              </SidebarItemBox>
            </MarketsLink>

            <ExchangeLink to={`/trade/${currentPair.baseTokenSymbol}-${currentPair.quoteTokenSymbol}`}>
              <SidebarItemBox>
                <Tooltip disabled={!this.isTradingPage(pathname)} 
                  portalClassName="sidebar-tooltip"
                  content="Exchange" 
                  position={Position.RIGHT}
                  transitionDuration={0}>
                  <i></i> 
                </Tooltip>
                <SidebarItemTitle><FormattedMessage id="mainMenuPage.exchange" /></SidebarItemTitle>
              </SidebarItemBox>
            </ExchangeLink> 

            <PortfolioLink to="/wallet">
              <SidebarItemBox>
                <Tooltip disabled={!this.isTradingPage(pathname)} 
                  portalClassName="sidebar-tooltip"
                  content="Portfolio" 
                  position={Position.RIGHT}
                  transitionDuration={0}>
                  <i></i> 
                </Tooltip> 
                <SidebarItemTitle><FormattedMessage id="mainMenuPage.portfolio" /></SidebarItemTitle>
              </SidebarItemBox>
            </PortfolioLink>   

            <NavExternalLink target="_blank" href="https://docs.tomochain.com">
              <SidebarItemBox>
                <Tooltip disabled={!this.isTradingPage(pathname)} 
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
              onChange={this.handleThemeChange} />
          </Sidebar>
          <MainContent className="main-content">{children}</MainContent>
        </MainContainer>
      </Wrapper>
    )
  }
}

class CreateImportWallet extends React.PureComponent<Props, State> {
  componentDidMount() {
    const { createProvider } = this.props

    if (createProvider) {
      createProvider()
    }
  }

  render() {
    const { 
      children, 
      locale,
      changeLocale,
    } = this.props

    return (
      <CreateImportWrapper>
        <Notifier />
        <CreateImportHeader>
          <Navbar>
            <LogoWrapper>
              <TomoXLogo height={40} width={40} alt="TomoX Logo" />
            </LogoWrapper>

            <NavbarGroup className="utilities-menu" align={Alignment.RIGHT}>
              <PageLink to="/markets"><FormattedMessage id="mainMenuPage.markets" /></PageLink>

              <PageLink to="/trade"><FormattedMessage id="mainMenuPage.exchange" /></PageLink>

              <LanguageItem className="utility-item language">
                <i>language</i>              

                <Popover
                  content={<MenuLocales locale={locale} changeLocale={changeLocale} />}
                  position={Position.BOTTOM_RIGHT}
                  minimal>
                  <div className="languages-dropdown">
                    <span>{locales[locale]}</span> 
                    <span className="arrow"></span>
                  </div>
                </Popover>  
              </LanguageItem>
            </NavbarGroup>
          </Navbar>
        </CreateImportHeader>

        <CreateImportMain>{children}</CreateImportMain>
      </CreateImportWrapper>
    )
  }
}

const MenuLocales = (props) => {
  const { changeLocale, locale } = props

  return (
    <LocaleList>
      <LocaleItem active={locale === "en"} onClick={() => changeLocale("en")}>{locales["en"]} {(locale === "en") && (<Icon icon="tick" color={DarkMode.ORANGE} />)}</LocaleItem>
      <LocaleItem active={(locale === "vi")} onClick={() => changeLocale("vi")}>{locales["vi"]} {(locale === "vi") && (<Icon icon="tick" color={DarkMode.ORANGE} />)}</LocaleItem>
    </LocaleList>
  )
}

export default Layout

const Wrapper = styled.div.attrs({ 
  className: props => `tm-theme tm-theme-${props.mode}`,
})`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.mainBg};
`

const CreateImportWrapper = styled(Wrapper)``

const Header = styled.header.attrs({
  className: 'tm-header',
})``

const CreateImportHeader = styled.header`
  position: relative;
  .utilities-menu {
    padding-right: 20px;
    .utility-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-right: 40px;
      &:last-child {
        margin-right: 0;
      }
      i {
        display: inline-block;
        width: 20px;
        height: 20px;
        font-size: 0;
      }
    }

    .language {
      i {
        margin-right: 7px;
        background: url(${globeGrayUrl}) no-repeat center center;
      }
      &:hover {
        color: $tm_white;
        i {
          background: url(${globeWhiteUrl}) no-repeat center center;
        }
      }
      .arrow {
        display: inline-block;
        width: 10px;
        height: 5px;
        margin-left: 10px;
        background: url(${arrowGrayUrl}) no-repeat center center;
      }
    }
  }
`

const CreateImportMain = styled.div``

const MainLogoWrapper = styled(NavbarHeading).attrs({
  className: 'logo',
})``

const LogoWrapper = styled(NavbarHeading)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: ${Theme.HEADER_HEIGHT_LG};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
`

const TokenSearcherPopover = styled(Popover)`
  width: 100px;
`

const TokenPaisDropDown = styled.div.attrs({
  className: 'tokens-dropdown',
})`
  color: ${props => props.theme.labelTokensDropdown};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.labelTokensDropdownHover}
  }
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
  className: 'markets-link',
})``

const ExchangeLink = styled(SidebarItem).attrs({
  className: 'exchange-link',
})``

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

const TokenTick = styled.div.attrs({ className: 'token-tick' })`
  color: ${props => props.theme.textSmallChart};

  .title {
    color: $tm-gray;
  }
`

const SupportItem = styled.div`
  a {
    display: inline-block;
    font-size: 0;
  }
`

const NotificationItem = styled.div.attrs({
  className: 'utility-item notification',
})`
  position: relative;
  .bp3-popover-wrapper,
  .bp3-popover-target {
    font-size: 0;
  }
`

const NumberNewNotifications = styled.span`
  position: absolute;
  height: 7px;
  width: 7px;
  top: 0px;
  left: 0px;
  color: ${DarkMode.WHITE};
  font-size: 12px;
  border-radius: 5px;
  background-color: ${DarkMode.RED};
`

const LanguageItem = styled.div``

const UserItem = styled.div``

const NavbarLink = styled(NavLink)`
  color: ${DarkMode.GRAY};

  &:hover {
    color: ${DarkMode.WHITE};
  }
`

const PageLink = styled(NavbarLink)`
  margin-right: 35px;
`

const NavExternalLink = styled.a.attrs({
  className: 'sidebar-item docs-faq-link',
})`
  padding: 30px 0 30px 2px;

  &:hover .sidebar-item-box {
    color: ${props => props.theme.activeLink};
  }
`

const MenuWallet = styled(Menu)`
  width: 320px;
  color: ${props => props.theme.menuColor};
  background-color: ${props => props.theme.menuBg};
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, .5);
  overflow: hidden;
  margin-top: 10px;
`

const MenuItemTitle = styled.div`
  margin-bottom: 3px;
  color: ${props => props.theme.menuColor};
`

const AddressWalletBox = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const AddressText = styled.span`
  display: inline-block;
  width: 78%;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
`

const IconBox = styled.span`
  display: inline-block;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.menuBg};
  }

  a {
    color: ${props => props.theme.menuColor}; 
  }
`

const MenuItem = styled.li`
  padding: 10px 15px;

  &:first-child {
    background-color: ${props => props.theme.menuBgHover};
  }

  &:not(:first-child):hover {
    background-color: ${props => props.theme.menuBgHover};
  }
`

const MenuItemLink = styled(NavLink)`
  display: block;
  color: ${props => props.theme.menuColor}; 
  &:hover {
    color: ${props => props.theme.menuColorHover};
  }
`

const LocaleList = styled(MenuWallet)`
  width: 100px;
`
const LocaleItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  cursor: pointer;
  color: ${props => props.active ? props.theme.active : props.theme.menuColor};
  background-color: ${props => props.active ? props.theme.menuBgHover : props.theme.menuBg};

  &:hover {
    color: ${props => props.theme.menuColorHover};
    background-color: ${props => props.theme.menuBgHover};
  }
`

const WalletIconBox = styled.span.attrs({
  className: 'unlock-wallet',
})`
  display: inline-flex;
  margin-top: 2px;
  width: 20px;
  height: 20px;
`

const SwitchTheme = styled(Switch)`
  color: #9ca4ba;
  padding-left: 20px;
  margin-top: auto;
  margin-bottom: 30px;

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

const UserIcon = styled(Icon)`
  color: ${props => props.theme.icon};

  &:hover {
    color: ${props => props.theme.iconHover};
  }
`
