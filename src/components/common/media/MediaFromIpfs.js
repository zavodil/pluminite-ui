import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import Media from './Media';

import { getFileData } from '~/apis';

import { QUERY_KEYS } from '~/constants';

const MediaFromIpfs = ({ media, forwardedRef, ...rest }) => {
  const { data: imageData } = useQuery([QUERY_KEYS.GET_IMAGE_DATA, media], () => getFileData(media), {
    retry: 1,
    enabled: !!media,
  });

  return <Media ref={forwardedRef} src={imageData} className="image" media={media} {...rest} />;
};

MediaFromIpfs.propTypes = {
  media: PropTypes.string,
  forwardedRef: PropTypes.object,
};

export default MediaFromIpfs;
