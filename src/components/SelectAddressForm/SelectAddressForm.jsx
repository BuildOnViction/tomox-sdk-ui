// @flow
import React from "react";
import SelectAddressFormRenderer from "./SelectAddressFormRenderer";

type State = {};

type Props = {
    currentAddresses: Array,
    currentDPath: string
};

class SelectAddressForm extends React.PureComponent<Props, State> {
    state = {};

    getAddress = (formAddress) => {
        let data = {
            address: formAddress.addressString,
            type: this.props.walletType,
            path: this.props.currentDPath + '/' + formAddress.index,
        };

        this.props.getAddress(data);
    }

    render() {
        return <SelectAddressFormRenderer currentAddresses={this.props.currentAddresses} />;
    }
}

export default SelectAddressForm;
