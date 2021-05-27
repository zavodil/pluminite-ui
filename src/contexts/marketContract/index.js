import React, {useCallback, useContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import {parseNearAmount} from 'near-api-js/lib/utils/format';

import {initialMarketContractState, marketContractReducer} from './reducer';
import {GOT_MIN_STORAGE} from './types';

import {ReactChildrenTypeRequired} from '../../types/ReactChildrenTypes';

import {NftContractContext} from '../nftContract';

const GAS = '200000000000000';

export const MarketContractContext = React.createContext(initialMarketContractState);

export const MarketContractContextProvider = ({marketContract, children}) => {
    const [marketContractState, dispatchMarketContract] = useReducer(marketContractReducer, initialMarketContractState);
    const {nftContract, getGemsBatch, getGem} = useContext(NftContractContext);

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
            // todo: pagination
            const sales = await getSales(fromIndex, limit);

            const salesPopulated = [];

            const gems = await getGemsBatch(
                sales
                    .filter(({nft_contract_id}) => nft_contract_id === nftContract.contractId)
                    .map(({token_id}) => token_id)
            );

            for (let i = 0; i < sales.length; i += 1) {
                const sale = sales[i];
                const {token_id} = sale;

                let token = gems.find(({token_id: t}) => t === token_id);

                if (!token) {
                    // eslint-disable-next-line no-await-in-loop
                    token = await getGem(token_id);
                }

                if (token.metadata.reference === "pinata" && token.metadata.media) {
                    token.metadata.media = await fetch(`https://gateway.pinata.cloud/ipfs/${token.metadata.media}`)
                        .then((response) => response.json())
                        .then((json) => json.file);
                }

                salesPopulated.push({...sale, ...token});
            }

            return salesPopulated;
        },
        [marketContract, nftContract]
    );

    const offer = useCallback(
        async (gemId, offerPrice) => {
            await marketContract.offer(
                {
                    nft_contract_id: nftContract.contractId,
                    token_id: gemId,
                },
                GAS,
                parseNearAmount(String(offerPrice))
            );
        },
        [marketContract]
    );

    const payStorage = useCallback(async () => {
        await marketContract.storage_deposit({}, GAS, marketContractState.minStorage);
    }, [marketContract, marketContractState]);

    const getMinStorage = useCallback(async () => marketContract.storage_amount(), [marketContract]);

    const getStoragePaid = useCallback(async (accountId) => marketContract.storage_paid({account_id: accountId}), [
        marketContract,
    ]);

    useEffect(() => {
        (async () => {
            if (marketContract?.storage_amount) {
                const minStorage = await getMinStorage();

                dispatchMarketContract({type: GOT_MIN_STORAGE, payload: {minStorage}});
            }
        })();
    }, [marketContract]);

    const value = {
        minStorage: marketContractState.minStorage,
        marketContract,
        getSale,
        getSales,
        getSalesPopulated,
        offer,
        payStorage,
        getStoragePaid,
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
    }).isRequired,
    children: ReactChildrenTypeRequired,
};
