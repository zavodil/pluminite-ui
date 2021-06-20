import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { HeadingText } from '~/components/common/typography';
import FileDropzone from '~/components/common/FileDropzone';
import { ButtonBottom } from '~/components/common/buttons';

import { APP } from '~/constants';

import { NftTypeRequired } from '~/types/NftTypes';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const MintUpload = ({ onUpload, onCompleteLink, nft }) => {
  const wasDescribed = !!nft.creator;

  if (!wasDescribed) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <HeadingText>Upload Art</HeadingText>
      <FileDropzone
        onUpload={onUpload}
        buttonText="Select Art"
        adviceText={`We advise a 1:1 ratio. Max file size ${APP.GEM_MAX_SIZE_MB} Mb.`}
        maxSizeMb={APP.GEM_MAX_SIZE_MB}
      />
      <ButtonBottom link={onCompleteLink} text="Last Step: Review" isDisabled={!nft.file} />
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
