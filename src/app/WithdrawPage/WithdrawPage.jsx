import React, { useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import WAValidator from 'wallet-address-validator'

import WithdrawPageRenderer from './WithdrawPageRenderer'

export default function WithdrawPage({ 
    userAddress, 
    tokens, 
    getBridgeTokenConfig, 
    authenticated,
    history,
    withdrawToken,
    getBridgeWithdrawHistory,
    withdrawHistory,
    total,
}) {
    if (!authenticated) return <Redirect to="/unlock" />

    const { token: tokenParam } = useParams()
    let defaultToken = tokens.find(token => token.symbol.toLowerCase() === tokenParam.toLowerCase())
    defaultToken = defaultToken || tokens[0]
    const [selectedToken, setSelectedToken] = useState(defaultToken)

    useEffect(() => {
        getBridgeTokenConfig()
    }, [tokens.length])

    useEffect(() => {
        const updatedToken = tokens.find(token => token.mainAddress && (token.address.toLowerCase() === selectedToken.address.toLowerCase()))
        if (updatedToken) setSelectedToken(updatedToken)
    })

    function handleChangeToken(token) {
        setSelectedToken(token)
        history.push(`/wallet/withdraw/${token.symbol}`)
    }

    const [receiverAddress, setReceiverAddress] = useState('')
    const [withdrawalAmount, setWithdrawalAmount] = useState('')
    const [withdrawalAmountWithoutFee, setWithdrawalAmountWithoutFee] = useState('')
    const [error, setError] = useState({ address: 'invalid', amount: 'invalid' })

    function validateReceiverAddress(address) {
        let symbol = selectedToken.symbol

        if (symbol === 'USDT') symbol = 'ETH'

        try {
            return WAValidator.validate(address, selectedToken.symbol)
        } catch (error) {
            console.log(error)
            return true
        }
    }

    function handleChangeInput(e) {
        const { name, value } = e.target
        const { availableBalance, minimumWithdrawal, withdrawFee } = selectedToken
        
        if (name === 'address') {
            setReceiverAddress(value)            
            !validateReceiverAddress(value) 
                ? setError({ ...error, address: 'invalid' })
                : setError({ ...error, address: 'valid' })  
        } else {
            if (!value 
                || Number(value) > Number(availableBalance)
                || Number(value) < Number(minimumWithdrawal)
                || Number(minimumWithdrawal) > Number(availableBalance)) {
                setError({ ...error, amount: 'invalid' })
                setWithdrawalAmountWithoutFee('')
                setWithdrawalAmount(value)
                return
            }
            
            const withdrawalAmountWithoutFee = Number(value) - Number(withdrawFee)
            setWithdrawalAmountWithoutFee(withdrawalAmountWithoutFee)
            setWithdrawalAmount(value)
            setError({ ...error, amount: 'valid' })
        }
    }

    function handleWithdrawal() {
        withdrawToken({
            contractAddress: selectedToken.wrapperAddress, 
            receiverAddress, 
            withdrawalAmount, 
            tokenDecimals: selectedToken.decimals,
        })
    }

    
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        if (window.withdrawalTimer) clearInterval(window.withdrawalTimer)

        if (currentPage === 1) {
            getBridgeWithdrawHistory(userAddress, currentPage, 5)
            window.withdrawalTimer = setInterval(() => getBridgeWithdrawHistory(userAddress, currentPage, 5), 5000)
        } else {
            getBridgeWithdrawHistory(userAddress, currentPage, 5)
        }

        return function cleanup() {
            if (window.withdrawalTimer) clearInterval(window.withdrawalTimer)
        }
    }, [currentPage])

    function handleChangePage(page) {        
        setCurrentPage(page)
    }

    return <WithdrawPageRenderer 
                token={selectedToken}
                tokens={tokens}
                handleChangeToken={handleChangeToken}
                handleChangeInput={handleChangeInput}
                handleWithdrawal={handleWithdrawal}
                withdrawHistory={withdrawHistory}
                receiverAddress={receiverAddress}
                withdrawalAmount={withdrawalAmount}
                withdrawalAmountWithoutFee={withdrawalAmountWithoutFee}
                error={error}
                total={total}
                handleChangePage={handleChangePage}
            />
}