// @flow
import React from 'react'
// import Modal from '../Modal'
import { Dialog } from '@blueprintjs/core'
import SelectAddressFormContainer from '../SelectAddressForm'

type Props = {
    title: string,
    isOpen: boolean,
    handleClose: (SyntheticEvent<>) => void,
    deviceService: any
}

const SelectAddressModal = (props: Props) => (
    <Dialog
        title={props.title}
        isOpen={props.isOpen}
        canOutsideClickClose={false}
        onClose={props.handleClose}
        className="dark-dialog"
    >
        <SelectAddressFormContainer deviceService={props.deviceService} />
    </Dialog>
)

export default SelectAddressModal
