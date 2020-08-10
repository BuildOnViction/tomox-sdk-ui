import React, { useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import WAValidator from 'wallet-address-validator'
import BigNumber from 'bignumber.js'

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
    hash,
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

    const [receiverAddress, setReceiverAddress] = useState('')
    const [withdrawalAmount, setWithdrawalAmount] = useState('')
    const [withdrawalAmountWithoutFee, setWithdrawalAmountWithoutFee] = useState('')
    const [error, setError] = useState({ address: 'invalid', amount: 'invalid' })
    const [dirty, setDirty] = useState({ address: false, amount: false })

    function validateReceiverAddress(address) {
        let symbol = selectedToken.symbol

        if (symbol === 'USDT') symbol = 'ETH'

        try {
            return WAValidator.validate(address, symbol)
        } catch (error) {
            console.log(error)
            return true
        }
    }

    function validateAmount(value) {
        const { availableBalance, minimumWithdrawal } = selectedToken

        return !(!value 
            || Number(value) > Number(availableBalance)
            || Number(value) < Number(minimumWithdrawal)
            || Number(minimumWithdrawal) > Number(availableBalance))
    }

    function handleChangeInput(e) {
        const { name, value } = e.target
        const { withdrawFee } = selectedToken
        
        if (name === 'address') {
            setReceiverAddress(value)
            setDirty({ ...dirty, address: true })          
            !validateReceiverAddress(value) 
                ? setError({ ...error, address: 'invalid' })
                : setError({ ...error, address: 'valid' })  
        } else {
            setDirty({ ...dirty, amount: true })
            if (!validateAmount(value)) {
                setError({ ...error, amount: 'invalid' })
                setWithdrawalAmountWithoutFee('')
                setWithdrawalAmount(value)
                return
            }
            
            const withdrawalAmountWithoutFee = BigNumber(value).minus(withdrawFee).toFormat(8)
            setWithdrawalAmountWithoutFee(withdrawalAmountWithoutFee)
            setWithdrawalAmount(value)
            setError({ ...error, amount: 'valid' })
        }
    }

    function resetState() {
        setError({ address: 'invalid', amount: 'invalid' })
        setDirty({ address: false, amount: false })
        setReceiverAddress('')
        setWithdrawalAmountWithoutFee('')
        setWithdrawalAmount('')
    }

    function handleChangeToken(token) {
        if (token.symbol === selectedToken.symbol) return

        resetState()

        setSelectedToken(token)
        history.push(`/wallet/withdraw/${token.symbol}`)
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

    useEffect(() => {        
        resetState()
    }, [hash])

    function handleChangePage(page) {        
        setCurrentPage(page)
    }

    function withdrawMaxAmount() {
        const { availableBalance, withdrawFee } = selectedToken
        if (!validateAmount(availableBalance)) return
        
        const withdrawalAmountWithoutFee = BigNumber(availableBalance).minus(withdrawFee).toFormat(8)
        setWithdrawalAmountWithoutFee(withdrawalAmountWithoutFee)
        setWithdrawalAmount(availableBalance)
        setDirty({ ...dirty, amount: true })
        setError({ ...error, amount: 'valid' })
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
                dirty={dirty}
                total={total}
                handleChangePage={handleChangePage}
                hash={hash}
                withdrawMaxAmount={withdrawMaxAmount}
            />
}