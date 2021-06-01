import Big from 'big.js';
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format';

import { APP } from '../constants';

Big.PE = 100;

// todo: wait for contract improvements: right now it is impossible to set starting bid, only the price of 'buy now'
export const getNextBidNearsFormatted = (nftOnSale) => {
  const currentPriceNearsRaw = nftOnSale?.bids?.near?.price;
  const minPrice = nftOnSale?.conditions?.near || 0;

  return currentPriceNearsRaw
    ? formatNearAmount(new Big(currentPriceNearsRaw).plus(new Big(parseNearAmount(APP.NEARS_TO_NEXT_BID))).toString())
    : formatNearAmount(minPrice);
};
