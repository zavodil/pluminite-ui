import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getNextBidNears } from '../../../utils/nears';

import { MarketContractContext, NearContext } from '../../../contexts';

import ArtItem from './ArtItem';

const ArtItemPriced = ({ gemOnSale, bid, bidAvailable, ...props }) => {
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
      await offer(gemOnSale.token_id, getNextBidNears(gemOnSale));
    } catch (error) {
      console.error(error);
      toast.error('Sorry 😢 There was an error in processing your offer. Please, try again later.');
    }
  };

  const isItemOwnedByUser = () => gemOnSale?.owner_id === marketContract.account.accountId;

  return (
    <ArtItem
      buttonText={isItemOwnedByUser() ? null : `Buy for ${bid}Ⓝ`}
      isButtonDisabled={!bidAvailable}
      onButtonClick={processBid}
      {...props}
    />
  );
};

ArtItemPriced.propTypes = {
  bid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  bidAvailable: PropTypes.bool,
  // todo: add type for union of nft and sale
  gemOnSale: PropTypes.object,
};

ArtItemPriced.defaultProps = {
  bidAvailable: true,
};

export default ArtItemPriced;
