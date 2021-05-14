import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { HeadingText } from '../common/typography';
import ArtDropzone from '../common/ArtDropzone';
import ButtonBottom from '../common/Button/ButtonBottom';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const MintUpload = ({ onUpload, onCompleteLink }) => {
  return (
    <Container>
      <HeadingText>Upload Art</HeadingText>
      <ArtDropzone onUpload={onUpload} />
      <ButtonBottom link={onCompleteLink} text="Last Step: Review" />
    </Container>
  );
};

MintUpload.propTypes = {
  onUpload: PropTypes.func,
  onCompleteLink: PropTypes.string,
};

export default MintUpload;
