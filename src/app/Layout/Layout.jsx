// @flow
import type { Node } from 'react'
import React from 'react'
import styled from 'styled-components'
import { Route, Switch, NavLink } from 'react-router-dom'
import {
  Alignment,
  Menu,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position,
  Icon,
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
} from '../../components/Common'

import globeGrayUrl from '../../assets/images/globe_icon_gray.svg'
import globeWhiteUrl from '../../assets/images/globe_icon_white.svg'
import arrowGrayUrl from '../../assets/images/arrow_down_gray.svg'
import favicon from '../../assets/images/favico-32x32.png'

import Notifier from '../../components/Notifier'
import TomoXLogo from '../../components/Common/TomoXLogo'
import TokenSearcher from '../../components/TokenSearcher'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import DappSidebar from '../../components/DappSidebar'
import DappLendingTokenSearcher from '../../components/lending/DappLendingTokenSearcher'
import DappLendingSidebar from '../../components/lending/DappLendingSidebar'

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
    const { pathname } = this.props

    if (this.isCreateImportWalletPage(pathname)) {
      return (<CreateImportWallet {...this.props} />)
    }

    return (<Default {...this.props} />)
  }
}

class Default extends React.PureComponent<Props, State> {
  state = {
    sessionPassword: '',
    sessionPasswordStatus: '',
    isShowTokenSearcher: false,
    isShowLendingTokenSearcher: false,
  }

  componentDidMount = async () => {
    const { createProvider, authenticated, queryAccountData } = this.props

    if (isTomoWallet() || isMobile()) {
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
    return (
      pathname.includes('/trade')
      || (pathname.includes('/lending') && !pathname.includes('/markets'))
      || pathname.includes('/dapp')
    )
  }

  handleThemeChange = (e: Object) => {
    e.target.checked ? this.props.changeMode('dark') : this.props.changeMode('light')
  }

  handleSessionPasswordChange = (e) => {
    this.setState({
      sessionPassword: e.target.value,
    })
  }

  toggleTokenSearcherMobile = (isShow: Boolean) => {
    this.setState({ isShowTokenSearcher: isShow })
  }

  toggleLendingTokenSearcherDapp = (status: Boolean) => {
    this.setState({ isShowLendingTokenSearcher: status })
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
      lendingCurrentPair,
      lendingCurrentPairData,
    } = this.props

    const { isShowTokenSearcher, isShowLendingTokenSearcher } = this.state
    
    return (
      <Wrapper mode={mode} className={this.generateClassname()}>
        <Helmet>
          <meta property="og:url" content={window.location.origin} />
          <meta property="og:site_name" content={DEX_TITLE} />
          <meta property="og:title" content={DEX_TITLE} />
          <meta name="twitter:title" content={DEX_TITLE} />

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
          isTradingPage={this.isTradingPage}
          toggleTokenSearcherMobile={this.toggleTokenSearcherMobile}
          lendingCurrentPair={lendingCurrentPair}
          lendingCurrentPairData={lendingCurrentPairData}
          toggleLendingTokenSearcherDapp={this.toggleLendingTokenSearcherDapp}
        />

        <MainContainer>
          <Switch>
            <Route 
              exact 
              path={[
                "/wallet",
                "/markets/trading",
                "/trade/:pair?",
                "/markets/lending",
                "/lending/:pair?",
              ]} 
              component={() => <Sidebar 
                          disabled={!this.isTradingPage(pathname)} 
                          mode={mode}
                          onChangeTheme={this.handleThemeChange}
                        />} 
            />
            <Route 
              exact 
              path={[
                "/dapp/spot/fund",
                "/dapp/spot/account",
                "/dapp/spot/:pair?",
                "/dapp/trade/:pair?",
              ]} 
              component={() => <DappSidebar currentPair={currentPair} />} 
            />
            <Route 
              exact 
              path={[
                "/dapp/lending/fund",
                "/dapp/lending/account",
                "/dapp/lending/:pair?",
                "/dapp/lending/trade/:pair?",
              ]} 
              component={() => <DappLendingSidebar currentPair={lendingCurrentPair} />} 
            />
          </Switch>
          <MainContent>{children}</MainContent>
        </MainContainer>

        {isShowTokenSearcher && (
          <TokenSearcherBoxMobile>
            <TokenSearcherTitle><FormattedMessage id="mainMenuPage.markets" /></TokenSearcherTitle>
            <Close icon="cross" intent="danger" onClick={() => this.toggleTokenSearcherMobile(false)} />
            <TokenSearcher toggleTokenSearcherMobile={this.toggleTokenSearcherMobile} />
          </TokenSearcherBoxMobile>
        )}

        {isShowLendingTokenSearcher && (
          <TokenSearcherBoxMobile>
            <TokenSearcherTitle><FormattedMessage id="mainMenuPage.markets" /></TokenSearcherTitle>
            <Close icon="cross" intent="danger" onClick={() => this.toggleLendingTokenSearcherDapp(false)} />
            <DappLendingTokenSearcher toggleLendingTokenSearcherDapp={this.toggleLendingTokenSearcherDapp} />
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
              <ExternalLink href={window.location.origin}>
                <TomoXLogo src={DEX_LOGO} height={40} width={40} />
              </ExternalLink>
            </LogoWrapper>

            <NavbarGroup className="utilities-menu" align={Alignment.RIGHT}>
              <PageLink to="/markets/trading"><FormattedMessage id="mainMenuPage.spot" /></PageLink>

              <PageLink to="/markets/lending"><FormattedMessage id="mainMenuPage.lending" /></PageLink>

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

  &.tomo-wallet .main-content {
    height: fit-content !important;
  }
`

const CreateImportWrapper = styled(Wrapper)`
  background: ${DarkMode.mainBg};
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

const MainContent = styled.main.attrs({
  className: "main-content",
})`
  flex: 1;
  height: calc(100vh - ${Theme.HEADER_HEIGHT_LG});
  min-height: 690px; //410px(Charting) + 250px(Order table) + 10px(Gap) + 20px(Padding bottom)

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

const ExternalLink = styled.a``

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
