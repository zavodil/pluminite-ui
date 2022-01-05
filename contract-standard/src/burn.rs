use crate::*;

/// CUSTOM - owner can burn a locked token for a given user, reducing the enumerable->nft_supply_for_type
#[near_bindgen]
impl Contract {
    #[payable]
    pub fn nft_burn(
        &mut self,
        token_id: Option<TokenId>,
    ) {
        assert_eq!(self.is_token_locked(token_id), true, "Token must be locked");
        //TODO burn token
    }
}