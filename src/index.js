import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { initContract } from './utils';
import { NearContextProvider } from './contexts';

import './index.css';

window.nearInitPromise = initContract()
  .then(({ currentUser, nearConfig, walletConnection, near }) => {
    const app = (
      <NearContextProvider currentUser={currentUser} nearConfig={nearConfig} wallet={walletConnection} near={near}>
        <App />
      </NearContextProvider>
    );

    ReactDOM.render(app, document.getElementById('root'));
  })
  .catch(console.error);
