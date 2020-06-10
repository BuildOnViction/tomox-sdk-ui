// @flow
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

export default function DappWelcome({togglePanel}) {
  return (
    <Wrapper>
      <Instruction><FormattedMessage id="dapp.instruction" /></Instruction>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`

const Instruction = styled.div`
  padding: 0 10px;
  text-align: center;
  line-height: 1.7em;
`





