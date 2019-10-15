// @flow
import React from 'react'
import styled from 'styled-components'

import { TmColors } from '../../components/Common'
import PathSelector from '../PathSelector'

type Props = {
    isFirstList: boolean,
    dPath: Array<any>,
    currentAddresses: Array<any>,
    handleSelectPath: (string) => Promise<void>,
    handleSelectAddress: any => void,
    getPreAddress: () => void,
    getMoreAddress: () => void
}

const SelectAddressFormRenderer = (props: Props) => {
    return (
        <SelectAddressFormBody>
            <PathList>
                <PathListMessage>Select HD derivation path:</PathListMessage>
                <PathSelector
                    dPath={props.dPath}
                    handleSelectPath={props.handleSelectPath}
                />
            </PathList>
            <AddressList>
                <AddressListMessage>
                    Select the address you would like to use:
                </AddressListMessage>
                {props.currentAddresses.map(address => {
                    if (address && address.addressString) {
                        return (
                            <AddressListItem
                                key={address.addressString}
                                onClick={() =>
                                    props.handleSelectAddress(address)
                                }
                            >
                                <Address>
                                    {address.addressString}
                                </Address>
                                <Balance>{address.balance} TOMO</Balance>
                            </AddressListItem>
                        )
                    }

                    return null
                })}
            </AddressList>

            <NavigatorBox>
                <NavigatorItem onClick={props.getPreAddress}>&lt; Previous</NavigatorItem> 
                <NavigatorItem onClick={props.getMoreAddress}>Next &gt;</NavigatorItem>
            </NavigatorBox>
        </SelectAddressFormBody>
    )
}

const SelectAddressFormBody = styled.div``

const PathList = styled.div`
    margin-bottom: 2rem;
`

const PathListMessage = styled.p``

const AddressList = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
`

const AddressListMessage = styled.p``

const AddressListItem = styled.div`
    display: flex;
    padding: 8px;
    justify-content: space-between;
    cursor: pointer;

    &:nth-child(2n+1) {
        background-color: ${TmColors.BLACK};
    }

    &:hover {
        background-color: ${TmColors.BLUE};
    }
`

const Address = styled.span``

const Balance = styled.span``

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

export default SelectAddressFormRenderer
