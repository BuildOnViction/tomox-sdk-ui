import { ethers, providers } from "ethers";
import TrezorConnect from "../device/trezor/trezor-connect";

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
        window.signer = { instance: this.provider.getSigner(), type: "wallet" };
        addMethodsToSigner(this);
    }

    getPublicKey = (path = defaultDPath) => {
        return new Promise((resolve, reject) => {
            TrezorConnect.getXPubKey(path, result => {
                if (result.success) {
                    result.dPath = path;
                    resolve(result);
                } else {
                    var err = "Cannot connect to trezor";
                    if (result.toString() === "Error: Not a valid path.") {
                        err = "This path not supported by Trezor";
                    }
                    reject(err);
                }
            });
        });
    };

    getAddress = (path = defaultDPath) => {
        return new Promise((resolve, reject) => {
            TrezorConnect.getAddress(path, result => {
                if (result.success) {
                    resolve(result.payload.address);
                } else {
                    var err = "Cannot connect to trezor";
                    if (result.toString() === "Error: Not a valid path.") {
                        err = "This path not supported by Trezor";
                    }
                    reject(err);
                }
            });
        });
    };

    signMessage = message => {};

    sendTransaction = transaction => {};
}
