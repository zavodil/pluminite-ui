use std::collections::HashMap;
use std::cmp::min;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, ValidAccountId, U64, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, CryptoHash, PanicOnDefault, Promise, StorageUsage, log
};

use crate::internal::*;
pub use crate::metadata::*;
pub use crate::mint::*;
pub use crate::nft_core::*;
pub use crate::token::*;
pub use crate::enumerable::*;

mod internal;
mod metadata;
mod mint;
mod nft_core;
mod token;
mod enumerable;

// CUSTOM types
pub type TokenType = String;
pub type TypeSupplyCaps = HashMap<TokenType, U64>;

pub const CONTRACT_ROYALTY_CAP: u32 = 1000;
pub const MINTER_ROYALTY_CAP: u32 = 9000;
pub const MAX_PROFILE_BIO_LENGTH: usize = 256;
pub const MAX_PROFILE_IMAGE_LENGTH: usize = 256;

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,
    pub tokens_per_creator: LookupMap<AccountId, UnorderedSet<TokenId>>,

    pub tokens_by_id: LookupMap<TokenId, Token>,

    pub token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,

    pub owner_id: AccountId,

    /// The storage size in bytes for one account.
    pub extra_storage_in_bytes_per_token: StorageUsage,

    pub metadata: LazyOption<NFTMetadata>,

    /// CUSTOM fields
    pub supply_cap_by_type: TypeSupplyCaps,
    pub tokens_per_type: LookupMap<TokenType, UnorderedSet<TokenId>>,
    pub token_types_locked: UnorderedSet<TokenType>,
    pub contract_royalty: u32,
    pub profiles: LookupMap<AccountId, Profile>,

    pub use_storage_fees: bool,
    pub free_mints: u64,
    pub version: u16,
}

#[derive(Debug, Clone, BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Profile {
    pub bio: String,
    pub image: String,
}

