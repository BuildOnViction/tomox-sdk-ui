// @flow
import React from 'react'
import styled from 'styled-components'
import { NavLink, Route, Switch } from 'react-router-dom'
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
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { locales, messsages } from '../../locales'
import {
  TmColors,
} from '../../components/Common'
import Notifications from '../../components/Notifications'
import TomoXLogo from '../../components/Common/TomoXLogo'
import { TOMOSCAN_URL, DEX_LOGO } from '../../config/environment'
import Ticker from '../Ticker'
import LendingTicker from '../lending/LendingTicker'

const HeaderRenderer = (props) => {
  const {
    currentPair,
    currentPairData,
    isShowTokenSearcher,
    referenceCurrency,
    newNotifications,
    authenticated,
    address,
    copyDataSuccess,
    locale,
    changeLocale,
    toggleTokenSearcherMobile,
    lendingCurrentPair,
    lendingCurrentPairData,
  } = props
  
  return (
    <Header>
      <Navbar>
        <MainLogoWrapper>
          <ExternalLink href={window.location.origin}><TomoXLogo src={DEX_LOGO} height={40} width={40} /></ExternalLink>
        </MainLogoWrapper>

        <Switch>
          <Route 
            exact 
            path="/trade/:pair?" 
            children={<Ticker
              currentPair={currentPair}
              currentPairData={currentPairData}
              isShowTokenSearcher={isShowTokenSearcher}
              referenceCurrency={referenceCurrency}
              toggleTokenSearcherMobile={toggleTokenSearcherMobile}
            />} 
          />
          <Route 
            exact 
            path="/dapp/:pair?" 
            children={<Ticker
              currentPair={currentPair}
              currentPairData={currentPairData}
              isShowTokenSearcher={isShowTokenSearcher}
              referenceCurrency={referenceCurrency}
              toggleTokenSearcherMobile={toggleTokenSearcherMobile}
            />} 
          />
          <Route 
            exact 
            path="/lending/:pair?" 
            children={<LendingTicker
              currentPair={lendingCurrentPair}
              currentPairData={lendingCurrentPairData}
              isShowTokenSearcher={isShowTokenSearcher}
            />} 
          />
          <Route 
            exact 
            path="/dapp/lending/:pair?" 
            children={<LendingTicker
              currentPair={lendingCurrentPair}
              currentPairData={lendingCurrentPairData}
              isShowTokenSearcher={isShowTokenSearcher}
              toggleTokenSearcherMobile={toggleTokenSearcherMobile}
            />} 
          />
        </Switch>

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
                    content={<MenuWallet address={address} copyDataSuccess={copyDataSuccess} />}
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
  )
}

const MenuWallet = (props) => {
    const { address, copyDataSuccess } = props

    return  (
        <StyledMenu>
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
        </StyledMenu>
    )
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

const MainLogoWrapper = styled(NavbarHeading).attrs({
  className: 'logo xs-hidden',
})``
  
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

const ExternalLink = styled.a``

const NavbarLink = styled(NavLink)`
  color: ${TmColors.GRAY};

  &:hover {
    color: ${TmColors.WHITE};
  }
`

const StyledMenu = styled(Menu)`
  &.bp3-menu {
    width: 320px;
    color: ${props => props.theme.menuColor};
    background-color: ${props => props.theme.menuBg};
    border: 1px solid ${props => props.theme.border};
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, .1);
    overflow: hidden;
    margin-top: 10px;
  }
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

const LocaleList = styled(StyledMenu)`
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

const UserIcon = styled(Icon)`
  color: ${props => props.theme.icon};

  &:hover {
    color: ${props => props.theme.iconHover};
  }
`

export default HeaderRenderer