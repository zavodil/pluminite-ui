import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { SmallText } from '../typography';

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
  }
`;

const Textarea = ({ name, rows, maxLength, labelText, isRequired, isDisabled }) => {
  const [textareaValue, setTextareaValue] = useState('');
  const [maxLengthExceeded, setMaxLengthExceeded] = useState(false);

  const onTextChange = (e) => {
    if (isDisabled) {
      return;
    }

    if (maxLength && e.target.value.length > maxLength) {
      setMaxLengthExceeded(true);
    } else {
      setMaxLengthExceeded(false);
    }

    setTextareaValue(e.target.value);
  };

  return (
    <StyledContainer isDisabled={isDisabled} className="form-group">
      {labelText && <label>{labelText}</label>}
      <textarea
        name={name}
        required={isRequired}
        autoComplete="off"
        rows={rows}
        onChange={onTextChange}
        value={textareaValue}
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
    </StyledContainer>
  );
};

Textarea.propTypes = {
  name: PropTypes.string.isRequired,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  labelText: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

Textarea.defaultProps = {
  isRequired: true,
};

export default Textarea;