/// Helper structure to for keys of the persistent collections.
#[derive(BorshSerialize)]
pub enum StorageKey {
    TokensPerOwner,
    TokenPerOwnerInner { account_id_hash: CryptoHash },
    TokensPerCreator,
    TokenPerCreatorInner { account_id_hash: CryptoHash },
    TokensById,
    TokenMetadataById,
    NftMetadata,
    TokensPerType,
    TokensPerTypeInner { token_type_hash: CryptoHash },
    TokenTypesLocked,
    Profiles,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: ValidAccountId,
               metadata: NFTMetadata,
               supply_cap_by_type: TypeSupplyCaps,
               use_storage_fees: bool,
               free_mints: u64,
               unlocked: Option<bool>,
    ) -> Self {
        let mut this = Self {
            tokens_per_owner: LookupMap::new(StorageKey::TokensPerOwner.try_to_vec().unwrap()),
            tokens_per_creator: LookupMap::new(StorageKey::TokensPerCreator.try_to_vec().unwrap()),
            tokens_by_id: LookupMap::new(StorageKey::TokensById.try_to_vec().unwrap()),
            token_metadata_by_id: UnorderedMap::new(
                StorageKey::TokenMetadataById.try_to_vec().unwrap(),
            ),
            owner_id: owner_id.into(),
            extra_storage_in_bytes_per_token: 0,
            metadata: LazyOption::new(
                StorageKey::NftMetadata.try_to_vec().unwrap(),
                Some(&metadata),
            ),
            supply_cap_by_type,
            tokens_per_type: LookupMap::new(StorageKey::TokensPerType.try_to_vec().unwrap()),
            token_types_locked: UnorderedSet::new(StorageKey::TokenTypesLocked.try_to_vec().unwrap()),
            contract_royalty: 0,
            profiles: LookupMap::new(StorageKey::Profiles.try_to_vec().unwrap()),
            use_storage_fees,
            free_mints,
            version: 0,
        };

        if unlocked.is_none() {
            // CUSTOM - tokens are locked by default
            for token_type in this.supply_cap_by_type.keys() {
                this.token_types_locked.insert(&token_type);
            }
        }

        this.measure_min_token_storage_cost();

        this
    }

    #[init(ignore_state)]
    pub fn migrate_state_1() -> Self {
        let migration_version: u16 = 1;
        assert_eq!(env::predecessor_account_id(), env::current_account_id(), "Private function");

        #[derive(BorshDeserialize)]
        struct OldContract {
            tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,
            tokens_per_creator: LookupMap<AccountId, UnorderedSet<TokenId>>,
            tokens_by_id: LookupMap<TokenId, Token>,
            token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,
            owner_id: AccountId,
            extra_storage_in_bytes_per_token: StorageUsage,
            metadata: LazyOption<NFTMetadata>,
            supply_cap_by_type: TypeSupplyCaps,
            tokens_per_type: LookupMap<TokenType, UnorderedSet<TokenId>>,
            token_types_locked: UnorderedSet<TokenType>,
            contract_royalty: u32,
            profiles: LookupMap<AccountId, Profile>,
            use_storage_fees: bool,
        }

        let old_contract: OldContract = env::state_read().expect("Old state doesn't exist");

        Self {
            tokens_per_owner: old_contract.tokens_per_owner,
            tokens_per_creator: old_contract.tokens_per_creator,
            tokens_by_id: old_contract.tokens_by_id,
            token_metadata_by_id: old_contract.token_metadata_by_id,
            owner_id: old_contract.owner_id,
            extra_storage_in_bytes_per_token: old_contract.extra_storage_in_bytes_per_token,
            metadata: old_contract.metadata,
            supply_cap_by_type: old_contract.supply_cap_by_type,
            tokens_per_type: old_contract.tokens_per_type,
            token_types_locked: old_contract.token_types_locked,
            contract_royalty: old_contract.contract_royalty,
            profiles: old_contract.profiles,
            use_storage_fees: old_contract.use_storage_fees,
            free_mints: 3,
            version: migration_version,
        }
    }

    pub fn migrate_state_2(&mut self)  {
        assert_eq!(env::predecessor_account_id(), env::current_account_id(), "Private function");

        self.version = 2;

        self.update_media(
            "token-1622717738502".to_string(),
            "QmaU6GjLxthqVmi8njSGxwMXUZFsbzg7jx38sXYUA7FDgx".to_string(),
            "{\"media_lowres\":\"QmaU6GjLxthqVmi8njSGxwMXUZFsbzg7jx38sXYUA7FDgx\",\"creator_id\":\"rucommunity.near\",\"media_size\":90182,\"media_type\":\"image/png\"}".to_string()
        );

        self.update_media(
            "token-1622726365839".to_string(),
            "QmQ6XE8byf5zQo54kDRkzbKtqVojfE4ShKfrAxEah7du6e".to_string(),
            "{\"media_lowres\":\"QmeWvZGajwHz9pCgWwuUsyPYrebvf5JGaNy3S9nao5VFz8\",\"creator_id\":\"rucommunity.near\",\"media_size\":408914,\"media_type\":\"image/png\"}".to_string()
        );

        self.update_media(
            "token-1622732252389".to_string(),
            "QmTtshD6pyL6jRb6BtjwFedTzebZiaUShUvMpFuJnDqw56".to_string(),
            "{\"media_lowres\":\"QmPsAZ3a6CR8x2JbMH8rfhHcSToK8C1QbfMxPCwDZozfZN\",\"creator_id\":\"mattlock.near\",\"media_size\":157094,\"media_type\":\"image/png\"}".to_string()
        );

        self.update_media(
            "token-1622734908032".to_string(),
            "QmWRK2Qt1Ho2yWbaSMsSVPmbUsJAvJPJhQeJ2sAdjZAGbe".to_string(),
            "{\"media_lowres\":\"QmUMauiYyiWokEPSwkybEcG2XSHcwdB8emnTQ7zrs9YVGJ\",\"creator_id\":\"hear.near\",\"media_size\":2490742,\"media_type\":\"image/png\"}".to_string()
        );

        self.update_media(
            "token-1622734858519".to_string(),
            "QmZpzMGPh7oZUwQNnL68rFy5RsgwRCwaD5DnMjTX3Lnbwp".to_string(),
            "{\"media_lowres\":\"QmXYAWqDBcvBf3fYQyDjYgyupYVB63SaN2MZmXpmPqsJU7\",\"creator_id\":\"cats.near\",\"media_size\":129858,\"media_type\":\"image/png\"}".to_string()
        );

        self.update_media(
            "token-1622737257393".to_string(),
            "QmaAZNBWtYdUifi7BqFduNKJ3iHg18NMzBrSxnb7Nwwqcw".to_string(),
            "{\"media_lowres\":\"QmZWqdyvbgmFjjy1aydCXbQirAQUYuwkvkdXCQdqaD6nN4\",\"creator_id\":\"starpause.near\",\"media_size\":1233169,\"media_type\":\"image/gif\"}".to_string()
        );
        self.update_media(
            "token-1622737525868".to_string(),
            "QmUVV7rjwquW8qjyRLKMuktL6QzgGzXizudKCDZfabJed6".to_string(),
            "{\"media_lowres\":\"Qmem2vqPyNn9G9EnBRmYSFTpiggcbDQQgnkA1X3qohsACB\",\"creator_id\":\"blaze.near\",\"media_size\":5093,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622745019086".to_string(),
            "QmTU9MzXf72Cvcx8bxp2iUPncysv9HGj3S1fwgxviWEc45".to_string(),
            "{\"media_lowres\":\"QmUVaUbb9QtwAbxh876CSn7Ad6AwvucDuHrvgkFnRLbzkp\",\"creator_id\":\"zavodil.near\",\"media_size\":405447,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622745898027".to_string(),
            "QmfV9MSKhpkQygdbnRidpM8uNKtQMLvMGyGmcdZtoZo4u6".to_string(),
            "{\"media_lowres\":\"QmQ9LDr8zkeuSRggpymiqRPLk5x1CPXicYd2sqytVYYZ29\",\"creator_id\":\"cryptogarik.near\",\"media_size\":201856,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622747622933".to_string(),
            "QmPKGChPb7rH3DYb6gG4iAcGmq5jMctBRqMmE3AmDTzoVK".to_string(),
            "{\"media_lowres\":\"QmakcJ9pqwidbw7G2rAyU8ysMzWCatG3HUztbPGEUyuHTk\",\"creator_id\":\"dantochoicoin.near\",\"media_size\":25056,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622746458013".to_string(),
            "QmRKQzQbPMhXbYgG6ER8ywBSj516Z29mW89t23scZ83ibC".to_string(),
            "{\"media_lowres\":\"QmQrygMGYxGvfyEnCNPjP8Z9SpAExwikzEcLHAsKTiD7Rs\",\"creator_id\":\"profit.near\",\"media_size\":278215,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622747945083".to_string(),
            "QmfMnkPT5NcEDrG5xbwyc9CmN5GMV9VnCALZnQE6nXRWgR".to_string(),
            "{\"media_lowres\":\"QmQoRVHbgqVRUiVdwEEBjxNpp3KDKqWBBo4Pb7vDYCRDXX\",\"creator_id\":\"vlad.near\",\"media_size\":1488866,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622749382438".to_string(),
            "QmUSHPdLPF7uGZuthWn2PwRjrDibS4Y8CCGKdZMEBHWQJ8".to_string(),
            "{\"media_lowres\":\"QmR2nFNk4LmvvMUUqxg8AdprEjZxVcEGg3cXuCfCPAr4zU\",\"creator_id\":\"starpause.near\",\"media_size\":4002723,\"media_type\":\"image/gif\"}".to_string()
        );
        self.update_media(
            "token-1622749956102".to_string(),
            "QmQViAhtZX5Eci4aRPStT9Fr76kCbuJFfzqPUQasR1B8ZH".to_string(),
            "{\"media_lowres\":\"QmbRARTrTwB3C8p2jYYKQKuMCsr6BFY2LBCFF4ndChwwpR\",\"creator_id\":\"starpause.near\",\"media_size\":1886062,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622750305496".to_string(),
            "QmVVjDAA85hicsQaRokow353oMNPUJH8MfzmRSKCxbGSTn".to_string(),
            "{\"media_lowres\":\"QmRbAWRvnnVVewfP5wmNBjWZxiunE8FTDtpxfzNCMvYZe2\",\"creator_id\":\"p0k.near\",\"media_size\":143121,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622752153673".to_string(),
            "QmQC52G46GLGtX5jkQMP1E7CP3KYJCQheRt9gePyuxe28d".to_string(),
            "{\"media_lowres\":\"QmdVW7PdMnS3EzuJGrfo3obAVJ42hr5Gn2TnaFvraJYwcY\",\"creator_id\":\"deus.near\",\"media_size\":1948176,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622754049292".to_string(),
            "QmNUhRaEQkoSTGDr3ZXvtS5TbFHWfBCD3oAZsumDTb8xSv".to_string(),
            "{\"media_lowres\":\"QmTqBZ9hiRMBAk3kk1FioBxFbeu5Qk68ea6gLxk9P1Qcou\",\"creator_id\":\"tradewife.near\",\"media_size\":936262,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622755023242".to_string(),
            "QmZFf8CnjfGDmZVF1fkSAW68V9WKYL6rLiinSND9JLPee5".to_string(),
            "{\"media_lowres\":\"QmeAzuqrY2oiXDwQNnF7PE7nPp2eh8KqZhjwDmCZnEvCgc\",\"creator_id\":\"futured.near\",\"media_size\":3569,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622759948744".to_string(),
            "QmRLhW4o7mgWK4AMfCftz6Ysnrd1sFk4ZADSuLreapwtBX".to_string(),
            "{\"media_lowres\":\"QmSWnaL95pnUnDTceb5THRHK1qy8UrNgiHRPmd5CipLHaW\",\"creator_id\":\"heliko.near\",\"media_size\":6390938,\"media_type\":\"image/gif\"}".to_string()
        );
        self.update_media(
            "token-1622760404851".to_string(),
            "QmRhrWVjseCnT6ydbWQR45mKXkA61jsLg2XijynfLkiU5r".to_string(),
            "{\"media_lowres\":\"QmdN5m49rB3BGmZMrTSdtGBuWaYXqrSJR3SVC1MvrTkc3Y\",\"creator_id\":\"infinitynft.near\",\"media_size\":22211,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622762711356".to_string(),
            "QmXAEqvwvXYsfkifFYBgpBERtLYQG913CyLVYLnvV2dAQD".to_string(),
            "{\"media_lowres\":\"QmTGszwagKNvqT3eTiNu4Gfp2X2AmCtDQC5BmtzaYAGiCC\",\"creator_id\":\"infinitynft.near\",\"media_size\":93374,\"media_type\":\"image/gif\"}".to_string()
        );
        self.update_media(
            "token-1622768714384".to_string(),
            "QmfPoYsEMu92shQzb5BmucNtM5grBbdpxCabPDf7rugTtP".to_string(),
            "{\"media_lowres\":\"QmPcfjA9KojxwvQd2vtepTTz9sNj5Vs77GThq33f7Zncwa\",\"creator_id\":\"whendacha.near\",\"media_size\":138367,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622772217361".to_string(),
            "QmevAmH5KsrAD4Zrnm1yP95fPk9rtMw47K2upZqcNdaMFj".to_string(),
            "{\"media_lowres\":\"QmW3sHqRVFEK48sRsdCbjWrAUbosQR1qUfbxPoCNQ73yfP\",\"creator_id\":\"icebear.near\",\"media_size\":44042,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622773609641".to_string(),
            "QmTA2zP4NF2qHDX2WmJt6r8aBT7t3fbDSZt8cMHzMvFsiN".to_string(),
            "{\"media_lowres\":\"QmTA2zP4NF2qHDX2WmJt6r8aBT7t3fbDSZt8cMHzMvFsiN\",\"creator_id\":\"kotleta.near\",\"media_size\":1087129,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622775224708".to_string(),
            "QmRsDZQdNr7WEnwy8EKn7ny5u3jEtnBCymKRdTxdxtCzrR".to_string(),
            "{\"media_lowres\":\"QmRsDZQdNr7WEnwy8EKn7ny5u3jEtnBCymKRdTxdxtCzrR\",\"creator_id\":\"icebear.near\",\"media_size\":48586,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622801932684".to_string(),
            "Qmc7cpPKXGFuiEbP77JhA4TTLaVH8bST1yo3pQt9sxvLX9".to_string(),
            "{\"media_lowres\":\"QmcHgdxjQfB5QKDTEny3cA3tzMhtMfuKgnmMVPiD78Fp75\",\"creator_id\":\"jiangjingwei.near\",\"media_size\":370588,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622813897310".to_string(),
            "QmdrP9cPg4VZ39JXVXcL3Yhwpahu5wKZtvv9kK26AVA9SA".to_string(),
            "{\"media_lowres\":\"QmdrP9cPg4VZ39JXVXcL3Yhwpahu5wKZtvv9kK26AVA9SA\",\"creator_id\":\"juter.near\",\"media_size\":35514,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622833149704".to_string(),
            "QmfEDR6w8mLD61EKZUcx5xdeuV7UHRSfGE4gBoTJbZ3Gsp".to_string(),
            "{\"media_lowres\":\"QmUVqZ3sVcEuCb8NwZ6tMcpH2dnRY57zLxhDLccXZNwLGG\",\"creator_id\":\"crasskitty.near\",\"media_size\":252460,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622836898356".to_string(),
            "QmPtM7WVf9RnLqZg7x4n3b4cZDtYhbvFtYcqN9VA6T2DB3".to_string(),
            "{\"media_lowres\":\"QmVK3sNNkhb3gVaxpjqTeMqDsQLRoaNvFXF7KZgoyPvkko\",\"creator_id\":\"lauter.near\",\"media_size\":1105576,\"media_type\":\"image/gif\"}".to_string()
        );
        self.update_media(
            "token-1622841390824".to_string(),
            "QmTSDyJaHtMB6HL23RVyYeFCjhQqKYgRxaH5AXXMQeeTZ4".to_string(),
            "{\"media_lowres\":\"QmWtdUWsVxi4thabQ715epsJBxT5DGYXNyJwdRKKRDMp2Y\",\"creator_id\":\"nfthub.near\",\"media_size\":1080876,\"media_type\":\"image/gif\"}".to_string()
        );
        self.update_media(
            "token-1622841845535".to_string(),
            "QmRLm5b7mqTw6ciTdJG8HFHT4QmV3PBQpVuBKY4Mhebwvf".to_string(),
            "{\"media_lowres\":\"QmRLm5b7mqTw6ciTdJG8HFHT4QmV3PBQpVuBKY4Mhebwvf\",\"creator_id\":\"blaze.near\",\"media_size\":90587,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622855341177".to_string(),
            "QmXg3JUSZ4qJ8LWhPYHdavtmLYQMyhfVY3n3Ge2gcpxp6X".to_string(),
            "{\"media_lowres\":\"QmXg3JUSZ4qJ8LWhPYHdavtmLYQMyhfVY3n3Ge2gcpxp6X\",\"creator_id\":\"idena.near\",\"media_size\":2359346,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622855611781".to_string(),
            "QmQ1EB6dnv89Ae4ALuLsAN9tnaKH7M2amX5tFUiBeWAjQK".to_string(),
            "{\"media_lowres\":\"QmTq4mXkgJY1apPxPDhDMyWRQrUy9me6Gz5DmZJe4E5MLn\",\"creator_id\":\"idena.near\",\"media_size\":3220531,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622855697018".to_string(),
            "Qmb48BxuviTzxghnmvnEWQfBthmf8SjWeB4YTE3ZzXNQGb".to_string(),
            "{\"media_lowres\":\"QmbD2PA263epLmDs4rjVtcPuboYG9vc5Lb23U9ZHPyxhQs\",\"creator_id\":\"idena.near\",\"media_size\":2494726,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622855781155".to_string(),
            "QmVQawAyWeLAmJcK8pr4o3o6Qzu5NmoEuJB1vb2u32DaMm".to_string(),
            "{\"media_lowres\":\"QmRvi5WwyE4kWBDR91FbVkGTFZ5qBoEg9FRzCvwR8XzMjW\",\"creator_id\":\"idena.near\",\"media_size\":1610887,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622855857590".to_string(),
            "QmXrtyVFBwDdfkCx12mpnX8HL692PZXtJQQwSJwygA3yrG".to_string(),
            "{\"media_lowres\":\"QmbmCS2N5ijU8YGc7zpaMhhqXacs77tNzrMPfC8edzdk6J\",\"creator_id\":\"idena.near\",\"media_size\":1861351,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622855909743".to_string(),
            "Qmcgt6kEwfrmeqZzkBak672X3UWewTcYjbhyx92HBAVX1L".to_string(),
            "{\"media_lowres\":\"QmS81pJN7vtK3eCjuKewZes1KpFqd1qmDrhMLBxR6ZxHq5\",\"creator_id\":\"idena.near\",\"media_size\":2932146,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622855965927".to_string(),
            "QmWpDZ4WRqbsSfPxmAkN3QDAAdRhnkpTH7cteC255af8aP".to_string(),
            "{\"media_lowres\":\"QmRqxd331oQxaXTVSuTGooeDiN3gxnezC8QjrRRN6W7jWD\",\"creator_id\":\"idena.near\",\"media_size\":2967167,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622856031935".to_string(),
            "QmTY4dDJhaN9PDieab8BUDrho7RwKdem2c4KjSU3H7N5JK".to_string(),
            "{\"media_lowres\":\"QmcBYmfLxk6Jhn3ZjJnPHkarHJ9s1tJgc2rbPHF8868bhY\",\"creator_id\":\"idena.near\",\"media_size\":2554534,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622856179813".to_string(),
            "QmNT87yfaResVm8oQ38xzyhc2Nfk6tfUKw8eipYYzdin5A".to_string(),
            "{\"media_lowres\":\"QmaFDUnjhRqP2QBmnf478AFoudFJ2feFpP3vWcQYoyPBMo\",\"creator_id\":\"idena.near\",\"media_size\":3056138,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1622869963611".to_string(),
            "QmeYEcRPGf2erSRgKTTfrVBNKeDKUoHvf6qo4vwYLhrSCm".to_string(),
            "{\"media_lowres\":\"QmWRWM4mKz7Nct4hsGdZZaq3njytie6DdELDCjH28Nr4FU\",\"creator_id\":\"starpause.near\",\"media_size\":339477,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622870265685".to_string(),
            "QmRw81SDBEZxy4Q8KqTkh1qkjA5YELYLRMcamBjMP3U8rb".to_string(),
            "{\"media_lowres\":\"QmWXPKhd6wpXtPYGnydcnYN3jWPA1MLPT5ok81JqwHirG8\",\"creator_id\":\"vlad.near\",\"media_size\":1527390,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622871699947".to_string(),
            "QmZiy8nCR5E9hsnbfHsms2xxisTT4hnzBbsQHtjvswUDDN".to_string(),
            "{\"media_lowres\":\"Qmeou337T5d9J9awD7M4dYrT1MQEboz1QjgHjPShsZ5pDE\",\"creator_id\":\"starpause.near\",\"media_size\":2706753,\"media_type\":\"image/gif\"}".to_string()
        );
        self.update_media(
            "token-1622925576301".to_string(),
            "QmdMMFf62Aad4ksScwrUNJtKNNyrA5xwZyPdpjxYouaCbh".to_string(),
            "{\"media_lowres\":\"QmfXqyPrWXBjZAVDPdypRgWdVrN63XqKfzTV9zjVggjWdH\",\"creator_id\":\"lrojas.near\",\"media_size\":1299087,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622928399945".to_string(),
            "QmQctpqHBVSUwC1UZT12CSD2cLkLwpYJYQe81PJxtzP2dm".to_string(),
            "{\"media_lowres\":\"QmQy2GTqkA9demvDCmiCeHbuyUjfHweiZvtEG9QTCYemkE\",\"creator_id\":\"mob.near\",\"media_size\":174486,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622940701852".to_string(),
            "QmUqye7JmZEHvA978wALubaGidS3xx3hifosJ6BbsYUYUQ".to_string(),
            "{\"media_lowres\":\"QmRLxkheLLpZLVxFjsJTTAT9NVR4w3xCPHziH6EpYqpznA\",\"creator_id\":\"mob.near\",\"media_size\":2519659,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1622958247904".to_string(),
            "QmUVHkf2HgE3Lb7BUf6P3sr2dQeBGgaScBnfu12ugH82sw".to_string(),
            "{\"media_lowres\":\"QmUqdtk2LUVTWbeK3peYBcVzGibmj9h3zW8C3tK7pooBcd\",\"creator_id\":\"nagapickle.near\",\"media_size\":3217687,\"media_type\":\"video/quicktime\"}".to_string()
        );
        self.update_media(
            "token-1622970167567".to_string(),
            "QmZw6NVjqG88TF8eWmnwBdsFbDQmiLtfh7NDjhJnH5Fu3u".to_string(),
            "{\"media_lowres\":\"QmZw6NVjqG88TF8eWmnwBdsFbDQmiLtfh7NDjhJnH5Fu3u\",\"creator_id\":\"hungaus811.near\",\"media_size\":390151,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1623002729572".to_string(),
            "QmVxqBwGA5F9hMi5cDFhPZTpq7dRqKv5aim8PrpJJV5KXF".to_string(),
            "{\"media_lowres\":\"QmUTbHiCtb7jZ6dLdbKJkbfo21UjGAYCyzrFuGAZxvnTaq\",\"creator_id\":\"anftimatter.near\",\"media_size\":2989842,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623004767880".to_string(),
            "QmUTbHiCtb7jZ6dLdbKJkbfo21UjGAYCyzrFuGAZxvnTaq".to_string(),
            "{\"media_lowres\":\"QmTorYkCSX2Szn9gwJvjNi54JTYsjrfNsKgodtaqiuxU2c\",\"creator_id\":\"anftimatter.near\",\"media_size\":3057663,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623033153061".to_string(),
            "QmT11Bx7s5JdQJ1k51eqEy22X9CUwNwzT5A2FBHL1qZ5tS".to_string(),
            "{\"media_lowres\":\"QmasCxDKF2fNoJzTJoJVZC4iFTn1zbj82jP9ZdiZR4c34N\",\"creator_id\":\"infinitynft.near\",\"media_size\":4469756,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623081844632".to_string(),
            "Qme8mtU4k3vM69tnf7xNRHQqqMVvspKD8TbaxuCXDcnLbf".to_string(),
            "{\"media_lowres\":\"Qmb7hAqKFkEM8N1rLWnXaEgmHHdirwjC3Cs4wLVveRTUvy\",\"creator_id\":\"lrojas.near\",\"media_size\":9143605,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1623116088460".to_string(),
            "QmPH2TgLSja3kqCh6RBrrtWd4f7kAnTcwJNfVUrFWJ1VPD".to_string(),
            "{\"media_lowres\":\"QmPH2TgLSja3kqCh6RBrrtWd4f7kAnTcwJNfVUrFWJ1VPD\",\"creator_id\":\"vlad.near\",\"media_size\":27800,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1623116422026".to_string(),
            "QmSS8Dwhds2xt3m7rA1AVyaTfyDZ2HX27CHD8tNvGoh1xw".to_string(),
            "{\"media_lowres\":\"Qmf6AHKjsDUxU6VTtdrFSdE6Dyhmd4dUWBnoFNBc3cTRUY\",\"creator_id\":\"boomerang.near\",\"media_size\":25880,\"media_type\":\"image/webp\"}".to_string()
        );
        self.update_media(
            "token-1623122251881".to_string(),
            "QmfCqrKNi4woEX2QW22191N249YTimAiTuUFymUNvz5gwB".to_string(),
            "{\"media_lowres\":\"QmfCqrKNi4woEX2QW22191N249YTimAiTuUFymUNvz5gwB\",\"creator_id\":\"chenjuan.near\",\"media_size\":7211,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623140564255".to_string(),
            "QmaYjLbYcb5noBdfCtwJX2aNPaRxAzJrYezVyp5G8j395P".to_string(),
            "{\"media_lowres\":\"QmQBaDWiDBNvrJevGRk4aBv3mZPnuRncxUvcVZ89jKsoPd\",\"creator_id\":\"kop0211.near\",\"media_size\":1401975,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623143959522".to_string(),
            "QmYP4j4QT1wMEZvQQzsjHttRe59Wtvo6utyPmfhdxUbVSo".to_string(),
            "{\"media_lowres\":\"QmR1NDPnJ9TZHNrNhh3DsrGMBSMGyfUt9xUgVqHyMnWZLp\",\"creator_id\":\"14b541d0a0f861ecdf8e70d7dc8323f9b7cbb906a637fd37ef4553b3442a9c11\",\"media_size\":377488,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623144461320".to_string(),
            "QmQdNovuoJ3C6zoRBapYtDCrsWZWqaSfCjcCqJAVDj5gGC".to_string(),
            "{\"media_lowres\":\"QmSkFzUvP6sSiTf7VBcWUViWMVj7ZPteAtAL69BQLNvWHC\",\"creator_id\":\"saturdayvx.near\",\"media_size\":102855,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623144812778".to_string(),
            "QmQc7c9j2zg4wNNSeQp6kdvWKTKZdY6GiXZgd3TNr1qi8e".to_string(),
            "{\"media_lowres\":\"QmY1XsC2fS8HqKHjJc2tZJqsYYyJWDhndD4aTcMV1Gip4u\",\"creator_id\":\"saturdayvx.near\",\"media_size\":504758,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623144906988".to_string(),
            "QmfBvpS8FGumSfhdXqdGkTCtZgkGHAnRAbbF1LM5GsHTZt".to_string(),
            "{\"media_lowres\":\"QmV8kvMfE3iqQQdZMPnqxcGeyvoJGk6kJb6shnjjT38HeK\",\"creator_id\":\"saturdayvx.near\",\"media_size\":412083,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623144992207".to_string(),
            "QmRrnHbVMAAvbfnxz3EqjAiGDjwLEc3jJQ5zJcbVC4dZY9".to_string(),
            "{\"media_lowres\":\"QmUKbXzGMJ96k9Nj24Qi3eDuLHXzje3wo4TVQuDeWGC3dt\",\"creator_id\":\"saturdayvx.near\",\"media_size\":499016,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623145052174".to_string(),
            "QmSDiC6YrmVx26MmwyUN7DJvw9rGU5Vmod7WCGbxuKzHU3".to_string(),
            "{\"media_lowres\":\"Qmbm6ZNm9oNBfTS8phunVZDcEPKR86XirHqZaifdV7EdBn\",\"creator_id\":\"saturdayvx.near\",\"media_size\":404165,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623145131444".to_string(),
            "Qmc19J8r1vzVWAJ18yB5Uxek3mJRYVds9o9vGgmC1RYnLV".to_string(),
            "{\"media_lowres\":\"QmPAUiAYg8uLwjZWCuW4hZFsAQD8Ury1obW9J4K1fe3Q5V\",\"creator_id\":\"saturdayvx.near\",\"media_size\":68496,\"media_type\":\"image/jpeg\"}".to_string()
        );
        self.update_media(
            "token-1623159768550".to_string(),
            "QmYkd6q5XQgy7LSvbghc59fLRaZn6eRj9oeERRdUGjeaTQ".to_string(),
            "{\"media_lowres\":\"QmSvegLsm7haDG2keFYjiLwkZ2pQhQTkcJyS7bPA1qHfi9\",\"creator_id\":\"lrojas.near\",\"media_size\":6626311,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1623160702324".to_string(),
            "QmVmLoGTuBVvptD7RMMNobyJhNey8ww4dYJ8RzBceXh6kU".to_string(),
            "{\"media_lowres\":\"QmSd7QgKxA18WZZEam6rynHb5zJAcVY4AMo93ktPiRzDGc\",\"creator_id\":\"lrojas.near\",\"media_size\":8632258,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1623160815776".to_string(),
            "QmWXV5bRouKRkfBKTW41w9wpTfPAhxRSVfTHGWBvzyHTfW".to_string(),
            "{\"media_lowres\":\"QmXPQR6MyqJF95ScMQUmN3GeByodZ4RiuUDVLPVrkctfXL\",\"creator_id\":\"lrojas.near\",\"media_size\":7870700,\"media_type\":\"image/png\"}".to_string()
        );
        self.update_media(
            "token-1623179119903".to_string(),
            "QmawHxp89hWGTQCGvgmnf2zu2Btr5tP6aa9jyf6HVKgg9B".to_string(),
            "{\"media_lowres\":\"QmTtzWFk7vZhQUmKKLNm631rGBCvjjr1sScGNNfZEMFQkA\",\"creator_id\":\"hansson.near\",\"media_size\":2219135,\"media_type\":\"image/png\"}".to_string()
        );
    }

    pub fn migrate_state_2_1(&mut self) {
        assert_eq!(env::predecessor_account_id(), env::current_account_id(), "Private function");

        self.update_media(
            "token-1622809123722".to_string(),
            "QmdcZepFWh65VBmDUVDsPmamzY5ysApZ9RmFMkjrkSPnU6".to_string(),
            "{\"media_lowres\":\"QmdQjs9LUEwFVrYsAqa2zwifmPQCoxAEcXfCa7iNiSc8WJ\",\"creator_id\":\"rucommunity.near\",\"media_size\":750926,\"media_type\":\"image/gif\"}".to_string()
        );
    }

    pub fn get_version(&self) -> u16 {
        self.version
    }

    pub(crate) fn update_media(&mut self, token_id: TokenId, high_res: String, extra: String){
        let mut metadata = self.token_metadata_by_id.get(&token_id).unwrap();

        metadata.media = Some(high_res);
        metadata.extra = Some(extra);
        self.token_metadata_by_id.insert(&token_id, &metadata);

        log!("{}", token_id);
    }

    pub fn set_use_storage_fees(&mut self, use_storage_fees: bool) {
        assert_eq!(env::predecessor_account_id(), env::current_account_id(), "Private function");
        self.use_storage_fees = use_storage_fees;
    }

    pub fn is_free_mint_available(&self, account_id: AccountId) -> bool {
        if !self.use_storage_fees {
            self.get_tokens_created(account_id) < self.free_mints
        } else {
            false
        }
    }

    pub fn get_tokens_created(&self, account_id: AccountId) -> u64 {
        match self.tokens_per_creator.get(&account_id) {
            Some(tokens_creator) => {
                tokens_creator.len()
            }
            None => {
                0
            }
        }
    }

    pub fn get_free_mints(&self) -> u64 {
        self.free_mints
    }

    pub fn get_use_storage_fees(&self) -> bool {
        self.use_storage_fees
    }

    pub fn get_profile(&self, account_id: ValidAccountId) -> Option<Profile> {
        let account_id: AccountId = account_id.into();
        self.profiles.get(&account_id)
    }

    pub fn set_profile(&mut self, profile: Profile) {
        assert!(
            profile.bio.len() < MAX_PROFILE_BIO_LENGTH,
            "Profile bio length is too long"
        );

        assert!(
            profile.image.len() < MAX_PROFILE_IMAGE_LENGTH,
            "Profile image length is too long"
        );

        let predecessor_account_id = env::predecessor_account_id();

        self.profiles.insert(&predecessor_account_id, &profile);
    }

    fn measure_min_token_storage_cost(&mut self) {
        let initial_storage_usage = env::storage_usage();
        let tmp_account_id = "a".repeat(64);
        let u = UnorderedSet::new(
            StorageKey::TokenPerOwnerInner {
                account_id_hash: hash_account_id(&tmp_account_id),
            }
                .try_to_vec()
                .unwrap(),
        );
        self.tokens_per_owner.insert(&tmp_account_id, &u);

        let tokens_per_owner_entry_in_bytes = env::storage_usage() - initial_storage_usage;
        let owner_id_extra_cost_in_bytes = (tmp_account_id.len() - self.owner_id.len()) as u64;

        self.extra_storage_in_bytes_per_token =
            tokens_per_owner_entry_in_bytes + owner_id_extra_cost_in_bytes;

        self.tokens_per_owner.remove(&tmp_account_id);
    }

    /// CUSTOM - setters for owner

    pub fn set_contract_royalty(&mut self, contract_royalty: u32) {
        self.assert_owner();
        assert!(contract_royalty <= CONTRACT_ROYALTY_CAP, "Contract royalties limited to 10% for owner");
        self.contract_royalty = contract_royalty;
    }

    pub fn add_token_types(&mut self, supply_cap_by_type: TypeSupplyCaps, unlocked: Option<bool>) {
        self.assert_owner();
        for (token_type, hard_cap) in &supply_cap_by_type {
            if unlocked.is_none() {
                self.token_types_locked.insert(&token_type);
            }
            self.supply_cap_by_type.insert(token_type.to_string(), *hard_cap);

            if token_type == "HipHopHeadsFirstEditionMedley" {
                let keys = self.token_metadata_by_id.keys_as_vector();
                for i in 0..keys.len() {
                    let token_id = keys.get(i).unwrap();
                    if let Some(token) = self.tokens_by_id.get(&token_id) {
                        let mut token_2 = token;
                        token_2.royalty.insert("edyoung.near".to_string(), 200);
                        self.tokens_by_id.insert(&token_id, &token_2);
                    }
                }
            }
        }
    }

    pub fn unlock_token_types(&mut self, token_types: Vec<String>) {
        for token_type in &token_types {
            self.token_types_locked.remove(&token_type);
        }
    }

    /// CUSTOM - views

    pub fn get_contract_royalty(&self) -> u32 {
        self.contract_royalty
    }

    pub fn get_supply_caps(&self) -> TypeSupplyCaps {
        self.supply_cap_by_type.clone()
    }

    pub fn get_token_types_locked(&self) -> Vec<String> {
        self.token_types_locked.to_vec()
    }

    pub fn is_token_locked(&self, token_id: TokenId) -> bool {
        let token = self.tokens_by_id.get(&token_id).expect("No token");
        assert_eq!(token.token_type.is_some(), true, "Token must have type");
        let token_type = token.token_type.unwrap();
        self.token_types_locked.contains(&token_type)
    }
}
