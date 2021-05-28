import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { transactions, utils } from 'near-api-js';

import { initialNftContractState } from './reducer';

import { getMarketContractName } from '../../utils';

import { ReactChildrenTypeRequired } from '../../types/ReactChildrenTypes';
import APP from "../../constants/app";

const {
  format: { parseNearAmount },
} = utils;

const GAS = '300000000000000';
const GAS_HALF = '150000000000000';

export const NftContractContext = React.createContext(initialNftContractState);

export const NftContractContextProvider = ({ nftContract, children }) => {
  const deposit = parseNearAmount('0.1');

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
    async (accountId, fromIndex, limit) =>
      nftContract.nft_tokens_for_owner({
        account_id: accountId,
        from_index: fromIndex,
        limit,
      }),
    [nftContract]
  );

  const getGemsBatch = useCallback(
    async (tokenIds) =>
      nftContract.nft_tokens_batch({
        token_ids: tokenIds,
      }),
    [nftContract]
  );

  const mintGem = useCallback(
    async (nft) => {

      const metadata = {
        media: nft.artDataUrl,
        reference: APP.HASH_SOURCE,
        title: nft.title,
        description: nft.description,
        issued_at: Date.now().toString(),
      };

      const perpetualRoyalties = nft.collaborators
        .map(({ userId, royalty }) => ({
          [userId]: royalty * 100,
        }))
        .reduce((acc, cur) => Object.assign(acc, cur), { [nft.creator]: nft.creatorRoyalty * 100 });

      // todo: is it alright to set id like this or using default id set by nft contract?
      const tokenId = `token-${Date.now()}`;

      await nftContract.account.signAndSendTransaction(nftContract.contractId, [
        transactions.functionCall(
          'nft_mint',
          Buffer.from(
            JSON.stringify({
              token_id: tokenId,
              metadata,
              perpetual_royalties: perpetualRoyalties,
            })
          ),
          GAS_HALF,
          deposit
        ),
        transactions.functionCall(
          'nft_approve',
          Buffer.from(
            JSON.stringify({
              token_id: tokenId,
              account_id: getMarketContractName(nftContract.contractId),
              msg: JSON.stringify({
                sale_conditions: [
                  {
                    price: nft?.conditions?.near || '0',
                    ft_token_id: 'near',
                  },
                ],
              }),
            })
          ),
          GAS_HALF,
          deposit
        ),
      ]);
    },
    [nftContract]
  );

  const listForSale = useCallback(
    async (gemId) => {
      await nftContract.nft_approve(
        {
          token_id: gemId,
          account_id: getMarketContractName(nftContract.contractId),
        },
        GAS,
        deposit
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
                            profile: profile,
                        })
                    ),
                    GAS_HALF
                )
            ]);
        },
        [nftContract]
    );

    const getProfile = useCallback(
        async (account_id) =>
            nftContract.get_profile({
                account_id: account_id,
            }),
        [nftContract]
    );

  const value = {
    nftContract,
    getGem,
    getGems,
    getGemsForOwner,
    getGemsBatch,
    mintGem,
    listForSale,
    setProfile,
    getProfile
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
    nft_tokens_batch: PropTypes.func.isRequired,
    nft_mint: PropTypes.func.isRequired,
    nft_approve: PropTypes.func.isRequired,
    get_profile: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};
