// @flow
import React from 'react';
import Modal from '../Modal';
import SelectAddressFormContainer from '../SelectAddressForm';

type Props = {
    title: string,
    isOpen: boolean,
    handleClose: (SyntheticEvent<>) => void,
    deviceService: any
};

const SelectAddressModal = (props: Props) => (
    <Modal
        title={props.title}
        icon="info-sign"
        isOpen={props.isOpen}
        onClose={props.handleClose}
    >
        <SelectAddressFormContainer deviceService={props.deviceService} />
    </Modal>
);

export default SelectAddressModal;
