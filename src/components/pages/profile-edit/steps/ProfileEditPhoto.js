import React, { useContext, useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { NearContext, NftContractContext } from '~/contexts';

import { StickedToBottom } from '~/components/common/layout';
import { Button } from '~/components/common/buttons';
import FileDropzone from '~/components/common/FileDropzone';
import { HeadingSmallText } from '~/components/common/typography';
import { DotsLoading } from '~/components/common/utils';

import { useIsUnmounting } from '~/hooks';

import { uploadFile } from '~/apis';

import { PROFILE, QUERY_KEYS } from '~/constants';

const Container = styled('div')`
  .heading-small {
    margin-bottom: 10px;
  }

  img {
    width: 82px;
    height: 82px;
    border-radius: 50%;
    object-fit: cover;
  }

  .sub-title {
    margin: 0 0 20px;
  }

  .advice {
    color: var(--lavendar);
    text-align: left;
    font-size: 13px;
    line-height: 18px;
  }
`;

const StyledButton = styled(Button)`
  width: 50%;

  :first-of-type {
    margin-right: 10px;
  }
`;

function ProfileEditPhoto() {
  const { user } = useContext(NearContext);
  const { setProfile, getProfile } = useContext(NftContractContext);

  const { data: profile } = useQuery([QUERY_KEYS.GET_PROFILE, user.accountId], () => getProfile(user.accountId), {
    enabled: !!user?.accountId,
    onError() {
      toast.error('Sorry 😢 There was an error getting your profile data.');
    },
  });

  const [avatarDataUrl, setAvatarDataUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const inputRef = useRef();

  const history = useHistory();

  const queryClient = useQueryClient();

  const isUnmounting = useIsUnmounting();

  const processUploadButtonClick = () => {
    inputRef.current.click();
  };

  const isSaveAvailable = () => !isSaving;

  const processSaveButtonClick = async () => {
    if (!isSaveAvailable()) {
      return;
    }

    setIsSaving(true);

    let fileHash;
    let uploadError;

    try {
      fileHash = await uploadFile(avatarDataUrl);
    } catch (e) {
      console.error(e);
      uploadError = e;
    }

    if (!fileHash || uploadError) {
      toast.error('Sorry 😢 There was an error saving profile image. Please, try again later.');
      if (!isUnmounting) {
        setIsSaving(false);
      }

      return;
    }

    try {
      await setProfile({
        ...profile,
        image: fileHash,
        bio: profile?.bio || '',
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
      <HeadingSmallText>Upload a profile photo</HeadingSmallText>
      <p className="sub-title">choose a photo from your device</p>
      <FileDropzone
        buttonText="Select a photo"
        adviceText={
          avatarDataUrl
            ? 'This will be your profile picture '
            : `Photos with a 1:1 ratio work best, that are under ${PROFILE.PHOTO_MAX_SIZE_MB}mb in size.`
        }
        onUpload={({ file }) => setAvatarDataUrl(file)}
        ref={inputRef}
        showFileName={false}
        maxSizeMb={PROFILE.PHOTO_MAX_SIZE_MB}
      />
      <StickedToBottom isSecondary>
        <StyledButton isSecondary isDisabled={isSaving}>
          <Link to={isSaving ? '#' : '/profile'}>Cancel</Link>
        </StyledButton>
        {avatarDataUrl ? (
          <StyledButton isPrimary onClick={processSaveButtonClick} isDisabled={!isSaveAvailable()}>
            {isSaving ? 'Saving' : 'Save'}
            {isSaving && <DotsLoading />}
          </StyledButton>
        ) : (
          <StyledButton isPrimary onClick={processUploadButtonClick}>
            Upload
          </StyledButton>
        )}
      </StickedToBottom>
    </Container>
  );
}

export default ProfileEditPhoto;
