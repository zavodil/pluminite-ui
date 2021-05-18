import React from 'react';
// import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { StickedToBottom } from './common/layout';
import Button from './common/Button';
import { TitleText } from './common/typography';
import { Tabs } from './common/tabs';

import { withUSDs } from '../hooks';
import { round } from '../utils/numbers';

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

export default function Gem() {
  // const { gemId } = useParams();
  // todo: use real data after nft contract integration
  const bidNears = 15;
  const historyData = [
    { type: 'bid', date: 1621337272257, amount: 10, bidder: 'mattlokc.near' },
    { type: 'startPriceUpdate', date: 1611237272257, updater: 'crasskitty.near' },
    { type: 'sale', date: 1601137272257, seller: 'bluesygma.near', buyer: 'crasskitty.near' },
    { type: 'mint', date: 1591037272257, creator: 'bluesygma.near' },
  ];
  const royalties = [
    { userId: 'bluesygma.near', royalty: '5%' },
    { userId: 'crasskitty.near', royalty: '5%' },
  ];

  const bidUSDs = withUSDs(bidNears);

  return (
    <Container>
      <TitleText className="gem-title">Art Title</TitleText>
      <div className="users">
        <p>by bluesygma.near</p>
        <p>owned by bluesygma.near</p>
      </div>
      <Tabs
        tabsArray={[
          {
            title: 'Description',
            content: 'Keep it short',
          },
          {
            title: 'History',
            content: historyData.map((event, index) => (
              <div key={index} className="history-event">
                {event.type === 'bid' &&
                  `${event.bidder} bid ${event.amount}Ⓝ on ${new Intl.DateTimeFormat().format(new Date(event.date))}`}
                {event.type === 'startPriceUpdate' &&
                  `${event.updater} updated the starting price on ${new Intl.DateTimeFormat().format(
                    new Date(event.date)
                  )}`}
                {event.type === 'sale' &&
                  `${event.seller} sold to ${event.buyer} on ${new Intl.DateTimeFormat().format(new Date(event.date))}`}
                {event.type === 'mint' &&
                  `${event.creator} minted “Art Title” on ${new Intl.DateTimeFormat().format(new Date(event.date))}`}
              </div>
            )),
          },
          {
            title: 'Royalties',
            content: royalties.map(({ userId, royalty }, index) => (
              <div key={index} className="royalty">
                <span className="royalty-user">{userId}</span>
                <span className="royalty-royalty">{royalty}</span>
              </div>
            )),
          },
        ]}
      />
      <StickedToBottom isSecondary>
        <StyledBid className="bid">
          <div className="bid-top">
            <div className="bid-description">
              <p className="bid-title">Starting Bid</p>
              <p className="bid-user">by bluesygma.near</p>
            </div>
            <div className="bid-sum">
              <span className="bid-sum-nears">
                <span className="bid-sum-nears--amount">{bidNears}</span>
                <span className="bid-sum-nears--sign">Ⓝ</span>
              </span>
              {bidUSDs && <span className="bid-sum-usds">~${round(bidUSDs, 0)} USD</span>}
            </div>
          </div>
          <Button className="bid-button" isPrimary>
            Bid {bidNears}Ⓝ on Gem
          </Button>
        </StyledBid>
      </StickedToBottom>
    </Container>
  );
}
