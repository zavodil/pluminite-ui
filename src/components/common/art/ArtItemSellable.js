import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import ArtItem from './ArtItem';

const ArtItemSellable = ({ forwardedRef, nft, ...props }) => {
  const history = useHistory();

  const onSellButtonClick = (e) => {
    e.preventDefault();

    history.push(`/gem/${nft.token_id}`);
  };

  const onTransferButtonClick = (e) => {
    e.preventDefault();

    history.push(`/transfer-gem/${nft.token_id}`);
  };

  return <ArtItem ref={forwardedRef} nft={nft} 
    buttonText="Sell" 
    onButtonClick={onSellButtonClick}
    transferButtonText = "Transfer" 
    onTransferButtonClick={onTransferButtonClick}
    {...props} />;
};

ArtItemSellable.propTypes = {
  nft: PropTypes.shape({
    token_id: PropTypes.string,
  }),
  forwardedRef: PropTypes.object,
};

export default ArtItemSellable;
