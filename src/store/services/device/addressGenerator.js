import { publicToAddress } from "ethereumjs-util"
import HDKey from "hdkey"
import BigNumber from 'bignumber.js'

import { fetchTomoBalance } from "../api/engine"

export default class AddressGenerator {

    constructor(data) {
        this.hdk = new HDKey()
        this.hdk.publicKey = new Buffer(data.publicKey, 'hex')
        this.hdk.chainCode = new Buffer(data.chainCode, 'hex')
    }

    getAddressString(index) {
        const derivedKey = this.hdk.derive(`m/${index}`)
        const address = publicToAddress(derivedKey.publicKey, true)
        const addressString = '0x' + address.toString('hex')
        return addressString
    }

    getAddresses = async (offset = 0, limit = 5) => {
        try {          
            const getBalancePromises = []
        
            for (let index = offset; index < offset + limit; index++) {
                const addressString = this.getAddressString(index)
        
                const address = {
                    addressString,
                    index,
                    balance: -1,
                }
        
                getBalancePromises.push(this.getBalance(address))
            }
        
            const addressesWithBalance = await Promise.all(getBalancePromises)    
            return addressesWithBalance
        } catch(e) {
            throw e
        }
    }

    getBalance = async (address: Object, index: number) => {
        const result = await fetchTomoBalance(address.addressString)
        address.balance = BigNumber(result.balance).toFixed(3)    
        return address
    }
}
