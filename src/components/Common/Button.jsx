import styled from 'styled-components'
import Colors, { Theme } from './Colors'
import { Button } from '@blueprintjs/core'


export const BlueGlowingButton = styled(Button)`
  box-shadow: ${"0 3px 20px " + Colors.BLUE1 + "!important;"}
  &hover: {
    background-color: ${Colors.BLUE5}
    box-shadow: ${"0 3px 20px " + Colors.BLUE5 + "!important;"}
  }
`

export const GreenGlowingButton = styled(Button)`
  box-shadow: ${"0 3px 20px " + Colors.GREEN1 + "!important;"}
  &hover: {
    background-color: ${Colors.GREEN5}
    box-shadow: ${"0 3px 20px " + Colors.GREEN5 + "!important;"}
  }
`

export const RedGlowingButton = styled(Button)`
    box-shadow: ${"0 3px 20px " + Colors.RED1 + "!important;"}
  &hover: {
    background-color: ${Colors.RED5}
    box-shadow: ${"0 3px 20px " + Colors.RED5 + "!important;"}
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: ${props => props.justify ? props.justify : 'space-between'};
  align-items: ${props => props.align ? props.align : 'center'};
`

export const BaseButton = styled(Button)`
  width: ${props => props.width ? props.width : 'unset'};
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  color: #fff !important;
  box-shadow: none !important;
  background-image: none !important;

  @media only screen and (max-width: 680px) {
    .tomo-wallet & {
      font-size: ${Theme.FONT_SIZE_SM};
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
  }
`

export const CancelButton = styled(BaseButton)`
  background-color: #3f4a67 !important;
  &:hover {
      background-color: #333c54 !important;
  }
`

export const AcceptButton = styled(BaseButton)`
  color: #18454e !important
  background-color: #00e8b5 !important;
  &:hover {
      background-color: #00c59a !important;
  }
`
