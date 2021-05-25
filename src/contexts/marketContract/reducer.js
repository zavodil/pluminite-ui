import { CLEAR_STATE } from './types';

export const initialMarketContractState = {};

export const marketContractReducer = (currentState = initialMarketContractState, action) => {
  switch (action.type) {
    case CLEAR_STATE:
    default:
      return initialMarketContractState;
  }
};
