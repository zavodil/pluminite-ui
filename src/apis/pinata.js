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

const readBlobAsDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const readBlobAsText = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsText(blob);
  });

export const getFileData = async (hash) => {
  let response;

  try {
    response = await fetch(`${pinataHref}/${hash}`);
  } catch (e) {
    console.error(e);

    return null;
  }

  try {
    const blob = await response.blob();

    if (blob.type === 'application/json') {
      const text = await readBlobAsText(blob);

      return JSON.parse(text)?.file || null;
    }

    return await readBlobAsDataUrl(blob);
  } catch (e) {
    console.error(e);
  }

  return null;
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
