import React from 'react'
import styled from 'styled-components'
import { TmColors } from './Colors'

const Link = (props) => (
  <AStyled {...props}>{props.children}</AStyled>
)

const AStyled = styled.a`
    color: ${props => props.color || props.theme.linkText};

    &:hover {
        color: ${TmColors.DARK_ORANGE};
    }
`

export default Link
