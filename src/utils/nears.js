import Big from 'big.js';
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format';

import { APP } from '~/constants';

Big.PE = 100;

export const convertYoctoNearsToNears = (yoctoNears, precision = 2) => {
  return new Big(yoctoNears)
    .div(10 ** 24)
    .round(precision)
    .toString();
};

// todo: wait for contract improvements: right now it is impossible to set starting bid, only the price of 'buy now'
export const getNextBidNearsFormatted = (nftOnSale) => {
  const currentPriceNearsRaw = nftOnSale?.bids?.near?.price;
  const minPrice = nftOnSale?.conditions?.near || 0;

  return currentPriceNearsRaw
    ? formatNearAmount(new Big(currentPriceNearsRaw).plus(new Big(parseNearAmount(APP.NEARS_TO_NEXT_BID))).toString())
    : formatNearAmount(minPrice);
};

// todo: wait for contract improvements: right now it is impossible to set starting bid, only the price of 'buy now'
export const getNextBidNears = (nftOnSale) => {
  const currentPriceNearsRaw = nftOnSale?.bids?.near?.price;
  const minPrice = nftOnSale?.conditions?.near || 0;

  return currentPriceNearsRaw
    ? convertYoctoNearsToNears(
        new Big(currentPriceNearsRaw).plus(new Big(parseNearAmount(APP.NEARS_TO_NEXT_BID))).toString()
      )
    : convertYoctoNearsToNears(minPrice);
};
