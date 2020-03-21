import React from 'react'
import { Button } from '@blueprintjs/core'

import Modal from '../../Modal'

export default function RepayModal(props) {
    return (
        <Modal {...props}>
            <p>Note: you are repaying your borrowing before the pay-off date, it could make you have to imposed more 1&#37; fee</p>
            <p>Total repay amount: USDT</p>
            <div>
                <Button text="No, let me pay later" />
                <Button text="Yes, I want to repay you" />
            </div>
        </Modal>
    )
}