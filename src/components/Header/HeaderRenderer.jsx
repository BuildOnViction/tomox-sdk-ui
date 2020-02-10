// @flow
import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
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
import BigNumber from 'bignumber.js'
import { Helmet } from 'react-helmet'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { locales, messsages } from '../../locales'
import {
  NavbarDivider,
  Theme,
  TmColors,
} from '../../components/Common'
import Notifications from '../../components/Notifications'
import TomoXLogo from '../../components/Common/TomoXLogo'
import TokenSearcher from '../../components/TokenSearcher'
import { getChangePriceText, getChangePercentText } from '../../utils/helpers'
import { TOMOSCAN_URL, DEX_TITLE, DEX_LOGO } from '../../config/environment'

const HeaderRenderer = (props) => {
    const {
        pathname,
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
        isTradingPage,
        toggleTokenSearcherMobile,
    } = props

    return (
        <Header>
            <Navbar>
            <MainLogoWrapper>
                <TomoXLogo src={DEX_LOGO} height={40} width={40} />
            </MainLogoWrapper>

            <LeftNavbarGroup align={Alignment.LEFT}>
            {currentPair && isTradingPage(pathname) 
            && (
                <TokenInfo>
                {currentPairData && (
                    <Helmet>
                    <title>
                        {BigNumber(currentPairData.price).toFormat(currentPairData.pricePrecision)} | {currentPair.pair.replace("/", "")} | {DEX_TITLE}
                    </title>
                    </Helmet>
                )}

                {currentPair && (
                    <React.Fragment>

                    <TokenSearcherPopover
                        content={<TokenSearcher />}
                        position={Position.BOTTOM_LEFT}
                        minimal>
                        <TokenPairsDropDown>
                        <span>{currentPair.pair}</span> 
                        <i className="arrow"></i>
                        </TokenPairsDropDown>
                    </TokenSearcherPopover>

                    {/* For mobile */}
                    {!isShowTokenSearcher && (
                        <TokenPairsDropDownMobile onClick={() => toggleTokenSearcherMobile(true)}>
                        <span>{currentPair.pair}</span> 
                        <i className="arrow"></i>
                        </TokenPairsDropDownMobile>
                    )}
                    </React.Fragment>
                )}

                <HeaderDivider />

                {currentPairData && (currentPairData.ticks.length > 0) && 
                    (<TokenTick>
                    <LastPriceTick>
                        <div className="title xs-hidden"><FormattedMessage id="priceBoard.lastPrice" /></div>
                        <LastPriceContentTick className="price">
                        <span>{BigNumber(currentPairData.price).toFormat(currentPairData.pricePrecision)}</span>
                        {currentPairData.priceUsd && (<span className="up">{referenceCurrency.symbol}{BigNumber(currentPairData.priceUsd).toFormat(currentPairData.pricePrecisionUsd)}</span>)}
                        </LastPriceContentTick>
                    </LastPriceTick>

                    <ChangeTick>
                        <div className="title xs-hidden"><FormattedMessage id="priceBoard.24hChange" /></div>
                        <ChangeContentTick className={ (currentPairData.ticks[0].close - currentPairData.ticks[0].open) >= 0 ? 'up' : 'down'}>
                        <span>{getChangePriceText(currentPairData.ticks[0].open, currentPairData.ticks[0].close, currentPairData.pricePrecision)}</span>
                        <span>{getChangePercentText(currentPairData.change)}</span>
                        </ChangeContentTick>
                    </ChangeTick>

                    <HighTick>
                        <div className="title"><FormattedMessage id="priceBoard.24hHigh" /></div>
                        <HighContentTick>
                        <span>{BigNumber(currentPairData.ticks[0].high).toFormat(currentPairData.pricePrecision)}</span>
                        </HighContentTick>
                    </HighTick>

                    <LowTick>
                        <div className="title"><FormattedMessage id="priceBoard.24hLow" /></div>
                        <LowContentTick>
                        <span>{BigNumber(currentPairData.ticks[0].low).toFormat(currentPairData.pricePrecision)}</span>
                        </LowContentTick>
                    </LowTick>

                    <VolumeTick>
                        <div className="title"><FormattedMessage id="priceBoard.24hVolume" /></div>
                        <VolumeContentTick>
                        {currentPair && (<span>{BigNumber(currentPairData.ticks[0].volume).toFormat(2)} {currentPair.quoteTokenSymbol}</span>)}
                        </VolumeContentTick>
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
  
  
  const TokenSearcherPopover = styled(Popover)`
    width: fit-content;
    @media only screen and (max-width: 680px) {
      .tomo-wallet & {
        display: none;
      }
    }
  `
  
  const TokenPairsDropDown = styled.div.attrs({
    className: 'tokens-dropdown',
  })`
    color: ${props => props.theme.labelTokensDropdown};
    cursor: pointer;
  
    &:hover {
      color: ${props => props.theme.labelTokensDropdownHover}
    }
  `
  
  const TokenPairsDropDownMobile = styled(TokenPairsDropDown)`
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
    grid-template-areas: 
    "last-price change high low volume";
    color: ${props => props.theme.textSmallChart};
    font-size: ${Theme.FONT_SIZE_SM};
  
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
    margin-right: 50px;
  
    &:last-child {
      margin-right: 0;
    }
  
    span {
      margin-right: 12px;
    }
  
    @media only screen and (max-width: 1300px) {
      margin-right: 15px;
    }
  
    @media only screen and (max-width: 680px) {
      .tomo-wallet & {
        display: flex;
      }
    }
  `
  
  const ContentTick = styled.div`
    font-family: "Ubuntu", sans-serif;
  `
  
  const LastPriceTick = styled(Tick).attrs({
    className: 'tick last-price',
  })`
    grid-area: last-price;
    min-width: 120px;
  
    @media only screen and (max-width: 680px) {
      .tomo-wallet & .price > span:first-child {
        font-size: 20px;
      }
    }
  `
  
  const LastPriceContentTick = styled(ContentTick)``
  
  const ChangeTick = styled(Tick).attrs({
    className: 'tick change',
  })`
    grid-area: change;
  `
  
  const ChangeContentTick = styled(ContentTick)``
  
  const HighTick = styled(Tick).attrs({
    className: 'tick high',
  })`
    grid-area: high;
  `
  
  const HighContentTick = styled(ContentTick)``
  
  const LowTick = styled(Tick).attrs({
    className: 'tick low',
  })`
    grid-area: low;
  `
  
  const LowContentTick = styled(ContentTick)``
  
  const VolumeTick = styled(Tick).attrs({
    className: 'tick volume',
  })`
    grid-area: volume;
  `
  
  const VolumeContentTick = styled(ContentTick)``
  
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