const RelayerRegistration = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "coinbase",
        "type": "address"
      },
      {
        "name": "makerFee",
        "type": "uint16"
      },
      {
        "name": "takerFee",
        "type": "uint16"
      },
      {
        "name": "fromTokens",
        "type": "address[]"
      },
      {
        "name": "toTokens",
        "type": "address[]"
      }
    ],
    "name": "update",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x0129359e"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "MaximumRelayers",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x0e5c0fee"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "coinbase",
        "type": "address"
      },
      {
        "name": "new_owner",
        "type": "address"
      },
      {
        "name": "new_coinbase",
        "type": "address"
      }
    ],
    "name": "changeOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x18d98824"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "coinbase",
        "type": "address"
      }
    ],
    "name": "depositMore",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
    "signature": "0x4ce69bf5"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "coinbase",
        "type": "address"
      }
    ],
    "name": "getRelayerByCoinbase",
    "outputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint16"
      },
      {
        "name": "",
        "type": "uint16"
      },
      {
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x540105c7"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "maxRelayer",
        "type": "uint256"
      },
      {
        "name": "maxToken",
        "type": "uint256"
      },
      {
        "name": "minDeposit",
        "type": "uint256"
      }
    ],
    "name": "reconfigure",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x57ea3c41"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "RelayerCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x87d340ab"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "coinbase",
        "type": "address"
      },
      {
        "name": "makerFee",
        "type": "uint16"
      },
      {
        "name": "takerFee",
        "type": "uint16"
      },
      {
        "name": "fromTokens",
        "type": "address[]"
      },
      {
        "name": "toTokens",
        "type": "address[]"
      }
    ],
    "name": "register",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
    "signature": "0x92528330"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "coinbase",
        "type": "address"
      }
    ],
    "name": "resign",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xae6e43f5"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "getRelayerByOwner",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xbf4d79bd"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "MinimumDeposit",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xc635a9f2"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "MaximumTokenList",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xcfaece12"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "coinbase",
        "type": "address"
      }
    ],
    "name": "refund",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xfa89401a"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "CONTRACT_OWNER",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xfd301c49"
  },
  {
    "inputs": [
      {
        "name": "maxRelayers",
        "type": "uint256"
      },
      {
        "name": "maxTokenList",
        "type": "uint256"
      },
      {
        "name": "minDeposit",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "max_relayer",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "max_token",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "min_deposit",
        "type": "uint256"
      }
    ],
    "name": "ConfigEvent",
    "type": "event",
    "signature": "0x8f6bd709a98381db4e403a67ba106d598972dad177e946f19b54777f54d93923"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "deposit",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "makerFee",
        "type": "uint16"
      },
      {
        "indexed": false,
        "name": "takerFee",
        "type": "uint16"
      },
      {
        "indexed": false,
        "name": "fromTokens",
        "type": "address[]"
      },
      {
        "indexed": false,
        "name": "toTokens",
        "type": "address[]"
      }
    ],
    "name": "RegisterEvent",
    "type": "event",
    "signature": "0x5b153422b4e92269e234e15df78efe105bef483d1616eb0e981aaab6cd3d18e7"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "deposit",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "makerFee",
        "type": "uint16"
      },
      {
        "indexed": false,
        "name": "takerFee",
        "type": "uint16"
      },
      {
        "indexed": false,
        "name": "fromTokens",
        "type": "address[]"
      },
      {
        "indexed": false,
        "name": "toTokens",
        "type": "address[]"
      }
    ],
    "name": "UpdateEvent",
    "type": "event",
    "signature": "0x739b782eddb1be62a77006167cc1ec20b7ba94070d60d76e2d564b94c8e1c1d8"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "deposit",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "makerFee",
        "type": "uint16"
      },
      {
        "indexed": false,
        "name": "takerFee",
        "type": "uint16"
      },
      {
        "indexed": false,
        "name": "fromTokens",
        "type": "address[]"
      },
      {
        "indexed": false,
        "name": "toTokens",
        "type": "address[]"
      }
    ],
    "name": "ChangeOwnershipEvent",
    "type": "event",
    "signature": "0xc2134a51c7faf27e8c3e108cfc4f878ee165449c77ea515747afa938bf2af71c"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "deposit_release_time",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "deposit_amount",
        "type": "uint256"
      }
    ],
    "name": "ResignEvent",
    "type": "event",
    "signature": "0x2e821a4329d6351a6b13fe0c12fd7674cd0f4a2283685a4713e1325f36415ae5"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "success",
        "type": "bool"
      },
      {
        "indexed": false,
        "name": "remaining_time",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "deposit_amount",
        "type": "uint256"
      }
    ],
    "name": "RefundEvent",
    "type": "event",
    "signature": "0xfaba1aac53309af4c1c439f38c29500d3828405ee1ca5e7641b0432d17d30250"
  }
]

module.exports = {
  RelayerRegistration,
}
