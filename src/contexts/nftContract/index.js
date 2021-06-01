import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { transactions } from 'near-api-js';

import { initialNftContractState } from './reducer';

import { getMarketContractName } from '../../utils';

import { ReactChildrenTypeRequired } from '../../types/ReactChildrenTypes';
import APP from '../../constants/app';

export const NftContractContext = React.createContext(initialNftContractState);

export const NftContractContextProvider = ({ nftContract, children }) => {
  const getGem = useCallback(async (id) => nftContract.nft_token({ token_id: id }), [nftContract]);

  const getGems = useCallback(
    async (fromIndex, limit) =>
      nftContract.nft_tokens({
        from_index: fromIndex,
        limit,
      }),
    [nftContract]
  );

  const getGemsForOwner = useCallback(
    async (accountId, fromIndex, limit) => {
      return nftContract.nft_tokens_for_owner({
        account_id: accountId,
        from_index: fromIndex,
        limit,
      });
    },
    [nftContract]
  );

  const getGemsForCreator = useCallback(
    async (accountId, fromIndex, limit) => {
      return nftContract.nft_tokens_for_creator({
        account_id: accountId,
        from_index: fromIndex,
        limit,
      });
    },
    [nftContract]
  );

  const getGemsBatch = useCallback(
    async (tokenIds) =>
      nftContract.nft_tokens_batch({
        token_ids: tokenIds,
      }),
    [nftContract]
  );

  const listForSale = useCallback(
    async (gemId) => {
      await nftContract.nft_approve(
        {
          token_id: gemId,
          account_id: getMarketContractName(nftContract.contractId),
        },
        APP.PREPAID_GAS_LIMIT,
        APP.DEPOSIT_DEFAULT
      );
    },
    [nftContract]
  );

  const setProfile = useCallback(
    async (profile) => {
      await nftContract.account.signAndSendTransaction(nftContract.contractId, [
        transactions.functionCall(
          'set_profile',
          Buffer.from(
            JSON.stringify({
              profile,
            })
          ),
          APP.PREPAID_GAS_LIMIT_HALF
        ),
      ]);
    },
    [nftContract]
  );

  const getProfile = useCallback(
    async (account_id) =>
      nftContract.get_profile({
        account_id,
      }),
    [nftContract]
  );

  const value = {
    nftContract,
    getGem,
    getGems,
    getGemsForOwner,
    getGemsForCreator,
    getGemsBatch,
    listForSale,
    setProfile,
    getProfile,
  };

  return <NftContractContext.Provider value={value}>{children}</NftContractContext.Provider>;
};

NftContractContextProvider.propTypes = {
  nftContract: PropTypes.shape({
    account: PropTypes.shape({
      signAndSendTransaction: PropTypes.func,
    }),
    contractId: PropTypes.string.isRequired,
    nft_token: PropTypes.func.isRequired,
    nft_tokens: PropTypes.func.isRequired,
    nft_tokens_for_owner: PropTypes.func.isRequired,
    nft_tokens_for_creator: PropTypes.func.isRequired,
    nft_tokens_batch: PropTypes.func.isRequired,
    nft_mint: PropTypes.func.isRequired,
    nft_approve: PropTypes.func.isRequired,
    get_profile: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};
