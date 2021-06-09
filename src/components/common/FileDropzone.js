import React, { forwardRef, useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { Button } from './buttons';

import {
  convertKBtoMB,
  isFileTypeAnimatedImage,
  isFileTypeImage,
  isFileTypeVideo,
  isSupportedFileType,
} from '~/utils/files';

import { square } from '~/styles/mixins';

const StyledContainer = styled('div')`
  .image-container {
    ${square};

    canvas {
      border-radius: var(--radius-default);
      display: none;
    }

    .canvas-thumbnail {
      display: none;
    }
  }

  .input-container {
    ${square};

    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px;
    border-radius: var(--radius-default);
    // todo: use variables for 'rx='8' ry='8' (--radius-default) stroke='%23F8DDFF' ('F8DDFF' is --lavendar)'
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23F8DDFF' stroke-width='3' stroke-dasharray='10 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    cursor: pointer;
  }

  .extra-text {
    text-align: center;
  }

  .advice {
    color: var(--periwinkle);
  }
`;

const FileDropzone = forwardRef(({ onUpload, buttonText, adviceText, showFileName, maxSizeMb }, customRef) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [isError, setIsError] = useState(false);
  const [filename, setFilename] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const canvasRef = useRef();
  const canvasThumbnailRef = useRef();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    setSelectedFile(file);

    if (!isSupportedFileType(file.type)) {
      toast.error(`File type ${file.type} unsupported.`);

      return;
    }

    if (maxSizeMb) {
      const fileSizeMb = convertKBtoMB(file.size);

      if (fileSizeMb > maxSizeMb) {
        toast.error('Max file size exceeded.');

        return;
      }
    }

    setIsLoading(true);
    setIsError(false);

    setFilename(file.name);

    const reader = new FileReader();

    reader.onabort = () => {
      setIsLoading(false);
    };
    reader.onerror = () => {
      setIsLoading(false);
      setIsError(true);
    };
    reader.onload = () => {
      setFileDataUrl(reader.result);
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });
  const { ref, ...dropzoneProps } = getRootProps();

  const getSquareDimensions = (target) => {
    let sx;
    let sy;
    let sw;
    let sh;

    const width = target.naturalWidth || target.videoWidth;
    const height = target.naturalHeight || target.videoHeight;

    if (width > height) {
      sx = (width - height) / 2;
      sy = 0;
      sw = height;
      sh = height;
    } else {
      sx = 0;
      sy = (height - width) / 2;
      sh = width;
      sw = width;
    }

    return { sx, sy, sw, sh };
  };

  const getCroppedToSquareImage = (image) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const { sx, sy, sw, sh } = getSquareDimensions(image);

    canvas.width = sw;
    canvas.height = sh;

    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, selectedFile.type);
    });
  };

  const getCroppedToSquareThumbnail = (target) => {
    const canvasThumbnail = canvasThumbnailRef.current;
    const ctxThumbnail = canvasThumbnail.getContext('2d');

    const { sx, sy, sw, sh } = getSquareDimensions(target);

    const width = target.naturalWidth || target.videoWidth;
    const height = target.naturalHeight || target.videoHeight;

    const thumbnailSideSize = Math.min(400, width, height);

    canvasThumbnail.width = thumbnailSideSize;
    canvasThumbnail.height = thumbnailSideSize;

    ctxThumbnail.drawImage(target, sx, sy, sw, sh, 0, 0, canvasThumbnail.width, canvasThumbnail.height);

    return new Promise((resolve) => {
      canvasThumbnail.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/jpeg',
        0.7
      );
    });
  };

  const onImageLoad = async (event) => {
    const image = event.target;

    if (onUpload) {
      onUpload({
        file: isFileTypeAnimatedImage(selectedFile.type) ? selectedFile : await getCroppedToSquareImage(image),
        thumbnailFile: await getCroppedToSquareThumbnail(image),
      });
    }

    setIsLoading(false);
  };

  const onVideoLoad = async (event) => {
    const video = event.target;

    if (onUpload) {
      onUpload({
        file: selectedFile,
        thumbnailFile: await getCroppedToSquareThumbnail(video),
      });
    }

    setIsLoading(false);
  };

  return (
    <StyledContainer>
      {fileDataUrl ? (
        <div className="image-container">
          {selectedFile?.type && isFileTypeImage(selectedFile.type) && (
            <img src={fileDataUrl} alt="selected file" onLoad={onImageLoad} />
          )}
          {selectedFile?.type && isFileTypeVideo(selectedFile.type) && (
            <video src={fileDataUrl} autoPlay muted loop onLoadedData={onVideoLoad} />
          )}
          <canvas ref={canvasRef} />
          <canvas className="canvas-thumbnail" ref={canvasThumbnailRef} />
        </div>
      ) : (
        <div className="input-container" ref={customRef || ref} {...dropzoneProps}>
          {isDragActive ? 'Drop files here.' : <Button isSecondary>{buttonText}</Button>}
          <input
            {...getInputProps({
              multiple: false,
              accept: 'image/*,video/*',
            })}
          />
        </div>
      )}
      {filename && showFileName && <p className="extra-text">{filename}</p>}
      {isLoading && <p className="extra-text">Loading...</p>}
      {isError && <p className="extra-text">Something is wrong. Try again.</p>}
      {adviceText && <p className="advice extra-text">{adviceText}</p>}
    </StyledContainer>
  );
});

FileDropzone.propTypes = {
  onUpload: PropTypes.func,
  buttonText: PropTypes.string.isRequired,
  adviceText: PropTypes.string,
  showFileName: PropTypes.bool,
  maxSizeMb: PropTypes.number,
};

FileDropzone.defaultProps = {
  showFileName: true,
};

export default FileDropzone;
