import React from "react"
import styled from "styled-components"
import { InputGroup, Label } from "@blueprintjs/core"

const FractionList = props => {
  const { side, fraction, onInputChange } = props

  return (
    <FractionListBox>
      <RadioButtonsWrapper>
        <RadioButton
          value={25}
          fraction={fraction}
          onInputChange={e => onInputChange(side, e)}
        />
        <RadioButton
          value={50}
          fraction={fraction}
          onInputChange={e => onInputChange(side, e)}
        />
        <RadioButton
          value={75}
          fraction={fraction}
          onInputChange={e => onInputChange(side, e)}
        />
        <RadioButton
          value={100}
          fraction={fraction}
          onInputChange={e => onInputChange(side, e)}
        />
      </RadioButtonsWrapper>
    </FractionListBox>
  )
}

const RadioButton = props => {
  const { onInputChange, value } = props
  return (
    <RadioButtonBox>
      <span>{value}%</span>
      <InputGroup
        name="fraction"
        type="radio"
        onClick={onInputChange}
        value={value}
      />
    </RadioButtonBox>
  )
}

export default FractionList

const FractionListBox = styled.div.attrs({
  className: "clearfix",
})``

const RadioButtonsWrapper = styled.div`
  width: calc(100% - 60px);
  margin-left: auto;
  display: flex;
  justify-content: space-between;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      width: 100%;
      padding-left: 0;
    }
  }
`

const RadioButtonBox = styled(Label)`
  display: flex !important;
  align-content: center;
  min-width: 35px;
  width: 15%;
  padding: 5px 0;
  text-align: center;
  cursor: pointer;
  margin-top: 0 !important;
  margin-bottom: 0 !important;

  input.bp3-input {
    opacity: 0;
    width: 0px;
    height: 0;
    margin: 0px;
  }

  .bp3-input-group {
    width: 0px;
    height: 0;
  }

  &:first-child {
    text-align: left;
  }

  &:last-child {
    text-align: right;
  }

  span {
    height: 17px;
    line-height: 17px;
  }

  &:hover span {
    color: ${props => props.theme.linkText};
  }
`
