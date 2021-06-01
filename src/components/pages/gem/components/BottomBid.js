import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import { MarketContractContext, NearContext } from '../../../../contexts';

import { withUSDs } from '../../../../hooks';

import { getNextBidNearsFormatted } from '../../../../utils/nears';
import { round } from '../../../../utils/numbers';

import Button from '../../../common/Button';
import { StickedToBottom } from '../../../common/layout';

const Container = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 767px;

  .bid-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  .bid-title {
    font-size: 20px;
    margin: 0 0 10px;
  }

  .bid-user {
    color: rgba(var(--lavendar-base), 0.7);
    margin: 0;
  }

  .bid-sum {
    display: flex;
    align-items: center;
    font-family: var(--font-secondary);
    color: var(--bubble-gum);

    &-nears {
      display: inline-flex;
      align-items: center;
      margin-right: 20px;

      &--amount {
        font-size: 36px;
        margin-right: 5px;
      }

      &--sign {
        font-size: 18px;
      }
    }

    &-usds {
      font-size: 18px;
      opacity: 0.7;
    }
  }

  .bid-button {
    width: 100%;
  }
`;

const BottomBid = ({ gem, gemOnSale }) => {
  const { user } = useContext(NearContext);
  const { offer } = useContext(MarketContractContext);
  const history = useHistory();

  const [previousPriceUser, setPreviousPriceUser] = useState('');
  const [previousPrice, setPreviousPrice] = useState('0');

  const previousPriceUSDs = withUSDs(formatNearAmount(previousPrice));

  const hasBids = () => !!gemOnSale?.bids?.near?.owner_id;

  useEffect(() => {
    if (hasBids()) {
      setPreviousPriceUser(gemOnSale?.bids?.near?.owner_id || '');
      setPreviousPrice(gemOnSale?.bids?.near?.price || '0');
    } else {
      setPreviousPriceUser(gem?.owner_id || '');
      setPreviousPrice(gemOnSale?.conditions?.near || '0');
    }
  }, [gem, gemOnSale]);

  const processBid = async () => {
    if (user) {
      await offer(gemOnSale.token_id, getNextBidNearsFormatted(gemOnSale));
    } else {
      toast.success('To buy items you need to be logged in!');

      history.push('/sign-up');
    }

    // todo: execute commands below once the bid is accepted
    // toast.success('You own a new gem!', { position: 'top-right' });
    // history.push(`/profile?gem-id=${gem?.token_id}`);
  };

  return (
    <StickedToBottom isSecondary>
      <Container className="bid">
        <div className="bid-top">
          <div className="bid-description">
            <p className="bid-title">{hasBids ? 'Top offer' : 'Starting Bid'}</p>
            <p className="bid-user">{previousPriceUser}</p>
          </div>
          <div className="bid-sum">
            <span className="bid-sum-nears">
              <span className="bid-sum-nears--amount">{formatNearAmount(previousPrice)}</span>
              <span className="bid-sum-nears--sign">Ⓝ</span>
            </span>
            {previousPriceUSDs !== null && <span className="bid-sum-usds">~${round(previousPriceUSDs, 0)} USD</span>}
          </div>
        </div>
        <Button className="bid-button" isPrimary onClick={processBid}>
          Buy Gem for {getNextBidNearsFormatted(gemOnSale)}Ⓝ
        </Button>
      </Container>
    </StickedToBottom>
  );
};

BottomBid.propTypes = {
  gem: PropTypes.shape({
    owner_id: PropTypes.string,
  }).isRequired,
  gemOnSale: PropTypes.shape({
    token_id: PropTypes.string,
    conditions: PropTypes.shape({
      near: PropTypes.string,
    }),
    bids: PropTypes.shape({
      near: PropTypes.shape({
        owner_id: PropTypes.string,
        price: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default BottomBid;
