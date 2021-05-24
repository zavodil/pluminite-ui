import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import { StickedToBottom } from '../../common/layout';
import Button from '../../common/Button';
import CloseButton from '../../common/Button/CloseButton';
import { TitleText } from '../../common/typography';
import { Tabs } from '../../common/tabs';
import { Portal } from '../../common/utils';

import { withUSDs } from '../../../hooks';

import { round } from '../../../utils/numbers';

import { NftContractContext, MarketContractContext } from '../../../contexts';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 173px);
  max-width: 767px;
  padding: 100px 28px 60px;

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

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 38px;
  right: 24px;
  cursor: pointer;
  z-index: 2;

  > svg {
    stroke: var(--lavendar);
    fill: var(--lavendar);
  }
`;

function Gem({ location: { prevPathname } }) {
  const [previousPriceUser, setPreviousPriceUser] = useState('');
  const [previousPrice, setPreviousPrice] = useState('0');
  const { gem, getGem } = useContext(NftContractContext);
  const { getSale, gemOnSale, offer, clearGemOnSale, marketContract } = useContext(MarketContractContext);
  const { gemId } = useParams();
  const history = useHistory();

  const previousPriceUSDs = withUSDs(formatNearAmount(previousPrice));

  useEffect(() => {
    (async () => {
      const gemOnNftContract = await getGem(gemId);

      if (Object.keys(gemOnNftContract.approved_account_ids).includes(marketContract.contractId)) {
        await getSale(gemId);
      }
    })();

    return () => {
      clearGemOnSale();
    };
  }, []);

  const hasBids = () => !!gemOnSale?.bids?.near?.owner_id;

  const isListed = () => !!gemOnSale;

  useEffect(() => {
    if (hasBids()) {
      setPreviousPriceUser(gemOnSale?.bids?.near?.owner_id || '');
      setPreviousPrice(gemOnSale?.bids?.near?.price || '0');
    } else {
      setPreviousPriceUser(gem?.owner_id || '');
      setPreviousPrice(gemOnSale?.conditions?.near || '0');
    }
  }, [gem, gemOnSale]);

  // todo: real processing of bid
  const processBid = async () => {
    await offer(gemId, +formatNearAmount(previousPrice) + 1);
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

  return (
    <Container>
      <Portal>
        <StyledCloseButton processCLick={goBack} />
      </Portal>
      <TitleText className="gem-title">{gem?.metadata?.title || 'No title provided'}</TitleText>
      <div className="users">
        {/* todo: gem.creator_id is not implemented on the contract */}
        <p>by {gem?.creator_id || '?'}</p>
        <p>owned by {gem?.owner_id || '?'}</p>
      </div>
      <Tabs
        tabsArray={[
          {
            title: 'Description',
            content: gem?.metadata?.description || 'No description provided',
          },
          {
            title: 'History',
            content: (
              // todo: creator_id is currently not implemented on the contracts
              // todo: gemOnSale.bids.near.date is currently not implemented on the contracts
              <>
                {gemOnSale?.bids?.near?.owner_id && (
                  <div className="history-event">
                    {gemOnSale.bids.near.owner_id} bid {formatNearAmount(gemOnSale.bids.near.price)}Ⓝ on{' '}
                    {gemOnSale.bids.near.date
                      ? new Intl.DateTimeFormat().format(new Date(gemOnSale.bids.near.date))
                      : 'unknown date'}
                  </div>
                )}
                {gem?.metadata?.issued_at && (
                  <div className="history-event">
                    {gem?.creator_id || 'Unknown author'} minted {gem?.metadata?.title || 'untitled gem'} on{' '}
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
      {isListed() && (
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
              Bid {+formatNearAmount(previousPrice) + 1}Ⓝ on Gem
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
