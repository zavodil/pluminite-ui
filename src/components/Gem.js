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
  padding: 100px 28px 120px;

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

  .bid {
    width: 100%;

    &-top {
      display: flex;
      justify-content: space-between;
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
          { title: 'History' },
          { title: 'Royalties' },
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
            Bid {bidUSDs}Ⓝ on Gem
          </Button>
        </StyledBid>
      </StickedToBottom>
    </Container>
  );
}
