import { formatNearAmount } from 'near-api-js/lib/utils/format';

// todo: wait for contract improvements: right now it is impossible to set starting bid, only the price of 'buy now'
export const getNextBidNearsFormatted = (nftOnSale) => {
  const currentPriceNearsRaw = nftOnSale?.bids?.near?.price;
  const minPrice = nftOnSale?.conditions?.near || 0;

  return currentPriceNearsRaw ? +formatNearAmount(currentPriceNearsRaw) + 1 : formatNearAmount(minPrice);
};
