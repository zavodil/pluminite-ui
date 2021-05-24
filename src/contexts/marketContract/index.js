import React, { useReducer, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

import { marketContractReducer, initialMarketContractState } from './reducer';

import { GOT_SALES, GOT_SALES_POPULATED, GOT_GEM_ON_SALE } from './types';

import { ReactChildrenTypeRequired } from '../../types/ReactChildrenTypes';

import { NftContractContext } from '../nftContract';

export const MarketContractContext = React.createContext(initialMarketContractState);

export const MarketContractContextProvider = ({ marketContract, children }) => {
  const [marketContractState, dispatchMarketContract] = useReducer(marketContractReducer, initialMarketContractState);
  const { nftContract, getGemsBatch, getGem } = useContext(NftContractContext);

  const getSale = useCallback(
    async (gemId) => {
      const gemOnSale = await marketContract.get_sale({
        nft_contract_token: `${nftContract.contractId}||${gemId}`,
      });

      dispatchMarketContract({ type: GOT_GEM_ON_SALE, payload: { gemOnSale } });
    },
    [marketContract]
  );

  const getSales = useCallback(
    async (fromIndex, limit) => {
      const sales = await marketContract.get_sales_by_nft_contract_id({
        nft_contract_id: nftContract.contractId,
        from_index: fromIndex,
        limit,
      });

      dispatchMarketContract({ type: GOT_SALES, payload: { sales } });

      return sales;
    },
    [marketContract]
  );

  const getSalesPopulated = useCallback(
    async (fromIndex, limit) => {
      // todo: pagination
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

        salesPopulated.push(Object.assign(sale, token));
      }

      dispatchMarketContract({ type: GOT_SALES_POPULATED, payload: { salesPopulated } });

      return salesPopulated;
    },
    [marketContract, nftContract]
  );

  const value = {
    marketContract,
    gemOnSale: marketContractState.gemOnSale,
    sales: marketContractState.sales,
    salesPopulated: marketContractState.salesPopulated,
    getSale,
    getSales,
    getSalesPopulated,
  };

  return <MarketContractContext.Provider value={value}>{children}</MarketContractContext.Provider>;
};

MarketContractContextProvider.propTypes = {
  marketContract: PropTypes.shape({
    get_sales_by_nft_contract_id: PropTypes.func.isRequired,
    get_sale: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};
