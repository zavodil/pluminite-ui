import 'regenerator-runtime/runtime';

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { initContract } from './utils'
import './index.css';

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <App />,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
