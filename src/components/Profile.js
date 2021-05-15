import React, { useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import defaultProfilePicture from '../assets/default-profile-picture.png';
import Balance from './NavigationComponents/Balance';
import Button from './common/Button';
import ArtItem from './common/ArtItem';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 100px 28px 120px;

  .summary {
    display: flex;
    flex-direction: row;
    align-items: center;

    > * {
      margin-right: 40px;
    }

    .picture {
      width: 62px;
      height: 62px;
      border-radius: 100%;
    }

    .summary-block {
      display: flex;
      flex-direction: column;
      min-width: 40px;
      white-space: nowrap;

      .summary-block-top {
        font-size: 20px;
        line-height: 25px;
        color: var(--periwinkle);

        .usds {
          font-size: 12px;
        }
      }

      .summary-block-bottom {
        font-size: 11px;
        line-height: 18px;
        color: var(--lavendar);
      }
    }
  }
`;

export default function Profile() {
  const [gemsTabActive, setGemsTabActive] = useState('own');

  return (
    <Container>
      <div className="summary">
        <img className="picture" src={defaultProfilePicture} alt="profile picture" width="62" height="62" />
        <div className="summary-block">
          <span className="summary-block-top">0</span>
          <span className="summary-block-bottom">Pieces Sold</span>
        </div>
        <div className="summary-block">
          <Balance className="summary-block-top" />
          <span className="summary-block-bottom">Your Funds</span>
        </div>
      </div>
      <p>You haven’t added a description yet.</p>
      <Button isPrimary>Edit Profile</Button>
      <div className="tabs">
        <div className="tabs-titles">
          <div
            className={classNames('tabs-title', {
              'tabs-title--active': gemsTabActive === 'own',
            })}
            onClick={() => setGemsTabActive('own')}
          >
            Gems I own
          </div>
          <div
            className={classNames('tabs-title', {
              'tabs-title--active': gemsTabActive === 'made',
            })}
            onClick={() => setGemsTabActive('made')}
          >
            Gems I made
          </div>
          <div className="tabs-content">
            {gemsTabActive === 'own' && (
              <div>
                {Array.from({ length: 2 }).map((_, i) => (
                  <ArtItem key={i} />
                ))}
              </div>
            )}
            {gemsTabActive === 'made' && (
              <div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <ArtItem key={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
