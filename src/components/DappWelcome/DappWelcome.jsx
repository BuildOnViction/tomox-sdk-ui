// @flow
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { TmColors } from '../Common'

export default function DappWelcome({togglePanel}) {
  return (
    <Wrapper>
      <Instruction><FormattedMessage id="dapp.instruction" /></Instruction>
      <ExternalLinksGroup>
        <ExternalLink target="_blank" href="https://apps.apple.com/us/app/tomo-wallet/id1436476145">
          <i className="fa fa-apple" aria-hidden="true" />
          <FormattedMessage id="dapp.appStore" />
        </ExternalLink>
        <Divider><FormattedMessage id="dapp.or" /></Divider>
        <ExternalLink target="_blank" href="https://play.google.com/store/apps/details?id=com.tomochain.wallet&hl=en_US">
          <GoolgePlayIcon className="fa fa-android" aria-hidden="true" />
          <FormattedMessage id="dapp.googleStore" />
        </ExternalLink>
      </ExternalLinksGroup>
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

const ExternalLinksGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 15px;
`

const Divider = styled.div`
  margin: 10px auto;
`

const ExternalLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 70%;
  max-width: 250px;
  color: ${TmColors.WHITE};
  background: ${TmColors.LIGHT_BLUE};
  border-radius: 10px;

  i {
    margin-right: 5px;
  }
`

const GoolgePlayIcon = styled.i`
  color: ${TmColors.LIGHT_GREEN};
`



