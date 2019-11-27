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
import BigNumber from 'bignumber.js'
import { Helmet } from 'react-helmet'

import { pricePrecision } from '../../config/tokens'
import { isTomoWallet, truncateZeroDecimal } from '../../utils/helpers'
import { TOMOSCAN_URL, DEX_TITLE, DEX_LOGO, DEX_FAVICON } from '../../config/environment'
import { locales, messsages } from '../../locales'
import {
  NavbarDivider,
  Theme,
  DarkMode,
  TmColors,
  LightMode,
} from '../../components/Common'
import Notifier from '../../components/Notifier'
import Notifications from '../../components/Notifications'
import TomoXLogo from '../../components/Common/TomoXLogo'
import TokenSearcher from '../../components/TokenSearcher'
import { getChangePriceText, getChangePercentText } from '../../utils/helpers'
import SessionPasswordModal from '../../components/SessionPasswordModal'
import globeGrayUrl from '../../assets/images/globe_icon_gray.svg'
import globeWhiteUrl from '../../assets/images/globe_icon_white.svg'
import arrowGrayUrl from '../../assets/images/arrow_down_gray.svg'
import favicon from '../../assets/images/favico-32x32.png'

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
      return (
        <>
          <Helmet>
            <link rel="shortcut icon" href={DEX_FAVICON || favicon} />
            <title>{DEX_TITLE}</title>
          </Helmet>
          <CreateImportWallet {...this.props} />
        </>
      )
    }

    return (
      <ThemeProvider theme={theme[mode]}>
        <Helmet>
          <link rel="shortcut icon" href={DEX_FAVICON || favicon} />
          <title>{DEX_TITLE}</title>
        </Helmet>
        <Default {...this.props} />
      </ThemeProvider>
    )
  }
}

class Default extends React.PureComponent<Props, State> {
  state = {
    sessionPassword: '',
    sessionPasswordStatus: '',
    isShowTokenSearcher: false,
  }

  componentDidMount = async () => {
    const { createProvider, authenticated, queryAccountData } = this.props

    if (window.web3 && window.web3.currentProvider && isTomoWallet()) {
      await this.props.loginWithMetamask()
    }

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
    return pathname.includes('/trade') || pathname.includes('/dapp')
  }

  handleThemeChange = (e: Object) => {
    e.target.checked ? this.props.changeMode('dark') : this.props.changeMode('light')
  }

  handleSessionPasswordChange = (e) => {
    this.setState({
      sessionPassword: e.target.value,
    })
  }

  unlockWalletWithSessionPassword = async () => {
    const { error } = await this.props.unlockWalletWithSessionPassword(this.state.sessionPassword)

    if (!error) this.props.queryAccountData()

    this.setState({ 
      sessionPasswordStatus: error ? 'incorrect' : '',
    })
  }


  unlockWalletWithSessionPasswordOnKeyPress = async (event) => {
    if (event.key !== 'Enter') return
    await this.unlockWalletWithSessionPassword()
  }

  closeSessionPasswordModal = () => {
    const { closeSessionPasswordModal, logout } = this.props
    closeSessionPasswordModal()
    logout()
  }

  toggleTokenSearcherMobile = (isShow: Boolean) => {
    this.setState({ isShowTokenSearcher: isShow })
  }

  generateClassname = () => {
    const className = this.isTradingPage(this.props.pathname) ? "exchange-page" : ""
    return (window.web3 && window.web3.currentProvider && isTomoWallet()) ? `${className} tomo-wallet` : className
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
      showSessionPasswordModal,
    } = this.props

    const { isShowTokenSearcher } = this.state

