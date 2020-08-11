import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import DappDepositContentRenderer from './DappDepositContentRenderer'

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
    total,
}) {    
    if (!authenticated) return <Redirect to="/unlock" />

    const defaultToken = tokens[0]
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
    }

    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        getBridgeDepositHistory(userAddress, currentPage, 5)
    }, [currentPage])

    function handleChangePage(page) {        
        setCurrentPage(page)
    }

    return <DappDepositContentRenderer 
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