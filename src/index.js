import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import ErrorFallback from './components/ErrorFallback';

import { initContracts } from './utils';
import { NearContextProvider, NftContractContextProvider, MarketContractContextProvider } from './contexts';

import GlobalStyle from './styles/GlobalStyle';

window.nearInitPromise = initContracts()
  .then(({ nftContract, marketContract, currentUser, nearConfig, walletConnection, near }) => {
    const app = (
      <NearContextProvider currentUser={currentUser} nearConfig={nearConfig} wallet={walletConnection} near={near}>
        <NftContractContextProvider nftContract={nftContract}>
          <MarketContractContextProvider marketContract={marketContract}>
            <App />
          </MarketContractContextProvider>
        </NftContractContextProvider>
      </NearContextProvider>
    );

    ReactDOM.render(app, document.getElementById('root'));
  })
  .catch((error) => {
    console.error(error);

    ReactDOM.render(
      <>
        <GlobalStyle />
        <ErrorFallback />
      </>,
      document.getElementById('root')
    );
  })
  .catch((error) => {
    console.error(error);

    ReactDOM.render(
      <div>
        Sorry :( <br /> There was an unexpected error
      </div>,
      document.getElementById('root')
    );
  });
