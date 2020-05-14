import styled from 'styled-components'
import {TmColors} from './index'

const SideIcon = styled.span`
  display: inline-block;
  height: 12px;
  width: 12px;
  margin-right: 5px;
  border-radius: 1px;
  position: relative;
  background-color: ${props => props.side.toUpperCase() === 'BORROW' ? TmColors.GREEN : TmColors.RED};

  &::before {
    content: '${props => props.side.toUpperCase() === 'BORROW' ? 'B' : 'L'}';
    position: absolute;
    top: 1px;
    left: 0;
    bottom: 0;
    right: 0;
    font-size: 10px;
    font-weight: 700;
    color: ${TmColors.WHITE};
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

export default SideIcon 