    const menu = (
      <MenuWallet>
        <MenuItem>
          <MenuItemTitle>Wallet</MenuItemTitle>
          <AddressWalletBox>
            <AddressText>{address}</AddressText>

            <CopyToClipboard text={address} onCopy={copyDataSuccess}>
              <IconBox title="Copy Address">              
                <Icon icon="applications" />              
              </IconBox>
            </CopyToClipboard>

            <IconBox title="Go to Tomoscan">
              <a target="_blank" rel="noreferrer noopener" href={`${TOMOSCAN_URL}/address/${address}`}><Icon icon="document-share" /></a>
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
      <Wrapper mode={mode} className={this.generateClassname()}>
        <Notifier />
        <Header>
          <Navbar>
            <MainLogoWrapper>
              <TomoXLogo src={DEX_LOGO} height={40} width={40} />
            </MainLogoWrapper>

            <LeftNavbarGroup align={Alignment.LEFT}>
            {this.isTradingPage(pathname) 
            && (
              <TokenInfo>
                {currentPair && currentPairData && (
                  <Helmet>
                    <title>
                      {truncateZeroDecimal(BigNumber(currentPairData.price).toFormat(pricePrecision))} | {currentPair.pair.replace("/", "")} | {DEX_TITLE}
                    </title>
                  </Helmet>
                )}

                {currentPair && (
                  <React.Fragment>

                    <TokenSearcherPopover
                      content={<TokenSearcher />}
                      position={Position.BOTTOM_LEFT}
                      minimal>
                      <TokenPaisDropDown>
                        <span>{currentPair.pair}</span> 
                        <i className="arrow"></i>
                      </TokenPaisDropDown>
                    </TokenSearcherPopover>

                    {/* For mobile */}
                    {!isShowTokenSearcher && (
                      <TokenPaisDropDownMobile onClick={() => this.toggleTokenSearcherMobile(true)}>
                        <span>{currentPair.pair}</span> 
                        <i className="arrow"></i>
                      </TokenPaisDropDownMobile>
                    )}
                  </React.Fragment>
                )}

                <HeaderDivider />

                {currentPairData && (currentPairData.ticks.length > 0) && 
                  (<TokenTick>
                    <LastPriceTick>
                      <div className="title xs-hidden"><FormattedMessage id="priceBoard.lastPrice" /></div>
                      <div className="price">
                        <span>{truncateZeroDecimal(BigNumber(currentPairData.price).toFormat(pricePrecision))}</span>
                        <span className="up">{referenceCurrency.symbol}{truncateZeroDecimal(BigNumber(currentPairData.priceUsd).toFormat(pricePrecision))}</span>
                      </div>
                    </LastPriceTick>

                    <ChangeTick>
                      <div className="title xs-hidden"><FormattedMessage id="priceBoard.24hChange" /></div>
                      <div className={ (currentPairData.ticks[0].close - currentPairData.ticks[0].open) >= 0 ? 'up' : 'down'}>
                        <span>{getChangePriceText(currentPairData.ticks[0].open, currentPairData.ticks[0].close, 2)}</span>
                        <span>{getChangePercentText(currentPairData.change)}</span>
                      </div>
                    </ChangeTick>

                    <HighTick>
                      <div className="title"><FormattedMessage id="priceBoard.24hHigh" /></div>
                      <div>
                        <span>{truncateZeroDecimal(BigNumber(currentPairData.ticks[0].high).toFormat(pricePrecision))}</span>
                      </div>
                    </HighTick>

                    <LowTick>
                      <div className="title"><FormattedMessage id="priceBoard.24hLow" /></div>
                      <div>
                        <span>{truncateZeroDecimal(BigNumber(currentPairData.ticks[0].low).toFormat(pricePrecision))}</span>
                      </div>
                    </LowTick>

                    <VolumeTick>
                      <div className="title"><FormattedMessage id="priceBoard.24hVolume" /></div>
                      <div>
                        <span>{truncateZeroDecimal(BigNumber(currentPairData.ticks[0].volume).toFormat(pricePrecision))}</span>
                      </div>
                    </VolumeTick>
                  </TokenTick>)
                }
              </TokenInfo>
            )}
            </LeftNavbarGroup>

            <NavbarGroup className="utilities-menu xs-hidden" align={Alignment.RIGHT}>
              <SupportItem className="utility-item support">
                <a href="https://docs.tomochain.com/" target="_blank" rel="noopener noreferrer">
                  <i>support</i>
                </a>
              </SupportItem>

              <NotificationItem>
                {
                  (newNotifications > 0) && (<NumberNewNotifications />)
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
          <Sidebar> 
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

        <SessionPasswordModal 
          password={this.state.sessionPassword}
          passwordStatus={this.state.sessionPasswordStatus}
          onChange={this.handleSessionPasswordChange}  
          unlockWalletOnKeyPress={this.unlockWalletWithSessionPasswordOnKeyPress}        
          unlockWallet={this.unlockWalletWithSessionPassword}
          isOpen={showSessionPasswordModal} 
          handleClose={this.closeSessionPasswordModal} />

        {isShowTokenSearcher && (
          <TokenSearcherBoxMobile>
            <TokenSearcherTitle><FormattedMessage id="mainMenuPage.markets" /></TokenSearcherTitle>
            <Close icon="cross" intent="danger" onClick={() => this.toggleTokenSearcherMobile(false)} />
            <TokenSearcher toggleTokenSearcherMobile={this.toggleTokenSearcherMobile} />
          </TokenSearcherBoxMobile>
        )}
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
        <Helmet>
          <title>TomoX | Decentralized Exchange</title>
        </Helmet>
        <Notifier />
        <CreateImportHeader>
          <Navbar>
            <LogoWrapper>
              <TomoXLogo src={DEX_LOGO} height={40} width={40} />
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

  const items = Object.keys(messsages).map((key, index) => {
    return (
      <LocaleItem 
        key={index}
        active={locale === key} 
        onClick={() => changeLocale(key)}>
        {locales[key]} {(locale === key) && (<Icon icon="tick" color={TmColors.ORANGE} />)}
      </LocaleItem>
    )
  })

  return (
    <LocaleList>
      {items}
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
})`
  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      padding: 0 5px;
      height: 120px;
    }
  }
`

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
  className: 'logo xs-hidden',
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

const TokenSearcherBoxMobile = styled.div`
  @media only screen and (max-width: 680px) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1010;
    padding-top: 45px;
    background-color: ${props => props.theme.subBg};
  }
`

const TokenSearcherTitle = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 7px 0;
  font-size: ${Theme.FONT_SIZE_MD};
`

const Close = styled(Icon)`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  padding: 10px;
`

const TokenSearcherPopover = styled(Popover)`
  width: fit-content;
  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      display: none;
    }
  }
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

