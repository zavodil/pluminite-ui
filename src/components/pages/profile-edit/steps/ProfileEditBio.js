import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery as useRQuery, useQueryClient } from 'react-query';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { StickedToBottom } from '../../../common/layout';
import { DotsLoading } from '../../../common/utils';
import Balance from '../../../NavigationComponents/Balance';
import Button from '../../../common/Button';
import { Textarea } from '../../../common/forms';
import { ImageFromIpfs } from '../../../common/images';

import { NearContext, NftContractContext } from '../../../../contexts';

import { useIsUnmounting } from '../../../../hooks';

import { PROFILE, QUERY_KEYS } from '../../../../constants';

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

function ProfileEditBio({ uploadPhotoLink }) {
  const { user } = useContext(NearContext);
  const { setProfile, getProfile } = useContext(NftContractContext);

  const { data: profile } = useRQuery([QUERY_KEYS.GET_PROFILE, user.accountId], () => getProfile(user.accountId), {
    enabled: !!user?.accountId,
  });

  const [bioEdited, setBioEdited] = useState(profile?.bio);
  const [isSaving, setIsSaving] = useState(false);

  const isUnmounting = useIsUnmounting();

  const history = useHistory();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (profile?.bio) {
      setBioEdited(profile?.bio);
    }
  }, [profile?.bio]);

  const isBioMaxLengthExceeded = () =>
    bioEdited !== undefined && bioEdited !== null && bioEdited.length > PROFILE.BIO_MAX_LENGTH;
  const isBioChanged = () => bioEdited !== profile?.bio;

  const isSaveAvailable = () => !isSaving && !isBioMaxLengthExceeded() && isBioChanged();

  const saveBio = async () => {
    if (!isSaveAvailable()) {
      return;
    }

    setIsSaving(true);

    await setProfile({ ...profile, bio: bioEdited });
    await queryClient.invalidateQueries([QUERY_KEYS.GET_PROFILE, user.accountId]);

    toast.success('Success! Your profile was saved!');

    if (!isUnmounting) {
      setIsSaving(false);
      history.push('/profile');
    }
  };

  return (
    <Container>
      <div className="summary">
        <ImageFromIpfs className="picture" media={profile?.image} alt="profile picture" width="82" height="82" />
        <div className="profile">
          <p className="account-id">{user.accountId}</p>
          <Button isSecondary isSmall className="button-change-profile">
            <Link to={uploadPhotoLink}>Change Profile Picture</Link>
          </Button>
        </div>
      </div>
      {profile && (
        <Textarea
          name="bio"
          labelText="Bio"
          rows={4}
          maxLength={PROFILE.BIO_MAX_LENGTH}
          textInitial={profile?.bio || ''}
          onTextChange={(value) => setBioEdited(value)}
          isDisabled={isSaving}
        />
      )}
      <div className="balance">
        <p className="balance-label">Your Funds</p>
        <Balance precision={1} />
      </div>
      <StickedToBottom isSecondary>
        <StyledButton isSecondary isDisabled={isSaving}>
          <Link to={isSaving ? '#' : '/profile'}>Cancel</Link>
        </StyledButton>
        <StyledButton isPrimary onClick={saveBio} isDisabled={!isSaveAvailable()}>
          {isSaving ? 'Saving' : 'Save'}
          {isSaving && <DotsLoading />}
        </StyledButton>
      </StickedToBottom>
    </Container>
  );
}

ProfileEditBio.propTypes = {
  uploadPhotoLink: PropTypes.string.isRequired,
};

export default ProfileEditBio;
