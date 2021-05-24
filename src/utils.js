import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import getConfig from './config';

import { NftMethods, MarketMethods } from './constants/contractMethods';

const nearConfig = getConfig(process.env.NODE_ENV || 'development');

const getMarketContractName = (nftContractName) => `market.${nftContractName}`;

// Initialize contract & set global variables
export async function initContracts() {
  // Initialize connection to the NEAR testnet
  const near = await connect({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() }, ...nearConfig });

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  const walletConnection = new WalletConnection(near);

  // Load in account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  // Initializing our contract APIs by contract name and configuration
  const nftContract = await new Contract(walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: [...NftMethods.viewMethods],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: [...NftMethods.changeMethods],
    // Sender is the account ID to initialize transactions.
    sender: walletConnection.getAccountId(),
  });

  // Initializing our contract APIs by contract name and configuration
  const marketContract = await new Contract(
    walletConnection.account(),
    getMarketContractName(nearConfig.contractName),
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: [...MarketMethods.viewMethods],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: [...MarketMethods.changeMethods],
      // Sender is the account ID to initialize transactions.
      sender: walletConnection.getAccountId(),
    }
  );

  return {
    nftContract,
    marketContract,
    currentUser,
    nearConfig,
    walletConnection,
    near,
  };
}

export function logout() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName);
}
