import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';

import defaultProfilePicture from '../assets/default-profile-picture.png';
import Balance from './NavigationComponents/Balance';
import Button from './common/Button';
import { ArtItemEditable } from './common/art';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 767px;
  padding: 100px 28px 120px;

  > * {
    margin: 0 0 25px;
  }

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

  .tabs-titles {
    display: flex;
    margin-bottom: 30px;

    .tabs-title {
      position: relative;
      text-transform: uppercase;
      font-family: 'Staatliches', sans-serif;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.04em;
      cursor: pointer;

      :first-of-type {
        margin-right: 40px;
      }

      :hover {
        color: var(--bubble-gum);
      }

      &--active {
        color: var(--bubble-gum);

        :after {
          content: '';
          position: absolute;
          right: 0;
          bottom: -10px;
          left: 0;
          width: 33%;
          height: 4px;
          margin: auto;
          background-color: var(--bubble-gum);
          border-radius: var(--radius-default);
        }
      }
    }
  }

  .tabs-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  @media (min-width: 767px) {
    margin: 0 auto;
    align-items: center;

    > * {
      margin: 0 0 50px;
    }

    > .button {
      width: 350px;
    }

    .tabs-titles {
      justify-content: center;
    }

    .tabs-content {
      justify-content: space-evenly;
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
          <Balance className="summary-block-top" precision={2} />
          <span className="summary-block-bottom">Your Funds</span>
        </div>
      </div>
      <p className="profile-description">You haven’t added a description yet.</p>
      <Button isSecondary isLink>
        <Link to="/profile/edit">Edit Profile</Link>
      </Button>
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
        </div>
        <div className="tabs-content">
          {gemsTabActive === 'own' && Array.from({ length: 4 }).map((_, i) => <ArtItemEditable key={i} />)}
          {gemsTabActive === 'made' && Array.from({ length: 12 }).map((_, i) => <ArtItemEditable key={i} />)}
        </div>
      </div>
    </Container>
  );
}
