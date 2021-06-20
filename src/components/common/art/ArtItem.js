import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '~/components/common/buttons';
import { Media, MediaFromIpfs } from '~/components/common/media';

import { FullscreenIcon , PlayIcon } from '~/components/common/icons';

import { convertKBtoMB, isFileTypeAnimatedImage, isFileTypeVideo } from '~/utils/files';

import { APP } from '~/constants';

import { square } from '~/styles/mixins';

const Container = styled('div')`
  position: relative;
  width: 400px;
  max-width: 100%;
  margin: 15px 5px;
  border-radius: var(--radius-default);
  transition: 250ms;

  :hover {
    transform: scale(1.01);
  }

  .fullscreen-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: pointer;
    background-color: rgba(var(--plum-base), 0.2);
    border: 1px solid #ffffff;
    border-radius: 0 0 var(--radius-default) 0;
  }

  .play-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    padding: 7px 5px 7px 7px;
    border: 1px solid #ffffff;
    border-radius: var(--radius-default) 0 0 0;
    background-color: rgba(var(--plum-base), 0.2);
    cursor: pointer;
  }

  button {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }

  @media (min-width: 1100px) {
    width: 320px;
  }
`;

const ImageContainer = styled(Link)`
  ${square};

  display: flex;
  justify-content: center;
  align-items: center;

  .hidden {
    display: none;
  }

  width: 400px;
  max-width: 100%;
  border-radius: var(--radius-default);

  @media (min-width: 1100px) {
    width: 320px;
  }
`;

const ArtItem = ({
  nft,
  buttonText,
  isLink,
  isButtonDisabled,
  isFromIpfs,
  isFullScreenEnabled,
  onButtonClick,
  forwardedRef,
}) => {
  const location = useLocation();
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    if (nft?.metadata?.extra) {
      const extra = JSON.parse(nft.metadata.extra);

      setFileType(extra.media_type);
    }
  }, [nft]);

  const imageContainerParams = {
    to: isLink
      ? {
          pathname: `/gem/${nft?.token_id}`,
          prevPathname: location.pathname,
        }
      : undefined,
    as: isLink ? Link : 'div',
  };

  const getIpfsHashMedia = () => {
    let extra;
    let mediaLowRes;
    let mediaType;
    let mediaSize;

    if (nft?.metadata?.extra) {
      extra = JSON.parse(nft.metadata.extra);
      mediaLowRes = extra.media_lowres;
      mediaType = extra.media_type;
      mediaSize = extra.media_size;
    }

    if (
      mediaType &&
      mediaSize &&
      (isFileTypeAnimatedImage(mediaType) || isFileTypeVideo(mediaType)) &&
      convertKBtoMB(mediaSize) < APP.AN_MEDIA_MAX_SIZE_BEFORE_THUMBNAIL_MB
    ) {
      return nft?.metadata?.media || mediaLowRes;
    }

    return mediaLowRes || nft?.metadata?.media;
  };

  return (
    <Container className="art-item">
      <ImageContainer className="image-container" {...imageContainerParams} title={nft?.metadata?.title}>
        {isFromIpfs ? (
          <MediaFromIpfs media={getIpfsHashMedia()} forwardedRef={forwardedRef} alt={nft?.metadata?.title} />
        ) : (
          <Media ref={forwardedRef} src={nft?.metadata?.media} alt={nft?.metadata?.title} />
        )}
      </ImageContainer>
      {buttonText && (
        <Button isPrimary isSmall isDisabled={isButtonDisabled} onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
      {isFullScreenEnabled && nft?.token_id && (
        <Link
          to={{
            pathname: `/gem-original/${nft.token_id}`,
            prevPathname: location.pathname,
          }}
          title="Original"
        >
          <FullscreenIcon />
        </Link>
      )}
      {fileType && (isFileTypeAnimatedImage(fileType) || isFileTypeVideo(fileType)) && (
        <Link
          to={{
            pathname: `/gem-original/${nft?.token_id}`,
            prevPathname: location.pathname,
          }}
          title="Play"
        >
          <PlayIcon />
        </Link>
      )}
    </Container>
  );
};

ArtItem.propTypes = {
  nft: PropTypes.shape({
    token_id: PropTypes.string,
    metadata: PropTypes.shape({
      title: PropTypes.string,
      media: PropTypes.string,
      extra: PropTypes.string,
    }),
  }),
  buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLink: PropTypes.bool,
  isButtonDisabled: PropTypes.bool,
  isFullScreenEnabled: PropTypes.bool,
  isFromIpfs: PropTypes.bool,
  onButtonClick: PropTypes.func,
  forwardedRef: PropTypes.object,
};

ArtItem.defaultProps = {
  onButtonClick: () => {},
};

export default ArtItem;
