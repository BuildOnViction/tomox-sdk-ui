import React from "react"
import styled from "styled-components"

import { UtilityIcon } from "../Common"

const IncreaseAndDecreaseGroup = props => {
  const {
    type,
    onDecreasePrice,
    onIncreasePrice,
    onDecreaseAmount,
    onIncreaseAmount,
  } = props

  if (type === "price") {
    return (
      <IncreaseAndDecreaseBox>
        <IncreaseAndDecreaseButton onMouseDown={onIncreasePrice}>
          <UtilityIcon name="arrow-up" />
        </IncreaseAndDecreaseButton>
        <IncreaseAndDecreaseButton onMouseDown={onDecreasePrice}>
          <UtilityIcon name="arrow-down" />
        </IncreaseAndDecreaseButton>
      </IncreaseAndDecreaseBox>
    )
  }

  return (
    <IncreaseAndDecreaseBox>
      <IncreaseAndDecreaseButton onMouseDown={onIncreaseAmount}>
        <UtilityIcon name="arrow-up" />
      </IncreaseAndDecreaseButton>
      <IncreaseAndDecreaseButton onMouseDown={onDecreaseAmount}>
        <UtilityIcon name="arrow-down" />
      </IncreaseAndDecreaseButton>
    </IncreaseAndDecreaseBox>
  )
}

export default IncreaseAndDecreaseGroup

const IncreaseAndDecreaseBox = styled.div.attrs({
  className: "increase-decrease-box",
})`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  padding: 5px 0;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 2px;

  span:first-child {
    align-items: flex-end;
    padding-bottom: 3px;
  }

  span:last-child {
    align-items: flex-start;
    padding-top: 3px;
  }

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      display: none;
    }
  }
`

const IncreaseAndDecreaseButton = styled.span`
  display: flex;
  justify-content: center;
  width: 15px;
  height: 50%;
  cursor: pointer;
`
