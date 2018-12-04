// @flow
import React from "react";

type Props = {
    getAddress: () => void
};

const SelectAddressFormRenderer = (props: Props) => {
    return (
        <ul className="address-list">
            {
                props.currentAddresses.map((address, index) => {
                    return (
                        <li key={address.addressString} onClick={() => props.getAddress(address)}>{address.addressString}</li>
                    )
                })
            }
        </ul>
    )
};

export default SelectAddressFormRenderer;
