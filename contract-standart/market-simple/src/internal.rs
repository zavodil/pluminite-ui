use crate::*;

pub(crate) fn hash_account_id(account_id: &AccountId) -> CryptoHash {
    let mut hash = CryptoHash::default();
    hash.copy_from_slice(&env::sha256(account_id.as_bytes()));
    hash
}

impl Contract {
    pub(crate) fn assert_owner(&self) {
        assert_eq!(
            &env::predecessor_account_id(),
            &self.owner_id,
            "Owner's method"
        );
    }

    /// refund the last bid of each token type, don't update sale because it's already been removed

    pub(crate) fn refund_all_bids(
        &mut self,
        bids: &Bids,
    ) {
        for (bid_ft, bid_vec) in bids {
            let bid = &bid_vec[bid_vec.len()-1];
            if bid_ft == "near" {
                    Promise::new(bid.owner_id.clone()).transfer(u128::from(bid.price));
            } else {
                ext_contract::ft_transfer(
                    bid.owner_id.clone(),
                    bid.price,
                    None,
                    bid_ft,
                    1,
                    GAS_FOR_FT_TRANSFER,
                );
            }
        }
    }

    pub(crate) fn internal_remove_sale(
        &mut self,
        nft_contract_id: AccountId,
        token_id: TokenId,
    ) -> Sale {
        let contract_and_token_id = format!("{}{}{}", &nft_contract_id, DELIMETER, token_id);
        let sale = self.sales.remove(&contract_and_token_id).expect("No sale");

        let mut by_owner_id = self.by_owner_id.get(&sale.owner_id).expect("No sale by_owner_id");
        by_owner_id.remove(&contract_and_token_id);
        if by_owner_id.is_empty() {
            self.by_owner_id.remove(&sale.owner_id);
        } else {
            self.by_owner_id.insert(&sale.owner_id, &by_owner_id);
        }

        let mut by_nft_contract_id = self
            .by_nft_contract_id
            .get(&nft_contract_id)
            .expect("No sale by nft_contract_id");
        by_nft_contract_id.remove(&token_id);
        if by_nft_contract_id.is_empty() {
            self.by_nft_contract_id.remove(&nft_contract_id);
        } else {
            self.by_nft_contract_id
                .insert(&nft_contract_id, &by_nft_contract_id);
        }

        let token_type = sale.token_type.clone();
        if let Some(token_type) = token_type {
            let mut by_nft_token_type = self.by_nft_token_type.get(&token_type).expect("No sale by nft_token_type");
            by_nft_token_type.remove(&contract_and_token_id);
            if by_nft_token_type.is_empty() {
                self.by_nft_token_type.remove(&token_type);
            } else {
                self.by_nft_token_type.insert(&token_type, &by_nft_token_type);
            }
        }

        sale
    }
}
