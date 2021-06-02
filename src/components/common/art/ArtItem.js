import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../Button';
import { Image, ImageFromIpfs } from '../images';

import FullscreenIcon from '../../../assets/FullscreenIcon';

import { square } from '../../../styles/mixins';

const StyledContainer = styled(Link)`
  display: block;
  position: relative;
  width: 400px;
  max-width: 100%;
  margin: 15px 5px;
  border-radius: var(--radius-default);
  transition: 250ms;

  :hover {
    transform: scale(1.01);
  }

  .image-container {
    ${square};

    display: flex;
    justify-content: center;
    align-items: center;

    .hidden {
      display: none;
    }
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

  button {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }

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

  const containerParams = {
    to: isLink
      ? {
          pathname: `/gem/${nft?.token_id}`,
          prevPathname: location.pathname,
        }
      : undefined,
    as: isLink ? Link : 'div',
  };

  const getIpfsHashMedia = () => {
    let mediaLowRes;

    if (nft?.metadata?.extra) {
      mediaLowRes = JSON.parse(nft.metadata.extra).media_lowres;
    }

    return mediaLowRes || nft?.metadata?.media;
  };

  return (
    <StyledContainer className="art-item" {...containerParams} title={nft?.metadata?.title}>
      <div className="image-container">
        {isFromIpfs ? (
          <ImageFromIpfs media={getIpfsHashMedia()} forwardedRef={forwardedRef} alt={nft?.metadata?.title} />
        ) : (
          <Image ref={forwardedRef} src={nft?.metadata?.media} alt={nft?.metadata?.title} />
        )}
      </div>
      {buttonText && (
        <Button isPrimary isSmall isDisabled={isButtonDisabled} onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
      {isFullScreenEnabled && (
        <Link
          to={{
            pathname: `/gem-original/${nft?.token_id}`,
            prevPathname: location.pathname,
          }}
        >
          <FullscreenIcon />
        </Link>
      )}
    </StyledContainer>
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
