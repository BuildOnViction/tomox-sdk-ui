// @flow
import {
  Contract,
  utils
} from 'ethers';
import {
  ERC20
} from '../../config/abis';
import {
  EXCHANGE_ADDRESS
} from '../../config/contracts';
import {
  getProvider,
  getSigner
} from './signer';

import type {
  Token,
  TokenBalance,
  TokenBalances
} from '../../types/tokens';
import type {
  // AccountBalance,
  AccountAllowance
} from '../../types/accountBalances';

export async function queryEtherBalance(
  address: string
): Promise < TokenBalance > {
  let provider = getProvider();

  let balance = await provider.getBalance(address);

  return {
    symbol: 'ETH',
    balance: parseFloat(utils.formatEther(balance))
  };
}

export async function updateAllowance(
  tokenAddress: string,
  spender: string,
  address: string,
  balance: number,
  txConfirmHandler: boolean => void
) {
  const signer = getSigner();

  const contract = new Contract(tokenAddress, ERC20, signer);

  const tx = await contract.approve(spender, balance);
  const receipt = await signer.provider.waitForTransaction(tx.hash);

  receipt.status === 1 ? txConfirmHandler(true) : txConfirmHandler(false);
}

export async function updateExchangeAllowance(
  tokenAddress: string,
  address: string,
  balance: number,
  txConfirmHandler: boolean => void
) {
  const signer = getSigner();
  const exchange = EXCHANGE_ADDRESS[signer.provider.network.chainId];
  const contract = new Contract(tokenAddress, ERC20, signer);
  const tx = await contract.approve(exchange, balance);
  const receipt = await signer.provider.waitForTransaction(tx.hash);

  receipt.status === 1 ? txConfirmHandler(true) : txConfirmHandler(false);
}

export async function queryTokenBalances(
  address: string,
  tokens: Array < Token >
): Promise < TokenBalances > {
  const provider = getProvider();

  const balancePromises = tokens.map(async token => {
    const contract = new Contract(token.address, ERC20, provider);
    // try {
    return await contract.balanceOf(address);
    // } catch (e) {
    //   // console.log(address, e);
    //   return null;
    // }
  });

  let balances = await Promise.all(balancePromises);

  const tokenBalances = balances
    .filter(balance => balance !== null)
    .map((balance, i) => ({
      symbol: tokens[i].symbol,
      balance: utils.formatEther(balance)
    }));
  // console.log('balances', balances);
  return tokenBalances;
}

export async function queryExchangeTokenAllowances(
  owner: string,
  tokens: Array < Token >
) {
  const provider = getProvider();

  const exchange = EXCHANGE_ADDRESS[provider.network.chainId];
  const allowancePromises = tokens.map(async token => {
    // try {
    const contract = new Contract(token.address, ERC20, provider);
    return await contract.allowance(owner, exchange);
    // } catch (e) {
    //   return null;
    // }
  });

  let allowances = await Promise.all(allowancePromises);

  allowances = (allowances: TokenBalances)
    .filter(allowance => allowance !== null)
    .map((allowance, i) => ({
      symbol: tokens[i].symbol,
      allowance: utils.formatEther(allowance)
    }));

  return allowances;
}

export async function queryTokenAllowances(
  owner: string,
  spender: string,
  tokens: Array < Token >
) {
  let allowances;
  const provider = getProvider();
  const allowancePromises = tokens.map(token => {
    const contract = new Contract(token.address, ERC20, provider);
    return contract.allowance(owner, spender);
  });

  allowances = await Promise.all(allowancePromises);
  allowances = (allowances: TokenBalances).map((allowance, i) => ({
    symbol: tokens[i].symbol,
    allowance: utils.formatEther(allowance)
  }));

  return allowances;
}

export async function subscribeEtherBalance(
  address: string,
  callback: number => void
) {
  const provider = getProvider();
  const initialBalance = await provider.getBalance(address);

  const handler = async balance => {
    if (balance !== initialBalance) callback(utils.formatEther(balance));
  };

  provider.on(address, handler);

  return () => {
    provider.removeListener(address, handler);
  };
}

export async function subscribeTokenBalance(
  address: string,
  token: Object,
  callback: number => void
) {
  const provider = getProvider();
  const contract = new Contract(token.address, ERC20, provider);

  const initialBalance = await contract.balanceOf(address);
  const handler = async (sender, receiver, tokens) => {
    if (receiver === address) {
      const balance = await contract.balanceOf(receiver);
      if (balance !== initialBalance) callback(utils.formatEther(balance));
    }
  };

  contract.ontransfer = handler;

  return () => {
    provider.removeListener(address, handler);
  };
}

export async function subscribeTokenBalances(
  address: string,
  tokens: Array < Token > ,
  callback: TokenBalance => any
) {
  const provider = getProvider();
  const handlers = [];

  tokens.map(async token => {
    const contract = new Contract(token.address, ERC20, provider);
    // const initialBalance = await contract.balanceOf(address)

    const handler = async (sender, receiver, amount) => {
      if (receiver === address || sender === address) {
        const balance = await contract.balanceOf(address);
        callback({
          symbol: token.symbol,
          balance: utils.formatEther(balance)
        });
      }
    };

    window.abi = ERC20;

    contract.ontransfer = handler;
    handlers.push(handler);
  });

  return () => {
    handlers.forEach(handler => provider.removeListener(address, handler));
  };
}

export async function subscribeTokenAllowance(
  address: string,
  token: Object,
  callback: number => void
) {
  const provider = getProvider();
  const exchange = EXCHANGE_ADDRESS[provider.network.chainId];
  const contract = new Contract(token.address, ERC20, provider);

  const initialAllowance = await contract.allowance(exchange, address);
  const handler = async (sender, receiver, tokens) => {
    if (receiver === address) {
      const allowance = await contract.allowance(exchange, receiver);
      if (allowance !== initialAllowance)
        callback(utils.formatEther(allowance));
    }
  };

  contract.onapprove = handler;

  return () => {
    provider.removeListener(address, handler);
  };
}

export async function subscribeTokenAllowances(
  address: string,
  tokens: Array < Token > ,
  callback: AccountAllowance => any
) {
  const provider = getProvider();
  const exchange = EXCHANGE_ADDRESS[provider.network.chainId];
  const handlers = [];

  tokens.map(async token => {
    const contract = new Contract(token.address, ERC20, provider);
    const handler = async (owner, spender, amount) => {
      if (owner === address && spender === exchange) {
        const allowance = await contract.allowance(owner, exchange);
        callback({
          symbol: token.symbol,
          allowance: utils.formatEther(allowance)
        });
      }
    };

    contract.onapproval = handler;
    handlers.push(handler);
  });

  return () => {
    handlers.forEach(handler => provider.removeListener(address, handler));
  };
}