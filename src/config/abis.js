export const ERC20 = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalTokenSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_from",
        "type": "address",
      },
      {
        "indexed": true,
        "name": "_to",
        "type": "address",
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256",
      },
    ],
    "name": "Transfer",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_owner",
        "type": "address",
      },
      {
        "indexed": true,
        "name": "_spender",
        "type": "address",
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256",
      },
    ],
    "name": "Approval",
    "type": "event",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
      },
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
      },
      {
        "name": "_spender",
        "type": "address",
      },
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "remaining",
        "type": "uint256",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address",
      },
      {
        "name": "_value",
        "type": "uint256",
      },
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "success",
        "type": "bool",
      },
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address",
      },
      {
        "name": "_to",
        "type": "address",
      },
      {
        "name": "_value",
        "type": "uint256",
      },
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "success",
        "type": "bool",
      },
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address",
      },
      {
        "name": "_value",
        "type": "uint256",
      },
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "success",
        "type": "bool",
      },
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
]

export const WETH = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address",
      },
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address",
      },
      {
        "name": "",
        "type": "address",
      },
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "src",
        "type": "address",
      },
      {
        "indexed": true,
        "name": "guy",
        "type": "address",
      },
      {
        "indexed": false,
        "name": "wad",
        "type": "uint256",
      },
    ],
    "name": "Approval",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "src",
        "type": "address",
      },
      {
        "indexed": true,
        "name": "dst",
        "type": "address",
      },
      {
        "indexed": false,
        "name": "wad",
        "type": "uint256",
      },
    ],
    "name": "Transfer",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "dst",
        "type": "address",
      },
      {
        "indexed": false,
        "name": "wad",
        "type": "uint256",
      },
    ],
    "name": "Deposit",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "src",
        "type": "address",
      },
      {
        "indexed": false,
        "name": "wad",
        "type": "uint256",
      },
    ],
    "name": "Withdrawal",
    "type": "event",
  },
  {
    "constant": false,
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "wad",
        "type": "uint256",
      },
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "guy",
        "type": "address",
      },
      {
        "name": "wad",
        "type": "uint256",
      },
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool",
      },
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "dst",
        "type": "address",
      },
      {
        "name": "wad",
        "type": "uint256",
      },
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool",
      },
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "src",
        "type": "address",
      },
      {
        "name": "dst",
        "type": "address",
      },
      {
        "name": "wad",
        "type": "uint256",
      },
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool",
      },
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
]

