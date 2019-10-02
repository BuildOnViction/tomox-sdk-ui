import React from 'react'
import styled from 'styled-components'
import { TmColors } from './Colors'

const Highlight = (props) => (
  <Content color={props.color} fontWeight={props.fontWeight}>{props.children}</Content>
)

const Content = styled.span`
  color: ${props => props.color || TmColors.ORANGE};
  font-weight: ${props => props.fontWeight || 'normal'};
`

export default Highlight
