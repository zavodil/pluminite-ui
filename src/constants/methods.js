import React from 'react';

import { MintSuccessMessage } from '../components/common/messages';

export const PAYABLE_METHODS = {
  MINT_AND_LIST_NFT: 'MINT_AND_LIST_NFT',
};

export const PAYABLE_METHODS_DESCRIPTIONS = {
  [PAYABLE_METHODS.MINT_AND_LIST_NFT]: 'minting and listing a gem',
};

export const PAYABLE_METHODS_SUCCESS_MESSAGES = {
  [PAYABLE_METHODS.MINT_AND_LIST_NFT]: <MintSuccessMessage />,
};
