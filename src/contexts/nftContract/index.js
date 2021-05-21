import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { parseNearAmount } from 'near-api-js/lib/utils/format';

import { nftContractReducer, initialNftContractState } from './reducer';

import { GOT_GEM, GOT_GEMS, GOT_GEMS_FOR_OWNER, GOT_GEMS_BATCH, CLEAR_STATE } from './types';

import { ReactChildrenTypeRequired } from '../../types/ReactChildrenTypes';

export const NftContractContext = React.createContext(initialNftContractState);

const GAS = '200000000000000';

export const NftContractContextProvider = ({ nftContract, children }) => {
  const [nftContractState, dispatchNftContract] = useReducer(nftContractReducer, initialNftContractState);

  const getGem = useCallback(
    async (id) => {
      const gem = await nftContract.nft_token({ token_id: id });

      dispatchNftContract({ type: GOT_GEM, payload: { gem } });

      return gem;
    },
    [nftContract]
  );

  const getGems = useCallback(
    async (fromIndex, limit) => {
      const gems = await nftContract.nft_tokens({
        from_index: fromIndex,
        limit,
      });

      dispatchNftContract({ type: GOT_GEMS, payload: { gems } });

      return gems;
    },
    [nftContract]
  );

  const getGemsForOwner = useCallback(
    async (accountId, fromIndex, limit) => {
      const gemsForOwner = await nftContract.nft_tokens_for_owner({
        account_id: accountId,
        from_index: fromIndex,
        limit,
      });

      dispatchNftContract({ type: GOT_GEMS_FOR_OWNER, payload: { gemsForOwner } });

      return gemsForOwner;
    },
    [nftContract]
  );

  const getGemsBatch = useCallback(
    async (tokenIds) => {
      const gemsBatch = await nftContract.nft_tokens_batch({
        token_ids: tokenIds,
      });

      dispatchNftContract({ type: GOT_GEMS_BATCH, payload: { gemsBatch } });

      return gemsBatch;
    },
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

      const deposit = parseNearAmount('0.1');

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

      dispatchNftContract({ type: CLEAR_STATE });
    },
    [nftContract]
  );

  const value = {
    gem: nftContractState.gem,
    gems: nftContractState.gems,
    gemsForOwner: nftContractState.gemsForOwner,
    gemsBatch: nftContractState.gemsBatch,
    getGem,
    getGems,
    getGemsForOwner,
    getGemsBatch,
    mintGem,
  };

  return <NftContractContext.Provider value={value}>{children}</NftContractContext.Provider>;
};

NftContractContextProvider.propTypes = {
  nftContract: PropTypes.shape({
    nft_token: PropTypes.func.isRequired,
    nft_tokens: PropTypes.func.isRequired,
    nft_tokens_for_owner: PropTypes.func.isRequired,
    nft_tokens_batch: PropTypes.func.isRequired,
    nft_mint: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};
