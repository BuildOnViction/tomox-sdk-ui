// Reference: https://scotch.io/tutorials/password-strength-meter-in-react
import React from 'react'
import styled from 'styled-components'
import zxcvbn from 'zxcvbn'
import { FormattedMessage } from 'react-intl'

export const PasswordStrengMeter = props => {
    const { password } = props

    if (!password) return (<div></div>)
    const strength = zxcvbn(password).score

    return (
        <React.Fragment>
            <StrengMeter password={password}>
                <StrengMeterFill data-strength={strength} />
            </StrengMeter>
            {(strength < 3) && (<Message><FormattedMessage id="createWalletPage.passwordStep.measureResult" /></Message>)}
        </React.Fragment>
    )
}

const StrengMeter = styled.div`
    position: relative;
    height: 3px;
    background: #d8d8d8;
    margin: 7px 0;
    border-radius: 2px;

    // Dynamically create the gap effect
    &:before,
    &:after {
        content: '';
        height: inherit;
        background: transparent;
        display: block;
        border-color: #252C40;
        border-style: solid;
        border-width: 0 10px 0;
        position: absolute;
        width: calc(20% + 10px);
        z-index: 10;
    }

    &:before {
        left: calc(20% - 10px / 2);
    }

    &:after {
        right: calc(20% -  10px / 2);
    }
`

const StrengMeterFill = styled.div`
    background: transparent;
    height: inherit;
    position: absolute;
    width: 0;
    border-radius: inherit;
    transition: width 0.5s ease-in-out, background 0.25s;

    &[data-strength='0'] {
        width: calc(20% * 0);
        background: #ff9a4d;
    }

    &[data-strength='1'] {
        width: calc(20% * 1);
        background: #ff9a4d;
    }

    &[data-strength='2'] {
        width: calc(20% * 2);
        background: #ff9a4d;
    }

    &[data-strength='3'] {
        width: calc(20% * 3);
        background: #ff9a4d;
    }

    &[data-strength='4'] {
        width: calc(20% * 4);
        background: #ff9a4d;
    }
`

const Message = styled.div`
    font-size: 12px;
    color: #ff9a4d;
    margin-top: 5px;
`