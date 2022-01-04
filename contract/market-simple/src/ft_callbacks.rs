use crate::*;

/// callbacks from FT Contracts

trait FungibleTokenReceiver {
    fn ft_on_transfer(&mut self, sender_id: AccountId, amount: U128, msg: String) -> PromiseOrValue<U128>;
}

#[near_bindgen]
impl FungibleTokenReceiver for Contract {
    fn ft_on_transfer(&mut self, sender_id: AccountId, amount: U128, msg: String) -> PromiseOrValue<U128> {
        let PurchaseArgs {
            nft_contract_id,
            token_id,
        } = near_sdk::serde_json::from_str(&msg).expect("Invalid PurchaseArgs");

        let contract_and_token_id = format!("{}{}{}", nft_contract_id, DELIMETER, token_id);
        let mut sale = self
            .sales
            .get(&contract_and_token_id)
            .expect("No sale in ft_on_transfer");
            
        assert_ne!(sale.owner_id, sender_id, "Cannot buy your own sale.");

        let ft_token_id = env::predecessor_account_id();
        let price = *sale
            .conditions
            .get(&ft_token_id)
            .expect("Not for sale in that token type");

        assert!(amount.0 > 0, "Amount must be greater than 0");

        if amount == price {
            self.process_purchase(
                nft_contract_id.into(),
                token_id,
                ft_token_id,
                price,
                sender_id,
            ).into()
        } else {
            self.add_bid(
                contract_and_token_id,
                price.0,
                amount.0,
                ft_token_id,
                sender_id,
                &mut sale,
            );
            PromiseOrValue::Value(U128(0))
        }
    }
}
