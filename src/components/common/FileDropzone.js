import React, { forwardRef, useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import Button from './Button';

import { square } from '../../styles/mixins';

const StyledContainer = styled('div')`
  .image-container {
    ${square};

    canvas {
      border-radius: var(--radius-default);
    }

    .canvas-thumbnail {
      display: none;
    }

    img {
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
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [isError, setIsError] = useState(false);
  const [filename, setFilename] = useState(false);

  const canvasRef = useRef();
  const canvasThumbnailRef = useRef();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (maxSizeMb) {
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);

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
      setImageDataUrl(reader.result);
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const { ref, ...dropzoneProps } = getRootProps();

  const cropImageToSquare = (event) => {
    const image = event.target;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const canvasThumbnail = canvasThumbnailRef.current;
    const ctxThumbnail = canvasThumbnail.getContext('2d');

    let sx;
    let sy;
    let sw;
    let sh;

    if (image.naturalWidth > image.naturalHeight) {
      sx = (image.naturalWidth - image.naturalHeight) / 2;
      sy = 0;
      sw = image.naturalHeight;
      sh = image.naturalHeight;
    } else {
      sx = 0;
      sy = (image.naturalHeight - image.naturalWidth) / 2;
      sh = image.naturalWidth;
      sw = image.naturalWidth;
    }

    canvas.width = sw;
    canvas.height = sh;

    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    canvasThumbnail.width = 400;
    canvasThumbnail.height = 400;
    ctxThumbnail.drawImage(image, sx, sy, sw, sh, 0, 0, canvasThumbnail.width, canvasThumbnail.height);

    setIsLoading(false);

    if (onUpload) {
      onUpload({
        imageDataUrl: canvas.toDataURL('image/png', 1),
        imageThumbnailDataUrl: canvasThumbnail.toDataURL('image/png'),
      });
    }
  };

  return (
    <StyledContainer>
      {imageDataUrl ? (
        <div className="image-container">
          <img src={imageDataUrl} alt="selected file" onLoad={cropImageToSquare} />
          <canvas ref={canvasRef} />
          <canvas className="canvas-thumbnail" ref={canvasThumbnailRef} />
        </div>
      ) : (
        <div className="input-container" ref={customRef || ref} {...dropzoneProps}>
          {isDragActive ? 'Drop files here.' : <Button isSecondary>{buttonText}</Button>}
          <input
            {...getInputProps({
              multiple: false,
              accept: 'image/*',
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
