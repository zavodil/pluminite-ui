import { formatNearAmount } from 'near-api-js/lib/utils/format';

export const getNextBidNearsFormatted = (nftOnSale) => {
  const currentPriceNearsRaw = nftOnSale?.bids?.near?.price;
  const minPrice = nftOnSale?.conditions?.near || 0;

  return currentPriceNearsRaw ? +formatNearAmount(currentPriceNearsRaw) + 1 : formatNearAmount(minPrice);
};
