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
import { FormattedMessage } from 'react-intl'
import { Helmet } from 'react-helmet'

import { isTomoWallet, isMobile } from '../../utils/helpers'
import { DEX_TITLE, DEX_LOGO, DEX_FAVICON } from '../../config/environment'
import { locales, messsages } from '../../locales'
import {
  Theme,
  DarkMode,
  TmColors,
  LightMode,
} from '../../components/Common'
import Notifier from '../../components/Notifier'
import TomoXLogo from '../../components/Common/TomoXLogo'
import TokenSearcher from '../../components/TokenSearcher'
import Header from '../../components/Header'
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
        <ThemeProvider theme={theme[mode]}>
          <CreateImportWallet {...this.props} />
        </ThemeProvider>
      )
    }

    return (
      <ThemeProvider theme={theme[mode]}>
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

    if (isTomoWallet()) {
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
    const { pathname } = this.props
    const className = this.isTradingPage(pathname) ? "exchange-page" : ""
    return ((isTomoWallet() || isMobile()) && pathname.includes('/dapp')) ? `${className} tomo-wallet` : className
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

    return (
      <Wrapper mode={mode} className={this.generateClassname()}>
        <Helmet>
          <link rel="shortcut icon" href={DEX_FAVICON || favicon} />
          <title>{DEX_TITLE}</title>
        </Helmet>
        <Notifier />
        
        <Header 
          authenticated={authenticated}
          address={address}
          currentPair={currentPair}
          currentPairData={currentPairData}
          referenceCurrency={referenceCurrency}
          copyDataSuccess={copyDataSuccess}
          locale={locale}
          changeLocale={changeLocale}
          newNotifications={newNotifications}
          pathname={pathname}
          isTradingPage={this.isTradingPage} />

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
          handleClose={this.closeSessionPasswordModal}
          mode={mode} />

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
          <link rel="shortcut icon" href={DEX_FAVICON || favicon} />
          <title>{DEX_TITLE}</title>
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

const LanguageItem = styled.div``

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
  &.bp3-menu {
    width: 320px;
    color: ${props => props.theme.menuColor};
    background-color: ${props => props.theme.menuBg};
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, .5);
    overflow: hidden;
    margin-top: 10px;
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
  color: ${props => props.active ? DarkMode.active : DarkMode.menuColor};
  background-color: ${props => props.active ? DarkMode.menuBgHover : DarkMode.menuBg};

  &:hover {
    color: ${DarkMode.menuColorHover};
    background-color: ${DarkMode.menuBgHover};
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
