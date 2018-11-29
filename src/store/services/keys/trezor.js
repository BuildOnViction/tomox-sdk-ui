import TrezorConnect from '../device/trezor/trezor-connect';

const defaultDPath = "m/44'/60'/0'/0";

export default class Trezor {
    getPublicKey = (path = defaultDPath) => {
        return new Promise((resolve, reject) => {
            TrezorConnect.getXPubKey(path, result => {
                if (result.success) {
                    result.dPath = path;
                    resolve(result);
                } else {
                    var err = 'Cannot connect to trezor';
                    if (result.toString() === 'Error: Not a valid path.') {
                        err = 'This path not supported by Trezor';
                    }
                    reject(err);
                }
            });
        });
    };

    generateAddress(data) {
		this.generator = new AddressGenerator(data);
		let addresses = [];
		let index = 0;
		for (index; index < 5; index++) {
			let address = {
				addressString: this.generator.getAddressString(index),
				index: index,
				balance: -1,
			};
			addresses.push(address);
		}
	};
}
