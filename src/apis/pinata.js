import pinataSDK from '@pinata/sdk';

import { APP } from '../constants';

export const getFileData = async (hash) => {
  return fetch(`https://storage.pluminite.com/ipfs/${hash}`)
      .then(res => {
        if (!res.ok)
          return null;

        return res.text()})
      .then(res => {
        const json = res ? JSON.parse(res) : null;
        return json ? json.file : null;
      })
      .catch(err => {
        console.log(err);
      });
};

export const uploadFileData = async (fileData) => {
  const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
  const metadata = {};
  const data = {
    file: fileData,
  };

  const result = await pinata.pinJSONToIPFS(data, metadata);

  return result.IpfsHash;
};
