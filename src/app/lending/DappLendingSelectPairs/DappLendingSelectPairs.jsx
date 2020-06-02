import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blueprintjs/core'
import { Theme } from '../../../components/Common'

import DappLendingTokenSearcher from '../../../components/lending/DappLendingTokenSearcher'

export default function DappLendingSelectPairs(props) {

  return (
    <TokenSearcherBoxMobile>
      <TokenSearcherTitle><FormattedMessage id="mainMenuPage.markets" /></TokenSearcherTitle>
      <Back icon="arrow-left" onClick={props.history.goBack} />
      <DappLendingTokenSearcher />
    </TokenSearcherBoxMobile>
  )
}

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

const Back = styled(Icon)`
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  padding: 10px;
`