import React from 'react';
// import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { StickedToBottom } from './common/layout';
import Balance from './NavigationComponents/Balance';
import Button from './common/Button';
import { TitleText } from './common/typography';
import { Tabs } from './common/tabs';

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

  .bid-button {
    width: 100%;
  }
`;

export default function Gem() {
  // const { gemId } = useParams();

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
            <Balance className="bid-sum" precision={0} />
          </div>
          <Button className="bid-button" isPrimary>
            Bid 5Ⓝ on Gem
          </Button>
        </StyledBid>
      </StickedToBottom>
    </Container>
  );
}
