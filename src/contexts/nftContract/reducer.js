import { GOT_GEM, GOT_GEMS, GOT_GEMS_FOR_OWNER, GOT_GEMS_BATCH, CLEAR_STATE } from './types';

export const initialNftContractState = {
  gem: null,
  gems: [],
  gemsForOwner: [],
};

export const nftContractReducer = (currentState = initialNftContractState, action) => {
  switch (action.type) {
    case GOT_GEM:
      return {
        ...currentState,
        gem: action.payload.gem,
      };

    case GOT_GEMS:
      return {
        ...currentState,
        gems: action.payload.gems,
      };

    case GOT_GEMS_FOR_OWNER:
      return {
        ...currentState,
        gemsForOwner: action.payload.gems,
      };

    case GOT_GEMS_BATCH:
      return {
        ...currentState,
        gemsBatch: action.payload.gems,
      };

    case CLEAR_STATE:
    default:
      return initialNftContractState;
  }
};
