import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { initContract } from './utils';
import { NearContextProvider, NftContractContextProvider } from './contexts';

window.nearInitPromise = initContract()
  .then(({ contract, currentUser, nearConfig, walletConnection, near }) => {
    const app = (
      <NearContextProvider currentUser={currentUser} nearConfig={nearConfig} wallet={walletConnection} near={near}>
        <NftContractContextProvider nftContract={contract}>
          <App />
        </NftContractContextProvider>
      </NearContextProvider>
    );

    ReactDOM.render(app, document.getElementById('root'));
  })
  .catch(console.error);
