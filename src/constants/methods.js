import React from 'react';

import { MintSuccessMessage, BuySuccessMessage } from '~/components/common/messages';

export const PAYABLE_METHODS = {
  MINT_AND_LIST_NFT: 'MINT_AND_LIST_NFT',
  OFFER: 'OFFER',
  PAY_STORAGE: 'PAY_STORAGE',
  LIST: 'LIST',
  NFT_TRANSFER: 'NFT_TRANSFER'
};

export const PAYABLE_METHODS_DESCRIPTIONS = {
  [PAYABLE_METHODS.MINT_AND_LIST_NFT]: 'minting and listing a gem',
  // todo: change description once offers can be made below 'buy now' price
  [PAYABLE_METHODS.OFFER]: 'buying a gem',
  [PAYABLE_METHODS.PAY_STORAGE]: 'paying storage fee',
  [PAYABLE_METHODS.LIST]: 'listing a gem on the market',
  [PAYABLE_METHODS.NFT_TRANSFER]: 'transfer a gem',
};

export const PAYABLE_METHODS_SUCCESS_MESSAGES = {
  [PAYABLE_METHODS.MINT_AND_LIST_NFT]: <MintSuccessMessage />,
  // todo: change message once offers can be made below 'buy now' price
  [PAYABLE_METHODS.OFFER]: <BuySuccessMessage />,
  [PAYABLE_METHODS.PAY_STORAGE]: 'Thank you! Storage fee has been paid!',
  [PAYABLE_METHODS.LIST]: 'Your gem has been listed on the market!',
  [PAYABLE_METHODS.NFT_TRANSFER]: 'Your gem has been transfered!',
};
