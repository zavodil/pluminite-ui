import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import defaultProfilePicture from '../../../../assets/default-profile-picture.png';

import { StickedToBottom } from '../../../common/layout';
import Balance from '../../../NavigationComponents/Balance';
import Button from '../../../common/Button';
import { Textarea } from '../../../common/forms';

import { NearContext } from '../../../../contexts';

import { PROFILE } from '../../../../constants';

const Container = styled('div')`
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
      font-family: var(--font-secondary);
      color: var(--periwinkle);
    }

    .nears {
      font-size: 36px;
      line-height: 24px;
      margin-right: 8px;
    }

    .nears-sign {
      font-size: 18px;
      line-height: 18px;
      margin-right: 16px;
    }

    .usds {
      font-size: 18px;
      line-height: 24px;
      opacity: 70%;
    }
  }

  @media (min-width: 767px) {
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

function ProfileEditBio({ uploadPhotoLink, processSave }) {
  const { user } = useContext(NearContext);

  return (
    <Container>
      <div className="summary">
        <img className="picture" src={defaultProfilePicture} alt="profile picture" width="82" height="82" />
        <div className="profile">
          <p className="account-id">{user.accountId}</p>
          <Button isSecondary isSmall className="button-change-profile">
            <Link to={uploadPhotoLink}>Change Profile Picture</Link>
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

ProfileEditBio.propTypes = {
  uploadPhotoLink: PropTypes.string.isRequired,
  processSave: PropTypes.func.isRequired,
};

export default ProfileEditBio;
