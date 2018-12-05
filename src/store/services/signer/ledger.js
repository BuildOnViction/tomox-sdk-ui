import { Signer, providers, utils } from "ethers";
import LedgerEth from "@ledgerhq/hw-app-eth";

import { NETWORK_URL } from "../../../config/url";
import { addMethodsToSigner } from "./index";

const defaultDPath = "m/44'/60'/0'/0";

export class LedgerSigner extends Signer {
    constructor() {
        super();
        this.ledgerEth = new LedgerEth();
        const networkId = 8888;
        this.provider = new providers.JsonRpcProvider(NETWORK_URL, {
            chainId: networkId
        });
        window.signer = { instance: this, type: "hardwareWallet" };
        addMethodsToSigner(this);
    }

    getPublicKey = async (path = defaultDPath) => {
        let result = await this.ledgerEth.getAddress(path);
        if (result.publicKey) {
            return result.publicKey;
        } else {
            console.log(result);
            throw new Error(result);
        }
    };

    getAddress = async (path = defaultDPath) => {
        let result = await this.ledgerEth.getAddress(path);
        if (result.address) {
            return result.address;
        } else {
            console.log(result);
            throw new Error(result);
        }
    };

    // TODO
    signMessage = async message => {
        return 0;
    };

    sign = async transaction => {
        try {
            let tx = await utils.resolveProperties(transaction);
            let unsignedTx = utils.serializeTransaction(tx).substring(2);

            let signature = await this.ledgerEth.signTransaction(
                defaultDPath,
                unsignedTx
            );

            let sig = {
                v: signature.v,
                r: "0x" + signature.r,
                s: "0x" + signature.s
            };

            return utils.serializeTransaction(tx, sig);
        } catch (err) {
            console.log(err);
        }
    };

    sendTransaction = async transaction => {
        let signedTx = await this.sign(transaction);
        return this.provider.sendTransaction(signedTx);
    };
}
