import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { transactions } from 'near-api-js';

import { initialMarketContractState, marketContractReducer } from './reducer';
import { GOT_MIN_STORAGE } from './types';

import { ReactChildrenTypeRequired } from '../../types/ReactChildrenTypes';

import { NftContractContext } from '../nftContract';

import { getMarketContractName } from '../../utils';

import { APP } from '../../constants';

export const MarketContractContext = React.createContext(initialMarketContractState);

export const MarketContractContextProvider = ({ marketContract, children }) => {
  const [marketContractState, dispatchMarketContract] = useReducer(marketContractReducer, initialMarketContractState);
  const { nftContract, getGemsBatch, getGem } = useContext(NftContractContext);

  const getSale = useCallback(
    async (gemId) => {
      return marketContract.get_sale({
        nft_contract_token: `${nftContract.contractId}||${gemId}`,
      });
    },
    [marketContract]
  );

  const getSales = useCallback(
    async (fromIndex, limit) =>
      marketContract.get_sales_by_nft_contract_id({
        nft_contract_id: nftContract.contractId,
        from_index: fromIndex,
        limit,
      }),
    [marketContract]
  );

  const getSalesPopulated = useCallback(
    async (fromIndex, limit) => {
      const sales = await getSales(fromIndex, limit);

      const salesPopulated = [];

      const gems = await getGemsBatch(
        sales
          .filter(({ nft_contract_id }) => nft_contract_id === nftContract.contractId)
          .map(({ token_id }) => token_id)
      );

      for (let i = 0; i < sales.length; i += 1) {
        const sale = sales[i];
        const { token_id } = sale;

        let token = gems.find(({ token_id: t }) => t === token_id);

        if (!token) {
          // eslint-disable-next-line no-await-in-loop
          token = await getGem(token_id);
        }

        salesPopulated.push({ ...sale, ...token });
      }

      return salesPopulated;
    },
    [marketContract, nftContract]
  );

  const mintAndListGem = useCallback(
    async (nft) => {
      const metadata = {
        media: nft.media,
        reference: APP.HASH_SOURCE,
        title: nft.title,
        description: nft.description,
        issued_at: Date.now().toString(),
        extra: JSON.stringify({
          media_lowres: nft.media_lowres,
          creator_id: nftContract.account.accountId,
        }),
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
          APP.PREPAID_GAS_LIMIT / 2,
          APP.USE_STORAGE_FEES ? APP.DEPOSIT_DEFAULT : 0
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
          APP.PREPAID_GAS_LIMIT / 2,
          APP.USE_STORAGE_FEES ? marketContractState.minStorage : 1
        ),
      ]);
    },
    [nftContract, marketContract, marketContractState]
  );

  const offer = useCallback(
    async (gemId, offerPrice) => {
      await marketContract.offer(
        {
          nft_contract_id: nftContract.contractId,
          token_id: gemId,
        },
        APP.PREPAID_GAS_LIMIT,
        parseNearAmount(String(offerPrice))
      );
    },
    [marketContract]
  );

  const payStorage = useCallback(async () => {
    await marketContract.storage_deposit({}, APP.PREPAID_GAS_LIMIT, marketContractState.minStorage);
  }, [marketContract, marketContractState]);

  const getMinStorage = useCallback(async () => marketContract.storage_amount(), [marketContract]);

  const getStoragePaid = useCallback(async (accountId) => marketContract.storage_paid({ account_id: accountId }), [
    marketContract,
  ]);

  const getSalesSupplyForOwner = useCallback(
    async (accountId) => marketContract.get_supply_by_owner_id({ account_id: accountId }),
    [marketContract]
  );

  useEffect(() => {
    (async () => {
      if (marketContract?.storage_amount) {
        const minStorage = await getMinStorage();

        dispatchMarketContract({ type: GOT_MIN_STORAGE, payload: { minStorage } });
      }
    })();
  }, [marketContract]);

  const value = {
    minStorage: marketContractState.minStorage,
    marketContract,
    getSale,
    getSales,
    getSalesPopulated,
    mintAndListGem,
    offer,
    payStorage,
    getStoragePaid,
    getSalesSupplyForOwner,
  };

  return <MarketContractContext.Provider value={value}>{children}</MarketContractContext.Provider>;
};

MarketContractContextProvider.propTypes = {
  marketContract: PropTypes.shape({
    get_sales_by_nft_contract_id: PropTypes.func.isRequired,
    get_sale: PropTypes.func.isRequired,
    get_supply_sales: PropTypes.func.isRequired,
    offer: PropTypes.func.isRequired,
    storage_deposit: PropTypes.func.isRequired,
    storage_paid: PropTypes.func.isRequired,
    storage_amount: PropTypes.func.isRequired,
    get_supply_by_owner_id: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};
