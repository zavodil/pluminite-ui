import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { HeadingText } from '../common/typography';
import FileDropzone from '../common/FileDropzone';
import ButtonBottom from '../common/Button/ButtonBottom';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const MintUpload = ({ onUpload, onCompleteLink, imageDataUrl }) => {
  return (
    <Container>
      <HeadingText>Upload Art</HeadingText>
      <FileDropzone
        onUpload={onUpload}
        buttonText="Select Art"
        adviceText="We advise a 1:1 ratio. Max file size WIP."
      />
      <ButtonBottom link={onCompleteLink} text="Last Step: Review" isDisabled={!imageDataUrl} />
    </Container>
  );
};

MintUpload.propTypes = {
  onUpload: PropTypes.func,
  onCompleteLink: PropTypes.string,
  imageDataUrl: PropTypes.string,
};

export default MintUpload;
