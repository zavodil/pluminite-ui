import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

import Button from './Button';

const StyledContainer = styled('div')`
  .square-with-border {
    padding: 3px;
    border-radius: var(--radius-default);
    // todo: use variables for 'rx='8' ry='8' (border-radius) stroke='%23${'F8DDFF'}' (lavendar)'
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23${'F8DDFF'}' stroke-width='3' stroke-dasharray='10 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    width: 100%;

    :after {
      content: '';
      display: block;
      padding-bottom: 100%;
    }
  }

  img {
    width: 100%;
    border-radius: var(--radius-default);
  }

  .select {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
  }

  .extra-text {
    text-align: center;
  }

  .advice {
    color: var(--periwinkle);
  }
`;

const FileDropzone = ({ onUpload, buttonText, adviceText }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [isError, setIsError] = useState(false);
  const [filename, setFilename] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setIsLoading(true);
    setIsError(false);

    const file = acceptedFiles[0];
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

  return (
    <StyledContainer>
      {imageDataUrl ? (
        <img src={imageDataUrl} alt="selected art" />
      ) : (
        <div className="select square-with-border" {...getRootProps()}>
          {isDragActive ? 'Drop files here.' : <Button isSecondary>{buttonText}</Button>}
          <input
            {...getInputProps({
              multiple: false,
              accept: 'image/*',
            })}
          />
        </div>
      )}
      {filename && <p className="extra-text">{filename}</p>}
      {isLoading && <p className="extra-text">Loading...</p>}
      {isError && <p className="extra-text">Something is wrong. Try again.</p>}
      {adviceText && <p className="advice extra-text">{adviceText}</p>}
    </StyledContainer>
  );
};

FileDropzone.propTypes = {
  onUpload: PropTypes.func,
  buttonText: PropTypes.string.isRequired,
  adviceText: PropTypes.string,
};

export default FileDropzone;
