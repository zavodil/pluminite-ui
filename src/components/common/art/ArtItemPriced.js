import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getNextBidNearsFormatted } from '../../../utils/nears';

import { MarketContractContext } from '../../../contexts';

import ArtItem from './ArtItem';

// todo: remove for production
const placeholderBid = 55;

const ArtItemPriced = ({ gemOnSale, bid, bidAvailable, ...props }) => {
  const { offer } = useContext(MarketContractContext);

  const processBid = async (e) => {
    e.preventDefault();

    await offer(gemOnSale.token_id, +getNextBidNearsFormatted(gemOnSale));
  };

  return <ArtItem buttonText={`Bid ${bid}Ⓝ`} isButtonDisabled={!bidAvailable} {...props} onButtonClick={processBid} />;
};

ArtItemPriced.propTypes = {
  bid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bidAvailable: PropTypes.bool,
  // todo: add type for union of nft and sale
  gemOnSale: PropTypes.object,
};

ArtItemPriced.defaultProps = {
  // todo: remove for production
  bid: placeholderBid,
  bidAvailable: true,
};

export default ArtItemPriced;
