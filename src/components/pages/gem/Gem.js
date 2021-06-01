import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import { getFileData } from '../../../apis';
import { ArtItem } from '../../common/art';

import { StickedToBottom } from '../../common/layout';
import Button from '../../common/Button';
import CloseButton from '../../common/Button/CloseButton';
import { TitleText } from '../../common/typography';
import { Tabs } from '../../common/tabs';
import { Portal } from '../../common/utils';

import { withUSDs } from '../../../hooks';

import { round } from '../../../utils/numbers';
import { getNextBidNearsFormatted } from '../../../utils/nears';

import { NftContractContext, MarketContractContext, NearContext } from '../../../contexts';

import { QUERY_KEYS } from '../../../constants';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 173px);
  max-width: 767px;
  padding: 192px 28px 60px;

  .gem-title {
    margin-bottom: 5px;
  }

  .users {
    color: rgba(var(--lavendar-base), 0.7);
    margin-bottom: 40px;

    p {
      margin: 0 0 5px;

      :last-of-type {
        margin-bottom: 0;
      }
    }
  }

  .tabs-titles {
    margin-bottom: 40px;
  }

  .history-event {
    padding: 20px 0;
    font-size: 16px;
    line-height: 24px;

    :first-of-type {
      padding-top: 0;
    }

    :not(:last-of-type) {
      //border-bottom: 1px solid var(--bubble-gum);
      border-bottom: 1px solid rgba(var(--bubble-gum-base), 0.2);
    }
  }

  .royalty {
    text-align: right;
    margin-bottom: 25px;

    &-user {
      margin-right: 25px;
    }

    &-royalty {
      font-size: 34px;
      font-family: var(--font-secondary);
      color: rgba(var(--bubble-gum-base), 0.7);
    }
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

function Gem({ location: { prevPathname } }) {
  const { user } = useContext(NearContext);
  const { getGem } = useContext(NftContractContext);
  const { getSale, offer } = useContext(MarketContractContext);

  const [previousPriceUser, setPreviousPriceUser] = useState('');
  const [previousPrice, setPreviousPrice] = useState('0');

  const { gemId } = useParams();

  const history = useHistory();

  const previousPriceUSDs = withUSDs(formatNearAmount(previousPrice));

  const { data: gem } = useQuery([QUERY_KEYS.GEM, gemId], () => getGem(gemId));

  const { data: gemOnSale } = useQuery(
    [QUERY_KEYS.GEM_ON_SALE, gemId],
    async () => {
      // todo: uncomment once gem.approved_account_ids is fixed
      // if (Object.keys(gem.approved_account_ids).includes(marketContract.contractId)) {
      //   return getSale(gemId);
      // }
      //
      // return null;
      return getSale(gemId);
    },
    {
      enabled: !!gem,
    }
  );

  const { data: imageData } = useQuery(
    [QUERY_KEYS.GET_IMAGE_DATA, gem?.metadata?.media],
    () => getFileData(gem?.metadata?.media),
    {
      retry: 1,
      enabled: !!gem?.metadata?.media,
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

  const processBid = async () => {
    if (user) {
      await offer(gemId, getNextBidNearsFormatted(gemOnSale));
    } else {
      toast.success('To buy items you need to be logged in!');

      history.push('/sign-up');
    }

    // todo: execute commands below once the bid is accepted
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

  const getCreator = () => {
    if (!gem?.metadata?.extra) {
      return undefined;
    }

    return JSON.parse(gem?.metadata?.extra).creator_id;
  };

  if (gem === null) {
    return <Redirect to="/404" />;
  }

  return (
    <Container>
      <Portal>
        <GemHeader>
          <div>{imageData && <img src={imageData} alt={gem?.metadata?.title} width={40} height={40} />}</div>
          <CloseButton className="gem-close" processCLick={goBack} />
        </GemHeader>
      </Portal>
      <TitleText className="gem-title">{gem?.metadata?.title || 'No title provided'}</TitleText>
      <div className="users">
        <p>by {getCreator() || '?'}</p>
        <p>owned by {gem?.owner_id || '?'}</p>
      </div>
      <Tabs
        tabsArray={[
          {
            title: 'Preview',
            content: <ArtItem nft={gem} isFullScreenEnabled isFromIpfs />,
          },
          {
            title: 'Description',
            content: gem?.metadata?.description || 'No description provided',
          },
          {
            title: 'History',
            content: (
              // todo: gemOnSale.bids.near.date is currently not implemented on the contracts
              <>
                {hasBids() && (
                  <div className="history-event">
                    {gemOnSale.bids.near.owner_id} bid {formatNearAmount(gemOnSale.bids.near.price)}Ⓝ on{' '}
                    {gemOnSale.bids.near.date
                      ? new Intl.DateTimeFormat().format(new Date(gemOnSale.bids.near.date))
                      : 'unknown date'}
                  </div>
                )}
                {gem?.metadata?.issued_at && (
                  <div className="history-event">
                    {getCreator() || '?'} minted {gem?.metadata?.title || 'untitled gem'} on{' '}
                    {new Intl.DateTimeFormat().format(new Date(+gem.metadata.issued_at))}
                  </div>
                )}
              </>
            ),
          },
          {
            title: 'Royalties',
            content:
              gem?.royalty &&
              Object.entries(gem.royalty).map(([userId, royalty], index) => (
                <div key={`royalty-${index}`} className="royalty">
                  <span className="royalty-user">{userId}</span>
                  <span className="royalty-royalty">{royalty / 100}%</span>
                </div>
              )),
          },
        ]}
      />
      {isListed() && !isOwnedByUser() && (
        <StickedToBottom isSecondary>
          <StyledBid className="bid">
            <div className="bid-top">
              <div className="bid-description">
                <p className="bid-title">{hasBids() ? 'Top offer' : 'Starting Bid'}</p>
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

Gem.propTypes = {
  location: PropTypes.shape({
    prevPathname: PropTypes.string,
  }),
  dataUrl: PropTypes.string,
  buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isButtonDisabled: PropTypes.bool,
};

export default Gem;
