// @flow
import React from 'react';
import styled from 'styled-components';
import { AnchorButton, Intent } from '@blueprintjs/core';

import PathSelector from '../PathSelector';

type Props = {
    isFirstList: boolean,
    dPath: Array<any>,
    currentAddresses: Array<any>,
    handleSelectPath: () => Promise<void>,
    handleSelectAddress: () => void,
    getPreAddress: () => void,
    getMoreAddress: () => void
};

const SelectAddressFormRenderer = (props: Props) => {
    return (
        <SelectAddressFormBody>
            <PathList>
                <PathListMessage>Select HD derivation path</PathListMessage>
                <PathSelector
                    dPath={props.dPath}
                    handleSelectPath={props.handleSelectPath}
                />
            </PathList>
            <AddressList>
                <AddressListMessage>
                    Select the address you would like to use
                </AddressListMessage>
                {props.currentAddresses.map(address => {
                    return (
                        <AddressListItem
                            key={address.addressString}
                            onClick={() => props.handleSelectAddress(address)}
                        >
                            {address.addressString}
                            <AnchorButton
                                text="Import"
                                rightIcon="chevron-right"
                                intent={Intent.WARNING}
                            />
                        </AddressListItem>
                    );
                })}
            </AddressList>
            <AddressListNavigation>
                <AnchorButton
                    text="Previous Addresses"
                    icon="circle-arrow-left"
                    large
                    minimal
                    intent={Intent.WARNING}
                    disabled={props.isFirstList}
                    onClick={props.getPreAddress}
                />
                <AnchorButton
                    text="More Addresses"
                    rightIcon="circle-arrow-right"
                    large
                    minimal
                    intent={Intent.WARNING}
                    onClick={props.getMoreAddress}
                />
            </AddressListNavigation>
        </SelectAddressFormBody>
    );
};

const SelectAddressFormBody = styled.div`
    margin: 2rem 5rem 0;
`;

const PathList = styled.div`
    margin-bottom: 2rem;
`;

const PathListMessage = styled.p`
    font-weight: bold;
    font-size: 1.2rem;
    color: ##686868;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
`;

const AddressList = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
`;

const AddressListMessage = styled.p`
    font-weight: bold;
    font-size: 1.2rem;
    color: ##686868;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
`;

const AddressListItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
`;

const AddressListNavigation = styled.div`
    display: flex;
    justify-content: space-between;
`;

export default SelectAddressFormRenderer;
