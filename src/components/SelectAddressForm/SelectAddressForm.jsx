// @flow
import React from 'react';
import SelectAddressFormRenderer from './SelectAddressFormRenderer';

import AddressGenerator from '../../store/services/device/addressGenerator';

type State = {
    isFirstList: boolean,
    addresses: Array<any>,
    currentAddresses: Array<any>
};

type Props = {
    publicKeyData: any,
    getPreAddress: () => void,
    getMoreAddress: () => void,
    getAddress: () => void
};

class SelectAddressForm extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props);

        this.addressIndex = 0;
        this.currentIndex = 0;
        this.generator = null;
        this.currentDPath = '';
        this.walletType = 'trezor';

        this.DPATH = [
            {
                path: "m/44'/60'/0'/0",
                desc:
                    'Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox',
                defaultType: 'trezor'
            },
            {
                path: "m/44'/60'/0'",
                desc: 'Ledger (ETH)',
                defaultType: 'ledger'
            },
            { path: "m/44'/61'/0'/0", desc: 'TREZOR (ETC)' },
            { path: "m/44'/60'/160720'/0'", desc: 'Ledger (ETC)' },
            { path: "m/0'/0'/0'", desc: 'SingularDTV', notSupport: true },
            { path: "m/44'/1'/0'/0", desc: 'Network: Testnets' },
            {
                path: "m/44'/40'/0'/0",
                desc: 'Network: Expanse',
                notSupport: true
            },
            {
                path: 0,
                desc: 'Your Custom Path',
                defaultP: "m/44'/60'/1'/0",
                custom: false
            }
        ];
    }

    state = {
        isFirstList: true,
        addresses: [],
        currentAddresses: []
    };

    componentDidMount() {
        this.currentDPath = 'm/' + this.props.publicKeyData.serializedPath;
        this.generator = new AddressGenerator(this.props.publicKeyData);
        let addresses = [];
        let index = 0;
        for (index; index < 5; index++) {
            let address = {
                addressString: this.generator.getAddressString(index),
                index: index,
                balance: -1
            };
            addresses.push(address);
        }

        this.setState({
            addresses,
            currentAddresses: addresses
        });
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.publicKeyData &&
            this.props.publicKeyData.serializedPath !==
                prevProps.publicKeyData.serializedPath
        ) {
            this.currentDPath = 'm/' + this.props.publicKeyData.serializedPath;
            this.generator = new AddressGenerator(this.props.publicKeyData);
            let addresses = [];
            let index = 0;
            for (index; index < 5; index++) {
                let address = {
                    addressString: this.generator.getAddressString(index),
                    index: index,
                    balance: -1
                };
                addresses.push(address);
            }

            this.setState({
                addresses,
                currentAddresses: addresses
            });
        }
    }

    moreAddress = () => {
        console.log("moreAddress");
        let addresses = this.state.addresses,
            i = this.addressIndex,
            j = i + 5,
            currentAddresses = [];
        if (this.generator) {
            if (this.addressIndex === this.currentIndex) {
                for (i; i < j; i++) {
                    let address = {
                        addressString: this.generator.getAddressString(i),
                        index: i,
                        balance: -1
                    };
                    addresses.push(address);
                    currentAddresses.push(address);
                    this.addBalance(address.addressString, i);
                }
            }
            this.addressIndex = i;
            this.currentIndex += 5;
            this.setState({
                addresses: addresses,
                currentAddresses: addresses.slice(
                    this.currentIndex - 5,
                    this.currentIndex
                )
            });
            if (this.state.isFirstList) {
                this.setState({
                    isFirstList: false
                });
            }
        } else {
            console.log('Cannot connect to ' + this.props.walletType);
            // this.props.dispatch(throwError('Cannot connect to ' + this.walletType))
        }
    };

    preAddress = () => {
        console.log("preAddress");
        let addresses = this.state.addresses;
        if (this.currentIndex > 5) {
            this.currentIndex -= 5;
            this.setState({
                currentAddresses: addresses.slice(
                    this.currentIndex - 5,
                    this.currentIndex
                )
            });
        }
        if (this.currentIndex <= 5) {
            this.setState({
                isFirstList: true
            });
        }
    };

    async getBalance(address) {
        return 0;
    }

    addBalance(address, index) {
        this.getBalance(address).then(result => {
            let addresses = this.state.addresses;
            addresses[index].balance = result;
            this.setState({
                currentList: addresses
            });
        });
    }

    handleSelectPath = async selectedPath => {
        await this.props.getTrezorPublicKey(selectedPath);
    };

    handleSelectAddress = formAddress => {
        let data = {
            address: formAddress.addressString,
            type: this.walletType,
            path: this.currentDPath + '/' + formAddress.index
        };

        this.props.loginWithTrezorWallet(data);
    };

    render() {
        return (
            <SelectAddressFormRenderer
                isFirstList={this.state.isFirstList}
                currentAddresses={this.state.currentAddresses}
                dPath={this.DPATH}
                getPreAddress={this.preAddress}
                getMoreAddress={this.moreAddress}
                handleSelectPath={this.handleSelectPath}
                handleSelectAddress={this.handleSelectAddress}
            />
        );
    }
}

export default SelectAddressForm;
