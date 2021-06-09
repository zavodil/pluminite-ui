import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { SmallText } from '~/components/common/typography';

const StyledContainer = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  opacity: ${({ isDisabled }) => (isDisabled ? '50%' : '100%')};

  label {
    line-height: 24px;
    margin-bottom: 10px;
  }

  textarea {
    padding: 16px 14px;
    border: none;
    border-bottom: var(--lavendar) 1px solid;
    background-color: rgba(var(--periwinkle-base), 0.2);
    outline: none;
    font-family: Comfortaa, 'sans-serif';
    font-size: 16px;
    line-height: 24px;
    color: white;
    overflow: hidden;
  }

  .max-length {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 11px;
    line-height: 18px;
    color: var(--lavendar);
    user-select: none;
    cursor: default;
  }

  .small-text {
    position: absolute;
    bottom: -25px;
    margin: 0;
  }
`;

const Textarea = ({ name, rows, maxLength, labelText, textInitial, onTextChange, isRequired, isDisabled }) => {
  const [textareaValue, setTextareaValue] = useState(textInitial || '');
  const [maxLengthExceeded, setMaxLengthExceeded] = useState(false);
  const [isRequiredAndSkipped, setIsRequiredAndSkipped] = useState(false);

  const processTextChange = (value) => {
    if (isDisabled) {
      return;
    }

    if (maxLength && value.length > maxLength) {
      setIsRequiredAndSkipped(false);
      setMaxLengthExceeded(true);
    } else {
      setMaxLengthExceeded(false);
    }

    onTextChange(value);
    setTextareaValue(value);
  };

  const onTextareaBlur = (value) => {
    if (isRequired && !value) {
      setIsRequiredAndSkipped(true);
    } else {
      setIsRequiredAndSkipped(false);
    }
  };

  return (
    <StyledContainer isDisabled={isDisabled} className="form-group">
      {labelText && <label>{labelText}</label>}
      <textarea
        name={name}
        required={isRequired}
        autoComplete="off"
        rows={rows}
        onChange={(e) => processTextChange(e.target.value)}
        value={textareaValue}
        onBlur={(e) => onTextareaBlur(e.target.value)}
        disabled={isDisabled}
      />
      {maxLength && (
        <div className="max-length">
          {textareaValue.length} / {maxLength}
        </div>
      )}
      {maxLength && maxLengthExceeded && (
        <SmallText isError>Sorry, it looks like you’ve exceeded the character limit</SmallText>
      )}
      {isRequiredAndSkipped && (
        <SmallText isError className="required-warning">
          Required
        </SmallText>
      )}
    </StyledContainer>
  );
};

Textarea.propTypes = {
  name: PropTypes.string.isRequired,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  labelText: PropTypes.string,
  textInitial: PropTypes.string,
  onTextChange: PropTypes.func,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

Textarea.defaultProps = {
  isRequired: true,
  onTextChange: () => {},
};

export default Textarea;
