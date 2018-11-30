import { ethers, providers } from "ethers";
import TrezorConnect from "trezor-connect";

import { NETWORK_URL } from "../../../config/url";
import { addMethodsToSigner } from "./index";

const defaultDPath = "m/44'/60'/0'/0";

export class TrezorSigner extends ethers.Signer {
    constructor() {
        super();
        const networkId = 8888;
        this.provider = new providers.JsonRpcProvider(NETWORK_URL, {
            chainId: networkId,
            name: undefined
        });
        window.signer = { instance: this, type: "hardwareWallet" };
        addMethodsToSigner(this);
    }

    getPublicKey = (path = defaultDPath) => {
        return new Promise(async (resolve, reject) => {
            let result = await TrezorConnect.getPublicKey({
                path
            });
            if (result.success) {
                resolve(result.payload);
            } else {
                console.log(result);
                reject(result.payload.error);
            }
        });
    };

    getAddress = (path = defaultDPath) => {
        return new Promise(async (resolve, reject) => {
            let result = await TrezorConnect.getAddress({
                path,
                coin: "eth"
            });
            if (result.success) {
                resolve(result.payload.address);
            } else {
                console.log(result);
                reject(result.payload.error);
            }
        });
    };

    signMessage = async message => {
        return new Promise(async (resolve, reject) => {
            let result = await TrezorConnect.signMessage({
                path: defaultDPath,
                message
            });
            console.log(result);
            if (result.success) {
                resolve(result.payload.signature);
            } else {
                console.error("Error:", result.payload.error); // error message
                reject(result.payload.error);
            }
        });
    };

    sendTransaction = transaction => {
        console.log("Trezor sendTransaction");
        return new Promise(async (resolve, reject) => {
            let result = await TrezorConnect.signTransaction(transaction);
            console.log(result);
            if (result.success) {
                resolve(result.payload);
            } else {
                console.error("Error:", result.payload.error); // error message
                reject(result.payload.error);
            }
        });
    };
}
