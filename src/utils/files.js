export const isFileTypeImage = (fileType) => fileType.startsWith('image');

export const isFileTypeVideo = (fileType) => fileType.startsWith('video');

export const isFileTypeAnimatedImage = (fileType) =>
  ['image/apng', 'image/avif', 'image/gif', 'image/webp'].includes(fileType);

export const isSupportedFileType = (fileType) => fileType.startsWith('image') || fileType.startsWith('video');
