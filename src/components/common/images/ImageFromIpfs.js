import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import Image from './Image';

import { getFileData } from '../../../apis';

import { QUERY_KEYS } from '../../../constants';

const ImageFromIpfs = ({ media, forwardedRef, ...rest }) => {
  const { data: imageData } = useQuery([QUERY_KEYS.GET_IMAGE_DATA, media], () => getFileData(media), {
    retry: 1,
    enabled: !!media,
  });

  return <Image ref={forwardedRef} src={imageData} className="image" media={media} {...rest} />;
};

ImageFromIpfs.propTypes = {
  media: PropTypes.string,
  forwardedRef: PropTypes.object,
};

export default ImageFromIpfs;
