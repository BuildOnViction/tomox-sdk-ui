// @flow
import React from 'react';
import styled from 'styled-components';
import { AnchorButton, Intent } from '@blueprintjs/core';

import PathSelector from '../PathSelector';

type Props = {
    isFirstList: boolean,
    dPath: Array<any>,
    currentAddresses: Array<any>,
    handleSelectPath: (string) => Promise<void>,
    handleSelectAddress: any => void,
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
                    if (address && address.addressString) {
                        return (
                            <AddressListItem
                                key={address.addressString}
                                onClick={() =>
                                    props.handleSelectAddress(address)
                                }
                            >
                                <Address>
                                    {address.addressString.substring(0, 22)}
                                </Address>
                                <Balance>{address.balance} ETH</Balance>
                                <AnchorButton
                                    text="IMPORT"
                                    rightIcon="chevron-right"
                                    minimal
                                    intent={Intent.WARNING}
                                />
                            </AddressListItem>
                        );
                    }

                    return null;
                })}
            </AddressList>
            <AddressListNavigation>
                <AnchorButton
                    text="PREVIOUS ADDRESSES"
                    icon="circle-arrow-left"
                    large
                    minimal
                    intent={Intent.WARNING}
                    disabled={props.isFirstList}
                    onClick={props.getPreAddress}
                />
                <AnchorButton
                    text="MORE ADDRESSES"
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
    color: #d9d9d9;
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
    color: #d9d9d9;
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
    border-bottom: 1px solid #737373;
    &:hover {
        color: #fbde04;
        text-shadow: 0px 0px 30px #fdec6e;
        -moz-transition: all 0.2s ease-in;
        -o-transition: all 0.2s ease-in;
        -webkit-transition: all 0.2s ease-in;
        transition: all 0.2s ease-in;
    }
`;

const Address = styled.span`
    font-size: 1rem;
`;

const Balance = styled.span`
    font-size: 0.9rem;
    font-style: italic;
    font-weight: bold;
`;

const AddressListNavigation = styled.div`
    display: flex;
    justify-content: space-between;
`;

export default SelectAddressFormRenderer;
