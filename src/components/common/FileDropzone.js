import React, { forwardRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import Button from './Button';

import { square } from '../../styles/mixins';

const StyledContainer = styled('div')`
  .image-container {
    ${square};

    img {
      border-radius: var(--radius-default);
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
    // todo: use variables for 'rx='8' ry='8' (border-radius) stroke='%23${'F8DDFF'}' (lavendar)'
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23${'F8DDFF'}' stroke-width='3' stroke-dasharray='10 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
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
      setIsLoading(false);
      setImageDataUrl(reader.result);

      if (onUpload) {
        onUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const { ref, ...dropzoneProps } = getRootProps();

  return (
    <StyledContainer>
      {imageDataUrl ? (
        <div className="image-container">
          <img src={imageDataUrl} alt="selected file" />
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
