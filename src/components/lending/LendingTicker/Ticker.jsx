// @flow
import React from 'react'
import styled from 'styled-components'
import {
  Alignment,
  NavbarGroup,
  Popover,
  Position,
  Icon,
} from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import { Link } from 'react-router-dom'

import {
  NavbarDivider,
  Theme,
} from '../../../components/Common'
import LendingTokenSearcher from '../../../components/lending/LendingTokenSearcher'
import { getChangePercentText } from '../../../utils/helpers'

const TickerRenderer = (props) => {
  const {
    currentPair,
    currentPairData,
    isShowTokenSearcher,
    toggleLendingTokenSearcherDapp,
  } = props
  
  return (
    <LeftNavbarGroup align={Alignment.LEFT}>
    {currentPair 
    && (
      <TokenInfo>
        {/* {currentPairData && (
          <Helmet>
            <title>
              {BigNumber(currentPairData.price).toFormat(currentPairData.pricePrecision)} | {currentPair.pair.replace("/", "")} | {DEX_TITLE}
            </title>
          </Helmet>
        )} */}

        {currentPair && currentPair.termSymbol && (
          <React.Fragment>
            <TokenSearcherPopover
              content={<LendingTokenSearcher />}
              position={Position.BOTTOM_LEFT}
              minimal>
              <TokenPairsDropDown>
                <span>{`${currentPair.termSymbol}/${currentPair.lendingTokenSymbol}`}</span> 
                <i className="arrow"></i>
              </TokenPairsDropDown>
            </TokenSearcherPopover>

            {/* For mobile */}
            {!isShowTokenSearcher && (
              <TokenPairsDropDownMobile onClick={() => toggleLendingTokenSearcherDapp(true)}>
                <span>{currentPair.pair}</span> 
                <i className="arrow"></i>
              </TokenPairsDropDownMobile>
            )}
          </React.Fragment>
        )}

        <SwitchPopover
          content={<StyledLink to="/dapp/spot">Switch to spot</StyledLink>}
          position={Position.BOTTOM_LEFT}
          minimal
        >
          <SwapBtn icon="swap-horizontal" iconSize="12" />
        </SwitchPopover>

        <HeaderDivider />

        {currentPairData &&
          (<TokenTick>
            <LastPriceTick>
              <div className="title xs-hidden"><FormattedMessage id="lending.ticker.lastInterest" /></div>
              <LastPriceContentTick className="price">
                <span>{BigNumber(currentPairData.close).toFormat(2)}&#37;</span>
              </LastPriceContentTick>
            </LastPriceTick>

            <ChangeTick>
              <div className="title xs-hidden"><FormattedMessage id="priceBoard.24hChange" /></div>
              <ChangeContentTick className={ (currentPairData.close - currentPairData.open) >= 0 ? 'up' : 'down'}>
                <span>{getChangePercentText(currentPairData.change)}</span>
              </ChangeContentTick>
            </ChangeTick>

            <HighTick>
              <div className="title"><FormattedMessage id="priceBoard.24hHigh" /></div>
              <HighContentTick>
                <span>{BigNumber(currentPairData.high).toFormat(2)}&#37;</span>
              </HighContentTick>
            </HighTick>

            <LowTick>
              <div className="title"><FormattedMessage id="priceBoard.24hLow" /></div>
              <LowContentTick>
                <span>{BigNumber(currentPairData.low).toFormat(2)}&#37;</span>
              </LowContentTick>
            </LowTick>

            <VolumeTick>
              <div className="title"><FormattedMessage id="priceBoard.24hVolume" /></div>
              <VolumeContentTick>
                {currentPair && (<span>{BigNumber(currentPairData.volume).toFormat(2)} {currentPair.lendingTokenSymbol}</span>)}
              </VolumeContentTick>
            </VolumeTick>
          </TokenTick>)
        }
      </TokenInfo>
    )}
    </LeftNavbarGroup>
  )
}

const TokenSearcherPopover = styled(Popover)`
  width: fit-content;
  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      display: none;
    }
  }
`

const SwitchPopover = styled(Popover)`
  display: none;
  position: absolute;
  top: 15px;
  right: 0;
  padding: 10px;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      display: block;
    }
  }
`

const SwapBtn = styled(Icon)`
  border: 1px solid #394362;
  border-radius: 50%;
  padding: 7px;
`

const StyledLink = styled(Link)`
  color: #9ca4ba;
  font-size: ${Theme.FONT_SIZE_MD};
  background-color: #394362;
  padding: 7px 10px;
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
  position: relative;

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

export default TickerRenderer
