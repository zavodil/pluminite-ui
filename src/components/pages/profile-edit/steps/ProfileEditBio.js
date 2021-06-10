import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useQueryClient } from 'react-query';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import defaultProfilePicture from '~/assets/images/default-profile-picture.png';

import { StickedToBottom } from '~/components/common/layout';
import { DotsLoading, Balance } from '~/components/common/utils';
import { Button } from '~/components/common/buttons';
import { Textarea } from '~/components/common/forms';

import { NearContext, NftContractContext } from '~/contexts';

import { useIsUnmounting } from '~/hooks';

import { getFileData } from '~/apis';

import { PROFILE, QUERY_KEYS } from '~/constants';

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

  const { data: profile } = useQuery([QUERY_KEYS.GET_PROFILE, user.accountId], () => getProfile(user.accountId), {
    enabled: !!user?.accountId,
    onError() {
      toast.error('Sorry 😢 There was an error getting your profile data.');
    },
  });

  const { data: imageData } = useQuery([QUERY_KEYS.GET_IMAGE_DATA, profile?.image], () => getFileData(profile?.image), {
    retry: 1,
    enabled: !!profile?.image,
    onError() {
      toast.error("Sorry 😢 Can't get your profile image.");
    },
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

    try {
      await setProfile({
        ...profile,
        bio: bioEdited,
        image: profile?.image || '',
      });
    } catch (error) {
      console.error(error);
      toast.error('Sorry 😢 There was an error with saving your profile. Please, try again later.');

      if (!isUnmounting) {
        setIsSaving(false);
      }

      return;
    }

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
        <img
          className="picture"
          src={imageData || defaultProfilePicture}
          alt="profile picture"
          width="82"
          height="82"
        />
        <div className="profile">
          <p className="account-id">{user.accountId}</p>
          <Button isSecondary isSmall className="button-change-profile">
            <Link to={uploadPhotoLink}>Change Profile Picture</Link>
          </Button>
        </div>
      </div>
      {profile !== undefined && (
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
