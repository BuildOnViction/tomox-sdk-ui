import React from 'react'
import styled from 'styled-components'
import {
    Popover,
    Position,
    Icon,
} from '@blueprintjs/core'
import { Link } from 'react-router-dom'

import { Theme, TmColors } from '../Common'

export default function DappSwitchProduct({ link, title }) {
    return (
        <SwitchPopover
            content={<StyledLink to={link}>{title}</StyledLink>}
            position={Position.BOTTOM_LEFT}
            minimal
        >
            <SwapBtn icon="swap-horizontal" iconSize="12" />
        </SwitchPopover>
    )
}

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
  color: ${TmColors.ORANGE};
  font-size: ${Theme.FONT_SIZE_SM};
  background-color: #394362;
  padding: 7px 10px;
`