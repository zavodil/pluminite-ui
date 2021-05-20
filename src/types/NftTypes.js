import PropTypes from 'prop-types';

// todo: review after integration with nfr contract
export const NftType = PropTypes.shape({
  title: PropTypes.string,
  description: PropTypes.string,
  startingBid: PropTypes.string,
  creator: PropTypes.string,
  creatorRoyalty: PropTypes.string,
  collaborators: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.string,
      royalty: PropTypes.string,
    })
  ),
  artDataUrl: PropTypes.string,
});
export const NftTypeRequired = NftType.isRequired;
