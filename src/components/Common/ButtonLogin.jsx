import React from 'react' //eslint-disable-line
import styled from 'styled-components'
import { Button } from '@blueprintjs/core'

import { TmColors } from '../../components/Common'

const ButtonWrapper = styled(Button)`
  display: block;
  margin-top: ${props => props.margintop ? props.margintop : '45px'};
  margin-left: auto;
  margin-right: auto;
  width: ${props => props.width ? props.width : '100%'};
  text-align: center;
  color: ${TmColors.BLACK} !important;
  border-radius: 0;
  background-color: ${TmColors.ORANGE} !important;
  box-shadow: none !important;
  background-image: none !important;
  height: 40px;
  &:hover {
    background-color: ${TmColors.DARK_ORANGE} !important;
  }

  &.bp3-disabled {
    cursor: default !important;
    background-color: ${TmColors.GRAY} !important;
  }

  .bp3-spinner {
    display: inline-block;
    margin-left: 5px;
  }
`

export default ButtonWrapper