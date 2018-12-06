import { Signer, providers, utils } from 'ethers';
import TrezorConnect from 'trezor-connect';

import { NETWORK_URL } from '../../../config/url';
import { addMethodsToSigner } from './index';

const defaultDPath = "m/44'/60'/0'/0";

export class TrezorSigner extends Signer {
    constructor(path = defaultDPath) {
        super();
        const networkId = 8888;
        this.provider = new providers.JsonRpcProvider(NETWORK_URL, {
            chainId: networkId
        });
        this.address = null;
        window.signer = { instance: this, type: 'hardwareWallet' };
        addMethodsToSigner(this);
    }

    getPublicKey = async (path = defaultDPath) => {
        this.path = path;
        let result = await TrezorConnect.getPublicKey({
            path
        });
        if (result.success) {
            return result.payload;
        }

        console.log(result);
        throw new Error(result.payload.error);
    };

    getAddress = () => {
        return this.address;
    };

    setAddress = (address) => {
        this.address = address;
    }

    signMessage = async message => {
        return new Promise(async (resolve, reject) => {
            let result = await TrezorConnect.ethereumSignMessage({
                path: this.path + '/0',
                message
            });

            if (result.success) {
                resolve(result.payload.signature);
            } else {
                console.error('Error:', result.payload.error); // error message
                reject(result.payload.error);
            }
        });
    };

    sign = async (transaction) => {
        if (transaction.value) {
            transaction.value = utils.hexlify(transaction.value);
        }
        if (transaction.gasPrice) {
            transaction.gasPrice = utils.hexlify(transaction.gasPrice);
        }
        if (transaction.gasLimit) {
            transaction.gasLimit = utils.hexlify(transaction.gasLimit);
        }

        transaction.nonce = utils.hexlify(
            await this.provider.getTransactionCount(this.address)
        );

        let result = await TrezorConnect.ethereumSignTransaction({
            path: this.path + '/0',
            transaction
        });

        if (result.success) {
            let sig = {
                v: parseInt(result.payload.v.substring(2), 16),
                r: result.payload.r,
                s: result.payload.s
            };

            let serializedTransaction = await utils.serializeTransaction(
                transaction,
                sig
            );

            return serializedTransaction;
        }

        throw new Error(result.payload.error);
    };

    sendTransaction = async (transaction) => {
        if (Promise.resolve(transaction.to) === transaction.to) {
            transaction.to = await transaction.to;
        }

        if (!transaction.value) {
            transaction.value = utils.parseEther('0.0');
        }

        let signedTx = await this.sign(transaction);

        return this.provider.sendTransaction(signedTx);
    };
}
