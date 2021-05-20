import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { StickedToBottom } from '../common/layout';
import Button from '../common/Button';
import FileDropzone from '../common/FileDropzone';
import { HeadingSmallText } from '../common/typography';

const Container = styled('div')`
  .heading-small {
    margin-bottom: 10px;
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

function ProfileEditPhoto({ processSave }) {
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const inputRef = useRef();

  const processUploadButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <Container>
      <HeadingSmallText>Upload a profile photo</HeadingSmallText>
      <p className="sub-title">choose a photo from your device</p>
      <FileDropzone
        buttonText="Select a photo"
        adviceText={
          imageDataUrl
            ? 'This will be your profile picture '
            : 'Photos with a 1:1 ratio work best, that are under 1mb in size.'
        }
        onUpload={setImageDataUrl}
        ref={inputRef}
      />
      <StickedToBottom isSecondary>
        <StyledButton isSecondary>
          <Link to="/profile/edit">Cancel</Link>
        </StyledButton>
        {imageDataUrl ? (
          <StyledButton isPrimary>
            <Link to="/profile" onClick={processSave}>
              Save
            </Link>
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

ProfileEditPhoto.propTypes = {
  processSave: PropTypes.func.isRequired,
};

export default ProfileEditPhoto;
