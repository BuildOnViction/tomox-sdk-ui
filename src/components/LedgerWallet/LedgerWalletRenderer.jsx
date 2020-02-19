import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { TmColors, ButtonLogin, Link as ExternalLink } from '../../components/Common'
import TomoLogo from '../../assets/images/app_tomo_logo.svg'

const LedgerWalletRenderer = (props) => {
    const { 
      toggleSelectHdPathModal,
    } = props
  
    return (
        <WalletWrapper>
            <Title><FormattedMessage id="unlockWalletPage.ledger.instruction1" /></Title>
    
            <LedgerImageBox>       
                <LedgerImageBody>
                    <LedgerScreen>
                    <PasswordSymbol>******</PasswordSymbol>            
                    </LedgerScreen>
                    <LedgerCircle />
                </LedgerImageBody>
        
                <LedgerImageHead />
            </LedgerImageBox>
    
            <Title><FormattedMessage id="unlockWalletPage.ledger.instruction2" /></Title>
    
            <LedgerImageBox>       
                <LedgerImageBody>
                    <LedgerScreen>
                    <img src={TomoLogo} alt="app Tomo logo"/>          
                    </LedgerScreen>
                    <LedgerCircle />
                </LedgerImageBody>
        
                <LedgerImageHead />
            </LedgerImageBox>
    
            <InstructionBox>
                <ExternalLink href="https://support.ledger.com/hc/en-us/articles/115005165269-Fix-connection-issues" target="_blank" color={TmColors.ORANGE}><FormattedMessage id="unlockWalletPage.connectionIssues" /></ExternalLink>
                <ExternalLink href="https://www.ledger.com/start" target="_blank" color={TmColors.ORANGE}><FormattedMessage id="unlockWalletPage.instructions" /></ExternalLink>
            </InstructionBox>
    
            <ButtonLogin onClick={() => toggleSelectHdPathModal('open')}><FormattedMessage id="unlockWalletPage.ledger.buttonTitle" /></ButtonLogin>
    
        </WalletWrapper>   
    )
}

const WalletWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 395px;
    margin: 0 auto;
`

const Title = styled.div`
    text-align: ${props => props.textAlign ? props.textAlign : 'left'};
    color: ${props => props.color ? props.color : 'inherit'}
    cursor: ${props => props.cursor ? props.cursor : 'initial'};
`

const LedgerImageBox = styled.div`
    position: relative;
    padding-left: 16px;
    width: 162px;
    margin-top: 20px;
    margin-bottom: 40px;
`

const LedgerImageBody = styled.div`
    width: 146px;
    height: 41px;
    border-radius: 6px;
    background-color: ${TmColors.BLACK};
`

const LedgerImageHead = styled.div`
    width: 16px;
    height: 18px;
    background-color: ${TmColors.LIGHT_BLUE};
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);

    &::before,
    &::after {
        content: " ";
        width: 9px;
        height: 3px;
        display: inline-block;
        background-color: ${TmColors.BLACK};
        position: absolute;
        left: 4px;
        top: 4px;
    }

    &::after {
        top: 11px;
    }
`

const LedgerScreen = styled.div`
    width: 85px;
    height: 18px;
    text-align: center;
    background-color: ${TmColors.LIGHT_BLUE};
    position: absolute;
    left: 35px;
    top: 50%;
    transform: translateY(-50%);
`

const LedgerCircle = styled.div`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: ${TmColors.LIGHT_BLUE};
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 12px;
`

const PasswordSymbol = styled.span`
    display: inline-block;
    padding-top: 3px;
    color: ${TmColors.ORANGE};
`

const InstructionBox = styled.div`
  width: 100%;  
  display: flex;
  justify-content: space-between;
  margin-top: 13px;
`

export default LedgerWalletRenderer