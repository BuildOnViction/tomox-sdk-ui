// @flow
import React from "react";
import Modal from "../Modal";
import SelectAddressFormContainer from "../SelectAddressForm";

type Props = {
    title: string,
    isOpen: boolean,
    handleClose: (SyntheticEvent<>) => void
};

const SelectAddressModal = (props: Props) => (
    <Modal
        title={props.title}
        icon="info-sign"
        isOpen={props.isOpen}
        onClose={props.handleClose}
    >
        <SelectAddressFormContainer />
    </Modal>
);

export default SelectAddressModal;