const TokenPaisDropDownMobile = styled(TokenPaisDropDown)`
  display: none;
  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      display: block;
      padding: 30px 0 15px;
      font-size: ${Theme.FONT_SIZE_MD};
      font-weight: bold;
    }
  }
`

const MainContainer = styled.div.attrs({
  className: 'main-container',
})`
  display: grid;
  grid-template-columns: 155px 1fr;
`

const Sidebar = styled.div.attrs({
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

const HeaderDivider = styled(NavbarDivider).attrs({
  className: 'xs-hidden',
})``

const TokenInfo = styled.div.attrs({
  className: 'token-info',
})`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  .arrow {
    transition: transform .5s ease;
  }

  .bp3-popover-open .arrow {
    transform: rotate(180deg);
  }

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      flex-flow: column;
      width: 100%;
    }
  }
`

const LeftNavbarGroup = styled(NavbarGroup)`
  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      width: 100%;
    }
  }
`

const TokenTick = styled.div.attrs({ 
  className: 'token-tick',
})`
  display: grid;
  // grid-auto-flow: column;
  grid-template-areas: 
  "last-price change high low volume";
  color: ${props => props.theme.textSmallChart};
  font-size: ${Theme.FONT_SIZE_SM};
  .tick {
    margin-right: 50px;
    &:last-child {
      margin-right: 0;
    }
    span {
      margin-right: 12px;
    }
  }
  .title {
    margin-bottom: 5px;
  }

  .title {
    color: ${props => props.theme.menuColor};
  }

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      width: 100%;
      font-size: 10px;
      grid-template-areas: 
      "last-price last-price"
      "change high"
      "volume low";
      .tick {
        &:first-child {
          margin-bottom: 5px;
        }
        margin-bottom: 2px;
        margin-right: 0 !important;
      }
    }
  }
`

const Tick = styled.div`
  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      display: flex;
    }
  }
`

const LastPriceTick = styled(Tick).attrs({
  className: 'tick last-price',
})`
  grid-area: last-price;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & .price > span:first-child {
      font-size: 20px;
    }
  }
`

const ChangeTick = styled(Tick).attrs({
  className: 'tick change',
})`
  grid-area: change;
`

const HighTick = styled(Tick).attrs({
  className: 'tick high',
})`
  grid-area: high;
`

const LowTick = styled(Tick).attrs({
  className: 'tick low',
})`
  grid-area: low;
`

const VolumeTick = styled(Tick).attrs({
  className: 'tick volume',
})`
  grid-area: volume;
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
  color: ${TmColors.WHITE};
  font-size: 12px;
  border-radius: 5px;
  background-color: ${TmColors.RED};
`

const LanguageItem = styled.div``

const UserItem = styled.div``

const NavbarLink = styled(NavLink)`
  color: ${TmColors.GRAY};

  &:hover {
    color: ${TmColors.WHITE};
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
