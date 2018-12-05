// @flow
import React from 'react';

type Props = {
    isFirstList: boolean,
    getAddress: () => void,
    getPreAddress: () => Array,
    getMoreAddress: () => Array
};

const SelectAddressFormRenderer = (props: Props) => {
    return (
        <div>
            <ul className='address-list'>
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
            {/* <div class='address-list-navigation'>
                <a
                    class={'previous ' + (props.isFirstList ? 'disabled' : '')}
                    onClick={props.getPreAddress}
                >
                    <img
                        alt='Previous Addresses'
                        src={require('../../../assets/img/import-account/arrows_left_icon.svg')}
                    />
                    <span>Previous Addresses</span>
                </a>
                <a class='next' onClick={props.getMoreAddress}>
                    <span>More Addresses</span>
                    <img
                        alt='More Addresses'
                        src={require('../../../assets/img/import-account/arrows_right_icon.svg')}
                    />
                </a>
            </div> */}
        </div>
    );
};

export default SelectAddressFormRenderer;
