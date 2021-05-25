import { GOT_GEMS, GOT_GEMS_FOR_OWNER, GOT_GEMS_BATCH, CLEAR_STATE } from './types';

export const initialNftContractState = {
  gems: [],
  gemsForOwner: [],
};

export const nftContractReducer = (currentState = initialNftContractState, action) => {
  switch (action.type) {
    case GOT_GEMS:
      return {
        ...currentState,
        gems: action.payload.gems,
      };

    case GOT_GEMS_FOR_OWNER:
      return {
        ...currentState,
        gemsForOwner: action.payload.gemsForOwner,
      };

    case GOT_GEMS_BATCH:
      return {
        ...currentState,
        gemsBatch: action.payload.gemsBatch,
      };

    case CLEAR_STATE:
    default:
      return initialNftContractState;
  }
};
