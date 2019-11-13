import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Dialog } from '@blueprintjs/core'

import { TmColors, ButtonLogin} from '../../components/Common'

const SelectAddressModal = props => {

    const { 
        addressActive,
        addresses, 
        unlockWallet, 
        isOpenAddressesDialog, 
        onClose,
        nextAddresses,
        prevAddresses,
        chooseAddress,
    } = props

    return (
        <Dialog
            className="dark-dialog"
            onClose={onClose}
            title={<FormattedMessage id="unlockWalletPage.chooseAddressModal.title" />}
            canOutsideClickClose={false}
            isOpen={isOpenAddressesDialog}>

            {(addresses.length > 0) && (
            <React.Fragment>
                <Wrapper>
                    <div><FormattedMessage id="unlockWalletPage.chooseAddressModal.subTitle" /></div>
                    <ListBox addressActive={addressActive} addresses={addresses} chooseAddress={chooseAddress} />
                </Wrapper>

                <NavigatorBox>
                    <NavigatorItem onClick={prevAddresses}>&lt; <FormattedMessage id="unlockWalletPage.chooseAddressModal.previous" /></NavigatorItem> 
                    <NavigatorItem onClick={nextAddresses}><FormattedMessage id="unlockWalletPage.chooseAddressModal.next" /> &gt;</NavigatorItem>
                </NavigatorBox>

                <ButtonLogin disabled={!addressActive} onClick={unlockWallet}><FormattedMessage id="unlockWalletPage.unlockWallet" /></ButtonLogin>
            </React.Fragment>
            )}      
        </Dialog>
    )
}

const ListBox = (props) => {
    const { addressActive, addresses, chooseAddress } = props
  
    const Items = addresses.map((address) => {
  
      if (addressActive && addressActive.addressString === address.addressString) {
        return (
          <ItemActive key={ address.index }
            onClick={() => chooseAddress(address)}>
            <div>{address.index + 1}. {address.addressString}</div>
            <div>{address.balance}</div>
          </ItemActive>
        )
      }
  
      return (
        <Item key={ address.index }
          onClick={() => chooseAddress(address)}>
          <div>{address.index + 1}. {address.addressString}</div>
          <div>{address.balance}</div>
        </Item>
      )
    })
  
    return (
      <List>
        { Items }
      </List>
    )
}

const Wrapper = styled.div``

const List = styled.ul`
  height: 175px;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 10px;
`

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;
  font-family: monospace, sans-serif;

  &:nth-child(2n+1) {
    background-color: ${TmColors.BLACK};
  }

  &:hover {
    background-color: ${TmColors.BLUE};
  }
`

const ItemActive = styled(Item)`
  color: ${TmColors.ORANGE};
`

const NavigatorBox = styled.div`
  display: flex;
  justify-content: center;
`

const NavigatorItem = styled.span`
  margin: 0 10px;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: ${TmColors.ORANGE};
  }
`

export default SelectAddressModal