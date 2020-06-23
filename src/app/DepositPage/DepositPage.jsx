import React, { useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'

import DepositPageRenderer from './DepositPageRenderer'

export default function Deposit({ 
    userAddress, 
    tokens, 
    getBridgeTokenConfig, 
    getBridgeDepositAddress,
    copyDataSuccess,
    getBridgeDepositHistory,
    depositHistory,
    authenticated,
    updateCurrentPair,
    history,
}) {
    if (!authenticated) return <Redirect to="/unlock" />

    const { token: tokenParam } = useParams()
    const [selectedToken, setSelectedToken] = useState(tokens[0])

    useEffect(() => {
        if (!tokenParam || (tokenParam.toLowerCase() === selectedToken.symbol.toLowerCase())) return

        let defaultToken = tokens.find(token => token.symbol.toLowerCase() === tokenParam.toLowerCase())
        defaultToken = defaultToken || tokens[0]
        setSelectedToken(defaultToken)
    })

    useEffect(() => {
        getBridgeTokenConfig()

        getBridgeDepositHistory(userAddress)
        const depositTimer = setInterval(() => getBridgeDepositHistory(userAddress), 5000)

        return function cleanup() {
            clearInterval(depositTimer)
        }
    }, [tokens.length])

    useEffect(() => {
        getBridgeDepositAddress({ receiveAddress: userAddress, wrapCoin: selectedToken.symbol })
    }, [selectedToken.address])

    useEffect(() => {
        const updatedToken = tokens.find(token => token.mainAddress && (token.address.toLowerCase() === selectedToken.address.toLowerCase()))
        if (updatedToken) setSelectedToken(updatedToken)
    })

    function handleChangeToken(token) {
        setSelectedToken(token)
        history.push(`/wallet/deposit/${token.symbol}`)
    }

    return <DepositPageRenderer 
                token={selectedToken}
                tokens={tokens}
                handleChangeToken={handleChangeToken}
                copyDataSuccess={copyDataSuccess}
                depositHistory={depositHistory}
                updateCurrentPair={updateCurrentPair}
            />
}