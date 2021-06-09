import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import ErrorFallback from './components/ErrorFallback';

import { initContracts } from './utils';
import { NearContextProvider, NftContractContextProvider, MarketContractContextProvider } from './contexts';

import GlobalStyle from './styles/GlobalStyle';

const rootElement = document.getElementById('root');

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

    ReactDOM.render(app, rootElement);
  })
  .catch((error) => {
    console.error(error);

    ReactDOM.render(
      <>
        <GlobalStyle />
        <ErrorFallback />
      </>,
      rootElement
    );
  })
  .catch((error) => {
    console.error(error);

    ReactDOM.render(
      <div
        style={{
          fontSize: '66px',
          textTransform: 'uppercase',
          fontFamily: "'Staatliches', sans-serif",
          color: 'rgb(255, 121, 237)',
        }}
      >
        Sorry :( <br /> There was an unexpected error
      </div>,
      rootElement
    );
  })
  .finally(() => {
    rootElement.classList.remove('loading');
  });
