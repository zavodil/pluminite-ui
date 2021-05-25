import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { parseNearAmount } from 'near-api-js/lib/utils/format';

import { initialNftContractState } from './reducer';

import { getMarketContractName } from '../../utils';

import { ReactChildrenTypeRequired } from '../../types/ReactChildrenTypes';

const GAS = '200000000000000';

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
      // todo: use normal media once ipfs integrated and there is a place to store art images
      const { url } = await fetch('https://picsum.photos/600');

      const metadata = {
        media: url,
        title: nft.title,
        description: nft.description,
        issued_at: Date.now().toString(),
      };

      const perpetualRoyalties = nft.collaborators
        .map(({ userId, royalty }) => ({
          [userId]: royalty * 100,
        }))
        .reduce((acc, cur) => Object.assign(acc, cur), { [nft.creator]: nft.creatorRoyalty * 100 });

      await nftContract.nft_mint(
        {
          // todo: is it alright to set id like this or using default id set by nft contract?
          // token_id: `token-${Date.now()}`,
          metadata,
          perpetual_royalties: perpetualRoyalties,
        },
        GAS,
        deposit
      );
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

  const value = {
    nftContract,
    getGem,
    getGems,
    getGemsForOwner,
    getGemsBatch,
    mintGem,
    listForSale,
  };

  return <NftContractContext.Provider value={value}>{children}</NftContractContext.Provider>;
};

NftContractContextProvider.propTypes = {
  nftContract: PropTypes.shape({
    contractId: PropTypes.string.isRequired,
    nft_token: PropTypes.func.isRequired,
    nft_tokens: PropTypes.func.isRequired,
    nft_tokens_for_owner: PropTypes.func.isRequired,
    nft_tokens_batch: PropTypes.func.isRequired,
    nft_mint: PropTypes.func.isRequired,
    nft_approve: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};
