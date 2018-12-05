// @flow
import React from 'react';
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
        <div>
            <div className="path-list">
                <div>Select HD derivation path</div>
                <PathSelector
                    dPath={props.dPath}
                    handleSelectPath={props.handleSelectPath}
                />
            </div>
            <ul className="address-list">
                {props.currentAddresses.map(address => {
                    return (
                        <li
                            key={address.addressString}
                            onClick={() => props.handleSelectAddress(address)}
                        >
                            {address.addressString}
                        </li>
                    );
                })}
            </ul>
            <div className="address-list-navigation">
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
            </div>
        </div>
    );
};

export default SelectAddressFormRenderer;
