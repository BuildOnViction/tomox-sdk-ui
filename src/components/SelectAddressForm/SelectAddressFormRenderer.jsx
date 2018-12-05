// @flow
import React from 'react';

import PathSelector from '../PathSelector';
import ArrowLeftIcon from '../Icons/ArrowLeftIcon';
import ArrowRightIcon from '../Icons/ArrowRightIcon';

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
    return <div>
            <div className="path-list">
                <div>Select HD derivation path</div>
                <PathSelector dPath={props.dPath} handleSelectPath={props.handleSelectPath} />
            </div>
            <ul className="address-list">
                {props.currentAddresses.map(address => {
                    return <li key={address.addressString} onClick={() => props.handleSelectAddress(address)}>
                            {address.addressString}
                        </li>;
                })}
            </ul>
            <div className="address-list-navigation">
                <a className={'previous ' + (props.isFirstList ? 'disabled' : '')} onClick={props.getPreAddress}>
                    <ArrowLeftIcon />
                    <span>Previous Addresses</span>
                </a>
                <a className="next" onClick={props.getMoreAddress}>
                    <span>More Addresses</span>
                    <ArrowRightIcon />
                </a>
            </div>
        </div>;
};

export default SelectAddressFormRenderer;
