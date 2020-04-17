import styled from "styled-components"
import { Button, InputGroup } from "@blueprintjs/core"

import { Theme, TmColors } from "../Common"

export const InputGroupWrapper = styled(InputGroup).attrs({
  className: "bp3-fill",
})`
  &.has-error .bp3-input {
    box-shadow: 0 0 0 1px ${TmColors.RED};
  }

  .bp3-input {
    font-family: 'Ubuntu', sans-serif;
    font-size: ${Theme.FONT_SIZE_SM};
    padding-right: 50px !important;

    &:focus {
      box-shadow: 0 0 0 1px ${TmColors.ORANGE} !important;
    }
  }

  @media only screen and (max-width: 680px) {
    .tomo-wallet & .bp3-input {
      font-size: ${Theme.FONT_SIZE_SM};
    }
  }
`
  
export const TokenName = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  user-select: none;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      top: 65%;
      font-size: 10px;
    }
  }
`
  
export const InputBox = styled.div`
  display: flex;
  position: relative;
  margin-bottom: ${props => props.mb ? props.mb : '10px'};
  margin-top: ${props => props.mt ? props.mt : '0'};

  &:hover {
    .increase-decrease-box {
      display: flex !important;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  .bp3-input-group.bp3-fill {
    width: calc(100% - 60px);
  }

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      flex-flow: column;

      .bp3-input-group.bp3-fill {
        width: 100%;
      }
    }

    .tomo-wallet &:hover {
      .increase-decrease-box {
        display: none !important;
      }
    }
  }
`
  
export const InputLabel = styled.div`
  height: 100%;
  width: 60px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: auto 0;
  padding-right: 5px;
  user-select: none;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      width: 100%;
    }
  }
`
  
export const SmallText = styled.span`
  font-size: ${Theme.FONT_SIZE_SM};
`
  
export const Value = styled.span`
  width: calc(100% - 60px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      width: 100%;
    }
  }
`
  
export const BuyLimitOrderContainer = styled.div.attrs({
  className: "buy-side",
})``
  
export const HeaderRow = styled.div.attrs({
  className: "header",
})`
  margin-bottom: 10px;
`

export const SellLimitOrderContainer = styled.div.attrs({
  className: "sell-side",
})``

export const SellButton = styled(Button).attrs({
  className: "sell-btn",
})`
  padding: 10px !important;
  margin-top: 15px;
`
  
export const BaseToken = styled.span.attrs({
  className: "base-token",
})``
  
export const BuyButton = styled(Button).attrs({
  className: "buy-btn",
})`
  padding: 10px !important;
  margin-top: 15px;
`
  
export const MaxAmountInfo = styled.div`
  background: ${TmColors.ORANGE};
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${Theme.FONT_SIZE_SM};
  color: ${TmColors.WHITE};
  position: absolute;
  top: 100%;
  left: 60px;
  right: 0;
  
  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      display: none;
    }
  }
`

export const Row = styled.div``
  
export const ErrorMessage = styled.div`
  min-height: 17px;
  line-height: 17px;
  width: calc(100% - 60px);
  color: ${TmColors.RED};
  margin-left: auto;
  margin-top: -7px;
  margin-bottom: 3px;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      width: 100%;
      height: unset;
      font-size: ${Theme.FONT_SIZE_SM}
    }
  }
`
  
export const OverlayInput = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`