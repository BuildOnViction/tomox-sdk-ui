// @flow
import React from 'react';

import ArrowLeftIcon from '../Icons/ArrowLeftIcon';
import ArrowRightIcon from '../Icons/ArrowRightIcon';

type Props = {
    isFirstList: boolean,
    currentAddresses: Array<any>,
    getAddress: () => void,
    getPreAddress: () => Array<string>,
    getMoreAddress: () => Array<string>
};

const SelectAddressFormRenderer = (props: Props) => {
    return (
        <div>
            <ul className="address-list">
                {props.currentAddresses.map((address, index) => {
                    return (
                        <li
                            key={address.addressString}
                            onClick={() => props.getAddress(address)}
                        >
                            {address.addressString}
                        </li>
                    );
                })}
            </ul>
            <div className="address-list-navigation">
                <a
                    className={'previous ' + (props.isFirstList ? 'disabled' : '')}
                    onClick={props.getPreAddress}
                >
                    <ArrowLeftIcon />
                    <span>Previous Addresses</span>
                </a>
                <a className="next" onClick={props.getMoreAddress}>
                    <span>More Addresses</span>
                    <ArrowRightIcon />
                </a>
            </div>
        </div>
    );
};

export default SelectAddressFormRenderer;
