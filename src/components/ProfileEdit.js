import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import defaultProfilePicture from '../assets/default-profile-picture.png';

import { StickedToBottom } from './common/layout';
import Balance from './NavigationComponents/Balance';
import Button from './common/Button';
import { Textarea } from './common/forms';

import { NearContext } from '../contexts';

import { PROFILE } from '../constants';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 90px);
  max-width: 767px;
  padding: 100px 28px 120px;

  .summary {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 30px;

    .picture {
      width: 82px;
      height: 82px;
      border-radius: 100%;
      margin-right: 40px;
    }

    .profile {
      flex-grow: 1;

      .account-id {
        margin: 0 0 12px;
      }

      .button-change-profile {
        width: 100%;
      }
    }
  }

  .balance {
    .balance-label {
      margin: 0 0 10px;
    }

    .balance-text {
      font-family: 'Staatliches', sans-serif;
      color: var(--periwinkle);
    }

    .nears {
      font-size: 66px;
    }

    .usds {
      font-size: 34px;
    }
  }

  @media (min-width: 767px) {
    margin: 0 auto;
    align-items: center;

    > * {
      margin: 0 0 50px;
    }

    textarea {
      width: 700px;
      max-width: 700px;
      min-width: 700px;
    }
  }
`;

const StyledButton = styled(Button)`
  width: 50%;

  :first-of-type {
    margin-right: 10px;
  }
`;

export default function Profile() {
  const { user } = useContext(NearContext);

  const processSave = () => {
    toast.success('Success! Your profile was saved!');
  };

  return (
    <Container>
      <div className="summary">
        <img className="picture" src={defaultProfilePicture} alt="profile picture" width="82" height="82" />
        <div className="profile">
          <p className="account-id">{user.accountId}</p>
          <Button isSecondary isSmall className="button-change-profile">
            <a>Change Profile Picture</a>
          </Button>
        </div>
      </div>
      <Textarea name="bio" labelText="Bio" rows={4} maxLength={PROFILE.BIO_MAX_LENGTH} />
      <div className="balance">
        <p className="balance-label">Your Funds</p>
        <Balance precision={1} />
      </div>
      <StickedToBottom isSecondary>
        <StyledButton isSecondary>
          <Link to="/profile">Cancel</Link>
        </StyledButton>
        <StyledButton isPrimary>
          <Link to="/profile" onClick={processSave}>
            Save
          </Link>
        </StyledButton>
      </StickedToBottom>
    </Container>
  );
}
