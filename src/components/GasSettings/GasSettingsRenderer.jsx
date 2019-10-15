import React from 'react'
import { Collapse, InputGroup } from '@blueprintjs/core'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { TmColors } from '../Common'

type Props = {
  visible: boolean,
  gas: string,
  gasPrice: string,
  toggleVisible: (SyntheticEvent<>) => void,
  handleChange: (SyntheticInputEvent<>) => void
}

const GasSettingsRenderer = (props: Props) => {
  const { visible, gas, gasPrice, handleChange, toggleVisible } = props
  return (
    <div>
      <ButtonMinimal onClick={toggleVisible}><FormattedMessage id="portfolioPage.showGasSetting" /></ButtonMinimal>

      <Collapse isOpen={visible}>
        <InputGroupWrapper type="number" placeholder="Gas" name="customGas" value={gas || ''} onChange={handleChange} />
        <InputGroupWrapper
          type="number"
          placeholder="Gas Price"
          name="customGasPrice"
          value={gasPrice || ''}
          onChange={handleChange}
        />
      </Collapse>
    </div>
  )
}

const InputGroupWrapper = styled(InputGroup)`
  margin: 5px 0 7px;
  .bp3-input {
    color: ${TmColors.LIGHT_GRAY};
    height: 40px;
    background-color: ${TmColors.BLACK};
  }
`

const ButtonMinimal = styled.span`
  display: inline-block;
  cursor: pointer
  &:hover {
    color: ${TmColors.ORANGE};
  }
`

export default GasSettingsRenderer
