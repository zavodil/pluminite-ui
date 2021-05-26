import { CLEAR_STATE, GOT_MIN_STORAGE } from './types';

export const initialMarketContractState = {
  minStorage: null,
};

export const marketContractReducer = (currentState = initialMarketContractState, action) => {
  switch (action.type) {
    case GOT_MIN_STORAGE:
      return {
        ...currentState,
        minStorage: action.payload.minStorage,
      };

    case CLEAR_STATE:
    default:
      return initialMarketContractState;
  }
};
