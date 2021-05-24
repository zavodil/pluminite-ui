import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { HeadingText } from '../../../common/typography';
import FileDropzone from '../../../common/FileDropzone';
import ButtonBottom from '../../../common/Button/ButtonBottom';

import { NftTypeRequired } from '../../../../types/NftTypes';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const MintUpload = ({ onUpload, onCompleteLink, nft }) => {
  return (
    <Container>
      <HeadingText>Upload Art</HeadingText>
      <FileDropzone
        onUpload={onUpload}
        buttonText="Select Art"
        adviceText="We advise a 1:1 ratio. Max file size 16 Mb."
        maxSizeMb={16}
      />
      <ButtonBottom link={onCompleteLink} text="Last Step: Review" isDisabled={!nft.artDataUrl} />
    </Container>
  );
};

MintUpload.propTypes = {
  onUpload: PropTypes.func,
  onCompleteLink: PropTypes.string,
  imageDataUrl: PropTypes.string,
  nft: NftTypeRequired,
};

export default MintUpload;
