import pinataSDK from '@pinata/sdk';
import axios from 'axios';

import { APP } from '../constants';

let pinataApiKey;
let pinataApiSecret;
let pinataHref;

if (process.env.NODE_ENV !== 'production') {
  pinataApiKey = APP.PINATA_API_KEY;
  pinataApiSecret = APP.PINATA_API_SECRET;
  pinataHref = 'https://gateway.pinata.cloud/ipfs';
} else {
  pinataApiKey = process.env.PINATA_API_KEY;
  pinataApiSecret = process.env.PINATA_API_SECRET;
  pinataHref = 'https://storage.pluminite.com/ipfs';
}

export const getFileData = async (hash) => {
  return fetch(`${pinataHref}/${hash}`)
    .then((res) => {
      if (!res.ok) return null;

      return res.text();
    })
    .then((res) => {
      const json = res ? JSON.parse(res) : null;
      return json ? json.file : null;
    })
    .catch((err) => {
      console.error(err);
    });
};

export const uploadFileData = async (fileData) => {
  const pinata = pinataSDK(pinataApiKey, pinataApiSecret);
  const metadata = {};
  const data = {
    file: fileData,
  };

  const result = await pinata.pinJSONToIPFS(data, metadata);

  return result.IpfsHash;
};

export const uploadFile = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(url, formData, {
    maxBodyLength: 'Infinity', // this is needed to prevent axios from erroring out with large files
    headers: {
      // eslint-disable-next-line no-underscore-dangle
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataApiSecret,
    },
  });

  return response.data.IpfsHash;
};
