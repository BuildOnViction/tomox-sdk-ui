import * as keyService from "./baseKey"
import TrezorConnect from "../device/trezor/trezor-connect";
import EthereumTx from "ethereumjs-tx"
import { numberToHex } from "../../utils/converter"
import { getTranslate } from 'react-localize-redux'

import { store } from "../../store"

const defaultDPath = "m/44'/60'/0'/0";

export default class Trezor {
    getPublicKey = (path = defaultDPath) => {
        var translate = getTranslate(store.getState().locale)
        return new Promise((resolve, reject) => {
            TrezorConnect.getXPubKey(path, (result) => {
                if (result.success) {
                    result.dPath = path;
                    resolve(result);
                } else {
                    var err = translate("error.cannot_connect_trezor") || 'Cannot connect to trezor'
                    if (result.toString() == 'Error: Not a valid path.') {
                        err = translate("error.path_not_support_by_trezor") || 'This path not supported by Trezor'
                    }
                    reject(err)
                }
            })
        });
    }
}
