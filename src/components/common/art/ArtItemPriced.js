import React from 'react';
import PropTypes from 'prop-types';

import ArtItem from './ArtItem';

// todo: remove for production
const placeholderBid = 55;

const ArtItemPriced = ({ bid, bidAvailable, ...props }) => (
  <ArtItem buttonText={`Bid ${bid}Ⓝ`} isButtonDisabled={!bidAvailable} {...props} />
);

ArtItemPriced.propTypes = {
  bid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bidAvailable: PropTypes.bool,
};

ArtItemPriced.defaultProps = {
  // todo: remove for production
  bid: placeholderBid,
  bidAvailable: true,
};

export default ArtItemPriced;
