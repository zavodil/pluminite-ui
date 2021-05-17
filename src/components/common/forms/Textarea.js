import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledContainer = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

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
`;

const Textarea = ({ labelText, isRequired, name, rows, maxLength }) => {
  const [textareaValue, setTextareaValue] = useState('');

  const onTextChange = (e) => {
    setTextareaValue(e.target.value);
  };

  return (
    <StyledContainer className="form-group">
      {labelText && <label>{labelText}</label>}
      <textarea
        name={name}
        required={isRequired}
        autoComplete="off"
        rows={rows}
        maxLength={maxLength}
        onChange={onTextChange}
        value={textareaValue}
      />
      {maxLength && (
        <div className="max-length">
          {textareaValue.length} / {maxLength}
        </div>
      )}
    </StyledContainer>
  );
};

Textarea.propTypes = {
  labelText: PropTypes.string,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
};

Textarea.defaultValues = {
  isRequired: true,
};

export default Textarea;
