import PropTypes from 'prop-types';

// todo: review after integration with nft contract
export const NftType = PropTypes.shape({
  title: PropTypes.string,
  description: PropTypes.string,
  conditions: PropTypes.shape({
    near: PropTypes.string,
  }),
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
