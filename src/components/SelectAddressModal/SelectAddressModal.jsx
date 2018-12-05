// @flow
import React from "react";
import Modal from "../Modal";
import SelectAddressFormContainer from "../SelectAddressForm";

type Props = {
    title: string,
    isOpen: boolean,
    handleClose: (SyntheticEvent<>) => void,
    walletType: string,
    currentAddresses: Array,
    currentDPath: string
};

const SelectAddressModal = (props: Props) => (
    <Modal
        title={props.title}
        icon="info-sign"
        isOpen={props.isOpen}
        onClose={props.handleClose}
    >
        <SelectAddressFormContainer
            walletType={props.walletType}
            currentAddresses={props.currentAddresses}
            currentDPath={props.currentDPath}
        />
    </Modal>
);

export default SelectAddressModal;
