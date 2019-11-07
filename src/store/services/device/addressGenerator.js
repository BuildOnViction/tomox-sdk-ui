import { publicToAddress } from "ethereumjs-util"
import HDKey from "hdkey"

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

}
