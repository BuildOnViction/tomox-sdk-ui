// @flow
import React from 'react';
import { utils } from 'ethers';
import { formatNumber } from 'accounting-js';

import SelectAddressFormRenderer from './SelectAddressFormRenderer';

import AddressGenerator from '../../store/services/device/addressGenerator';

type State = {
    isFirstList: boolean,
    addresses: Array<any>,
    currentAddresses: Array<any>
};

type Props = {
    publicKeyData: any,
    deviceService: any,
    getPreAddress: () => void,
    getMoreAddress: () => void,
    getAddress: () => void,
    getTrezorPublicKey: (any, string) => void,
    loginWithTrezorWallet: () => void,
    getBalance: string => Promise<number>
};

class SelectAddressForm extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.setDefaultValues();

        this.deviceService = props.deviceService;

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
            {
                path: "m/44'/61'/0'/0",
                desc: 'TREZOR (ETC)'
            },
            {
                path: "m/44'/60'/160720'/0'",
                desc: 'Ledger (ETC)'
            },
            {
                path: "m/0'/0'/0'",
                desc: 'SingularDTV',
                notSupport: true
            },
            {
                path: "m/44'/1'/0'/0",
                desc: 'Network: Testnets'
            },
            {
                path: "m/44'/40'/0'/0",
                desc: 'Network: Expanse',
                notSupport: true
            }
            // {
            //     path: 0,
            //     desc: 'Your Custom Path',
            //     defaultP: "m/44'/60'/1'/0",
            //     custom: false
            // }
        ];
    }

    state = {
        isFirstList: true,
        addresses: [],
        currentAddresses: []
    };

    componentDidMount() {
        if (this.props.publicKeyData) {
            this.currentDPath = 'm/' + this.props.publicKeyData.serializedPath;
            this.generator = new AddressGenerator(this.props.publicKeyData);
            let addresses = [];
            let index = 0;
            let getBalancePromises = [];
            for (index; index < 5; index++) {
                let addressString = this.generator.getAddressString(index);
                let address = {
                    addressString,
                    index: index,
                    balance: -1
                };
                addresses.push(address);
                getBalancePromises.push(this.addBalance(address, index));
            }
            this.addressIndex = index;
            this.currentIndex = index;

            Promise.all(getBalancePromises).then(result => {
                this.setState({
                    addresses: result,
                    currentAddresses: result
                });
            });
        }
    }

    addBalance = (address, index) => {
        return new Promise((resolve, reject) => {
            this.props.getBalance(address.addressString).then(result => {
                address.balance = formatNumber(utils.formatEther(result), { precision: 2 });
                resolve(address);
            });
        });
    };

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.publicKeyData &&
            this.props.publicKeyData &&
            this.props.publicKeyData.serializedPath !==
                prevProps.publicKeyData.serializedPath
        ) {
            this.currentDPath = 'm/' + this.props.publicKeyData.serializedPath;
            this.generator = new AddressGenerator(this.props.publicKeyData);
            let addresses = [];
            let index = 0;
            let getBalancePromises = [];
            for (index; index < 5; index++) {
                let address = {
                    addressString: this.generator.getAddressString(index),
                    index: index,
                    balance: -1
                };
                addresses.push(address);
                getBalancePromises.push(this.addBalance(address, index));
            }
            this.addressIndex = index;
            this.currentIndex = index;

            Promise.all(getBalancePromises).then(result => {
                this.setState({
                    addresses: result,
                    currentAddresses: result
                });
            });
        }
    }

    setDefaultValues = () => {
        this.addressIndex = 0;
        this.currentIndex = 0;
        this.generator = null;
        this.currentDPath = '';
        this.walletType = 'trezor';
    };

    moreAddress = () => {
        let addresses = this.state.addresses,
            i = this.addressIndex,
            j = i + 5;
        let getBalancePromises = [];
        if (this.generator) {
            if (this.addressIndex === this.currentIndex) {
                for (i; i < j; i++) {
                    let addressString = this.generator.getAddressString(i);
                    let address = {
                        addressString,
                        index: i,
                        balance: -1
                    };

                    getBalancePromises.push(this.addBalance(address, i));
                }
            }
            this.addressIndex = i;
            this.currentIndex += 5;

            Promise.all(getBalancePromises).then(result => {
                addresses = addresses.concat(result);

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
            });
        } else {
            console.log('Cannot connect to ' + this.props.walletType);
            // this.props.dispatch(throwError('Cannot connect to ' + this.walletType))
        }
    };

    preAddress = () => {
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

    handleSelectPath = async selectedPath => {
        this.setDefaultValues();
        await this.props.getTrezorPublicKey(this.deviceService, selectedPath);
    };

    handleSelectAddress = (formAddress: any) => {
        this.deviceService.setAddress(formAddress.addressString);

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
