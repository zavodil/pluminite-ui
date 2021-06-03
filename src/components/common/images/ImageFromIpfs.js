import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';

import Image from './Image';

import { getFileData } from '../../../apis';

import { QUERY_KEYS } from '../../../constants';

const ImageFromIpfs = ({ media, forwardedRef, ...rest }) => {
  const { data: imageData, error } = useQuery([QUERY_KEYS.GET_IMAGE_DATA, media], () => getFileData(media), {
    retry: 1,
    enabled: !!media,
    onError() {
      toast.error("Sorry 😢 Can't get image from IPFS.");
    }
  });

  if (error)
    return null;

  return <Image ref={forwardedRef} src={imageData} className="image" {...rest} />;
};

ImageFromIpfs.propTypes = {
  media: PropTypes.string,
  forwardedRef: PropTypes.object,
};

export default ImageFromIpfs;
