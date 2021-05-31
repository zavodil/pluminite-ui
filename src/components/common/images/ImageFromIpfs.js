import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Image from './Image';

const ImageFromIpfs = ({ media, alt }) => {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    fetch(`https://gateway.pinata.cloud/ipfs/${media}`)
      .then((response) => response.json())
      .then((json) => setDataUrl(json.file));
  }, []);

  return <Image src={dataUrl} alt={alt} className="image" />;
};

ImageFromIpfs.propTypes = {
  media: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

export default ImageFromIpfs;
