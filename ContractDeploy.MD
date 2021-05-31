// deploy nft contract
yarn dev 

// get dev-1622461954457-1740773 - your NFT contract

// create market contract 
near create_account market.dev-1622461954457-1740773 --masterAccount=dev-1622461954457-1740773 --initial-balance 50

// deploy nft market contract
near deploy --accountId=market.dev-1622461954457-1740773 --wasmFile=.../path_to/market.wasm

// init nft contract
near call dev-1622461954457-1740773 new '{"owner_id":"dev-1622461954457-1740773","metadata":{"spec":"nft-1","name":"Pluminite","symbol":"GEM"},"supply_cap_by_type":{"test": "1000000"}, "unlocked": true, "use_storage_fees": false}' --accountId=dev-1622461954457-1740773

// init market 
near call market.dev-1622461954457-1740773 new '{"owner_id": "dev-1622461954457-1740773", "ft_token_ids": [], "use_storage_fees": false}' --accountId=dev-1622461954457-1740773