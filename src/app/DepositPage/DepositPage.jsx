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

    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        if (window.depositTimer) clearInterval(window.depositTimer)

        if (currentPage === 1) {
            getBridgeDepositHistory(userAddress, currentPage, 5)
            window.depositTimer = setInterval(() => getBridgeDepositHistory(userAddress, currentPage, 5), 5000)
        } else {
            getBridgeDepositHistory(userAddress, currentPage, 5)
        }

        return function cleanup() {
            if (window.depositTimer) clearInterval(window.depositTimer)
        }
    }, [currentPage])

    function handleChangePage(page) {        
        setCurrentPage(page)
    }

    return <DepositPageRenderer 
                token={selectedToken}
                tokens={tokens}
                handleChangeToken={handleChangeToken}
                copyDataSuccess={copyDataSuccess}
                depositHistory={depositHistory}
                updateCurrentPair={updateCurrentPair}
                total={total}
                handleChangePage={handleChangePage}
            />
}