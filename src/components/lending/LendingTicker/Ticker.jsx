// @flow
import React from 'react'
import styled from 'styled-components'
import {
  Alignment,
  NavbarGroup,
  Popover,
  Position,
} from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import {
  NavbarDivider,
  Theme,
} from '../../../components/Common'
import LendingTokenSearcher from '../../../components/lending/LendingTokenSearcher'
import { getChangePercentText } from '../../../utils/helpers'
import DappSwitchProduct from '../../../components/DappSwitchProduct'

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
                <span>
                  {currentPair.termByDay}&nbsp;{currentPair.termByDay > 1 ? <FormattedMessage id="app.days" /> : <FormattedMessage id="app.day" />}
                  /{currentPair.lendingTokenSymbol}
                </span> 
                <i className="arrow"></i>
              </TokenPairsDropDown>
            </TokenSearcherPopover>

            {/* For mobile */}
            {!isShowTokenSearcher && (
              <TokenPairsDropDownMobile onClick={() => toggleLendingTokenSearcherDapp(true)}>
                <span>
                  {currentPair.termByDay}&nbsp;{currentPair.termByDay > 1 ? <FormattedMessage id="app.days" /> : <FormattedMessage id="app.day" />}
                  /{currentPair.lendingTokenSymbol}  
                </span> 
                <i className="arrow"></i>
              </TokenPairsDropDownMobile>
            )}
          </React.Fragment>
        )}

        <DappSwitchProduct link="/dapp/spot" title={<FormattedMessage id="dapp.switchToSpot" />} />

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
