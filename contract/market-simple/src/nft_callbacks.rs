use crate::*;

/// approval callbacks from NFT Contracts


#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SaleArgs {
    pub sale_conditions: Vec<Price>,
    pub token_type: TokenType,
}


trait NonFungibleTokenApprovalsReceiver {
    fn nft_on_approve(
        &mut self,
        token_id: TokenId,
        owner_id: ValidAccountId,
        approval_id: u64,
        msg: String,
    );
}

#[near_bindgen]
impl NonFungibleTokenApprovalsReceiver for Contract {
    /// where we add the sale because we know nft owner can only call nft_approve

    fn nft_on_approve(
        &mut self,
        token_id: TokenId,
        owner_id: ValidAccountId,
        approval_id: u64,
        msg: String,
    ) {

        // enforce cross contract calls only from NFT contracts

        let nft_contract_id = env::predecessor_account_id();
        let signer_id = env::signer_account_id();
        assert_ne!(
            nft_contract_id,
            signer_id,
            "nft_on_approve should only be called via cross-contract call"
        );

        // enforce signer's storage is enough to cover + 1 more sale 

        let owner_paid_storage =
        if self.use_storage_fees {
            let storage_amount = self.storage_amount().0;
            let _owner_paid_storage = self.storage_deposits.get(&signer_id).unwrap_or(0);
            let signer_storage_required = (self.get_supply_by_owner_id(signer_id).0 + 1) as u128 * storage_amount;
            assert!(
                _owner_paid_storage >= signer_storage_required,
                "Insufficient storage paid: {}, for {} sales at {} rate of per sale",
                _owner_paid_storage, signer_storage_required / STORAGE_PER_SALE, STORAGE_PER_SALE
            );
            _owner_paid_storage
        }
        else {
            0
        };

        /*
        let owner_paid_storage = if self.use_storage_fees {
            self.storage_deposits.get(owner_id.as_ref()).unwrap_or(0)
        }
        else {
            0
        };

        if self.use_storage_fees {
            assert!(
                owner_paid_storage >= STORAGE_PER_SALE,
                "Required minimum storage to sell on market: {}",
                STORAGE_PER_SALE
            );
        }
>>>>>>> Stashed changes*/

        let SaleArgs { sale_conditions, token_type } =
            near_sdk::serde_json::from_str(&msg).expect("Not valid SaleArgs");

        let mut conditions = HashMap::new();

        for Price { price, ft_token_id } in sale_conditions {
            if !self.ft_token_ids.contains(ft_token_id.as_ref()) {
                env::panic(
                    format!("Token {} not supported by this market", ft_token_id).as_bytes(),
                );
            }
            // sale is denominated in FT or 0 if accepting bids
            conditions.insert(ft_token_id.into(), price.unwrap_or(U128(0)));
        }

        // env::log(format!("add_sale for owner: {}", &owner_id).as_bytes());

        let bids = HashMap::new();

        let contract_and_token_id = format!("{}{}{}", nft_contract_id, DELIMETER, token_id);
        self.sales.insert(
            &contract_and_token_id,
            &Sale {
                owner_id: owner_id.clone().into(),
                approval_id,
                nft_contract_id: nft_contract_id.clone(),
                token_id: token_id.clone(),
                token_type: token_type.clone(),
                conditions,
                bids,
                created_at: U64(env::block_timestamp()/1000000),
            },
        );

        // extra for views

        let mut by_owner_id = self.by_owner_id.get(owner_id.as_ref()).unwrap_or_else(|| {
            UnorderedSet::new(
                StorageKey::ByOwnerIdInner {
                    account_id_hash: hash_account_id(owner_id.as_ref()),
                }
                .try_to_vec()
                .unwrap(),
            )
        });

        if self.use_storage_fees {
            let owner_occupied_storage = u128::from(by_owner_id.len()) * STORAGE_PER_SALE;
            assert!(
                owner_paid_storage > owner_occupied_storage,
                "User has more sales than storage paid"
            );
        }

        by_owner_id.insert(&contract_and_token_id);
        self.by_owner_id.insert(owner_id.as_ref(), &by_owner_id);

        let mut by_nft_contract_id = self
            .by_nft_contract_id
            .get(&nft_contract_id)
            .unwrap_or_else(|| {
                UnorderedSet::new(
                    StorageKey::ByNFTContractIdInner {
                        account_id_hash: hash_account_id(&nft_contract_id),
                    }
                    .try_to_vec()
                    .unwrap(),
                )
            });
        by_nft_contract_id.insert(&token_id);
        self.by_nft_contract_id
            .insert(&nft_contract_id, &by_nft_contract_id);

        if let Some(token_type) = token_type {
            assert!(token_id.contains(&token_type), "TokenType should be substr of TokenId");
            let mut by_nft_token_type = self
                .by_nft_token_type
                .get(&token_type)
                .unwrap_or_else(|| {
                    UnorderedSet::new(
                        StorageKey::ByNFTTokenTypeInner {
                            token_type_hash: hash_account_id(&token_type),
                        }
                        .try_to_vec()
                        .unwrap(),
                    )
                });
                by_nft_token_type.insert(&contract_and_token_id);
            self.by_nft_token_type
                .insert(&token_type, &by_nft_token_type);
        }
    }
}
