import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getNextBidNears, getNextBidNearsFormatted } from '../../../utils/nears';

import { MarketContractContext, NearContext } from '../../../contexts';

import ArtItem from './ArtItem';

const ArtItemPriced = ({ nft, bidAvailable, ...props }) => {
  const { user } = useContext(NearContext);
  const { offer, marketContract } = useContext(MarketContractContext);
  const history = useHistory();

  const processBid = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.success('To buy items you need to be logged in!');
      history.push('/sign-up');

      return;
    }

    try {
      await offer(nft.token_id, getNextBidNears(nft));
    } catch (error) {
      console.error(error);
      toast.error('Sorry 😢 There was an error in processing your offer. Please, try again later.');
    }
  };

  const isItemOwnedByUser = () => nft?.owner_id === marketContract.account.accountId;

  return (
    <ArtItem
      buttonText={isItemOwnedByUser() ? null : `Buy for ${getNextBidNearsFormatted(nft)}Ⓝ`}
      isButtonDisabled={!bidAvailable}
      onButtonClick={processBid}
      nft={nft}
      {...props}
    />
  );
};

ArtItemPriced.propTypes = {
  bidAvailable: PropTypes.bool,
  // todo: add type for union of nft and sale
  nft: PropTypes.object,
};

ArtItemPriced.defaultProps = {
  bidAvailable: true,
};

export default ArtItemPriced;
