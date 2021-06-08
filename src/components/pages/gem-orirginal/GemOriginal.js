import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { getBlacklistedTokens } from '../../../apis';

import { ImageFromIpfs } from '../../common/images';
import { StickedToBottom } from '../../common/layout';
import Button from '../../common/Button';
import CloseButton from '../../common/Button/CloseButton';
import { Portal } from '../../common/utils';

import { useDocumentTitle, withUSDs } from '../../../hooks';

import { round } from '../../../utils/numbers';
import { convertYoctoNearsToNears, getNextBidNears, getNextBidNearsFormatted } from '../../../utils/nears';

import { NftContractContext, MarketContractContext, NearContext } from '../../../contexts';

import { QUERY_KEYS } from '../../../constants';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 173px);
  padding: 192px 28px 60px;

  .image {
    max-width: 100%;
    border-radius: var(--radius-default);
  }

  @media (min-width: 767px) {
    margin: 0 auto;
    align-items: center;
  }
`;

const StyledBid = styled('div')`
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

const GemHeader = styled('div')`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  z-index: 2;
  min-height: 92px;

  .gem-close {
    cursor: pointer;

    > svg {
      stroke: var(--lavendar);
      fill: var(--lavendar);
    }
  }
`;

function GemOriginal({ location: { prevPathname } }) {
  const { user } = useContext(NearContext);
  const { getGem } = useContext(NftContractContext);
  const { getSale, offer, marketContract } = useContext(MarketContractContext);

  const [previousPriceUser, setPreviousPriceUser] = useState('');
  const [previousPrice, setPreviousPrice] = useState('0');

  const { gemId } = useParams();

  const history = useHistory();

  const previousPriceUSDs = withUSDs(convertYoctoNearsToNears(previousPrice));

  const { data: gem } = useQuery([QUERY_KEYS.GEM, gemId], () => getGem(gemId), {
    onError() {
      toast.error('Sorry 😢 There was an error getting the gem. Please, try again later.');
      history.push('/');
    },
  });

  useDocumentTitle(gem?.metadata?.title || 'Untitled Gem');

  const { data: gemOnSale } = useQuery(
    [QUERY_KEYS.GEM_ON_SALE, gemId],
    async () => {
      if (Object.keys(gem.approved_account_ids).includes(marketContract.contractId)) {
        return getSale(gemId);
      }

      return null;
    },
    {
      enabled: !!gem,
      onError() {
        toast.error('Sorry 😢 There was an error getting the gem. Please, try again later.');
        history.push('/');
      },
    }
  );

  const hasBids = () => !!gemOnSale?.bids?.near?.owner_id;

  const isListed = () => !!gemOnSale;

  const isOwnedByUser = () => gemOnSale?.owner_id && gemOnSale.owner_id === user?.accountId;

  useEffect(() => {
    if (hasBids()) {
      setPreviousPriceUser(gemOnSale?.bids?.near?.owner_id || '');
      setPreviousPrice(gemOnSale?.bids?.near?.price || '0');
    } else {
      setPreviousPriceUser(gem?.owner_id || '');
      setPreviousPrice(gemOnSale?.conditions?.near || '0');
    }
  }, [gem, gemOnSale]);

  const { data: blacklistedTokens } = useQuery([QUERY_KEYS.BLACKLIST], () => getBlacklistedTokens(), {
    staleTime: 1000 * 60 * 10,
  });

  const processBid = async () => {
    try {
      await offer(gemId, getNextBidNears(gemOnSale));
    } catch (error) {
      console.error(error);
      toast.error('Sorry 😢 There was an error in processing your offer. Please, try again later.');
    }

    // todo: do we show a toast with the link to the profile page (there are designs for that)
    //  or do we redirect to profile page on success
    // toast.success('You own a new gem!', { position: 'top-right' });
    // history.push(`/profile?gem-id=${gem?.token_id}`);
  };

  const goBack = () => {
    if (prevPathname) {
      history.push(prevPathname);
    } else {
      history.push('/');
    }
  };

  if (gem === null) {
    return <Redirect to="/404" />;
  }
  if (!blacklistedTokens) {
    return null;
  }
  if (gem?.token_id && blacklistedTokens.includes(gem.token_id)) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <Portal>
        <GemHeader>
          <div />
          <CloseButton className="gem-close" processCLick={goBack} />
        </GemHeader>
      </Portal>
      <ImageFromIpfs media={gem?.metadata?.media} alt={gem?.metadata?.title} />
      {isListed() && !isOwnedByUser() && (
        <StickedToBottom isSecondary>
          <StyledBid className="bid">
            <div className="bid-top">
              <div className="bid-description">
                {/* todo: 'Top offer' and 'Starting Bid' are for when we have offers */}
                {/* <p className="bid-title">{hasBids() ? 'Top offer' : 'Starting Bid'}</p> */}
                <p className="bid-title">Price</p>
                <p className="bid-user">{previousPriceUser}</p>
              </div>
              <div className="bid-sum">
                <span className="bid-sum-nears">
                  <span className="bid-sum-nears--amount">{formatNearAmount(previousPrice)}</span>
                  <span className="bid-sum-nears--sign">Ⓝ</span>
                </span>
                {previousPriceUSDs !== null && (
                  <span className="bid-sum-usds">~${round(previousPriceUSDs, 0)} USD</span>
                )}
              </div>
            </div>
            <Button className="bid-button" isPrimary onClick={processBid}>
              Buy Gem for {getNextBidNearsFormatted(gemOnSale)}Ⓝ
            </Button>
          </StyledBid>
        </StickedToBottom>
      )}
    </Container>
  );
}

GemOriginal.propTypes = {
  location: PropTypes.shape({
    prevPathname: PropTypes.string,
  }),
  dataUrl: PropTypes.string,
  buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isButtonDisabled: PropTypes.bool,
};

export default GemOriginal;
