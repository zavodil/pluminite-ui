export const getFileData = async (hash) => {
  const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);

  const { file } = await response.json();

  return file;
};
