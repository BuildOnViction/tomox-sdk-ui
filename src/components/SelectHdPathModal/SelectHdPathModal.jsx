import React from 'react'
import styled from 'styled-components'

import { Button, Dialog, MenuItem, Spinner } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { SmallText, TmColors, ButtonLogin } from '../../components/Common'

class SelectHdPathModal extends React.PureComponent {

    render() {
      const { 
        isOpen, 
        onClose,
        onHdPathChange,
        hdPaths,
        indexActive,
        error,
        errorList,
        connect,
        loading,
        subTitleId,
        instructionId,
      } = this.props
  
      return (
        <Dialog
          className="dark-dialog"
          onClose={onClose}
          title={<FormattedMessage id="unlockWalletPage.chooseHdPathModal.title" />}
          canOutsideClickClose={false}
          isOpen={isOpen}>
  
          {subTitleId && <SubTitle><FormattedMessage id={subTitleId} /></SubTitle>}
  
          <SelectHdPath
            items={hdPaths}
            itemRenderer={renderHdPath}
            popoverProps={{ minimal: true, popoverClassName: 'hd-path-tooltip', portalClassName: 'hd-path-tooltip-wrapper' }}
            noResults={<MenuItem disabled text="No results." />}
            filterable={false}
            onActiveItemChange={onHdPathChange}>
              <Button text={`${hdPaths[indexActive].rank}. ${hdPaths[indexActive].path} - ${hdPaths[indexActive].type}`} rightIcon="caret-down" />
          </SelectHdPath>

          {instructionId && <Instruction><FormattedHTMLMessage id={instructionId} /></Instruction>}
          {error && (
            <React.Fragment>
              <ErrorMessage>{errorList[error.statusCode || error.name]}</ErrorMessage>
              <ErrorMessage><FormattedMessage id="unlockWalletPage.chooseHdPathModal.errorContract" /></ErrorMessage>
            </React.Fragment>
          )}

          <ButtonLogin width="30%" onClick={connect}>Next {loading && <Spinner intent="PRIMARY" size={Spinner.SIZE_SMALL} />}</ButtonLogin>
        </Dialog>
      )
    }
}

const renderHdPath = (hdPath, { handleClick, modifiers, query }) => {
    const text = `${hdPath.rank}. ${hdPath.path} - ${hdPath.type}`
  
    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={hdPath.rank}
            onClick={handleClick}
            text={text}
            className="hd-path-item"
        />
    )
}


const SubTitle = styled.div`
  margin: 0 0 12px;
`

const Instruction = styled(SmallText)`
  color: ${TmColors.GRAY};
  margin-bottom: 12px;
  line-height: 20px;

  strong {
    color: ${TmColors.LIGHT_GRAY};
  }
`

const SelectHdPath = styled(Select)`
  margin-bottom: 12px;

  .bp3-popover-target {
    width: 100%;
  }

  .bp3-button {
    height: 40px;
    width: 100%;
    border-radius: 0;
  }
`

const ErrorMessage = styled.div`
  color: ${TmColors.RED};
  font-size: 12px;
  margin-bottom: 5px;
`

export default SelectHdPathModal