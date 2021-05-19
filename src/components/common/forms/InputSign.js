import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Input from './Input';

const StyledContainer = styled('div')`
  position: relative;
  width: fit-content;

  input {
    width: 135px;
    padding-${(props) => props.placement}: 40px;
    text-align: ${(props) => (props.placement === 'right' ? 'end' : 'start')};
  }

  .sign {
    position: absolute;
    top: 0;
    ${(props) => props.placement}: 0;
    padding: 16px 14px;
    font-family: Comfortaa, 'sans-serif';
    font-size: 18px;
    line-height: 24px;
    color: darkgray;
    cursor: default;
  }
`;

const InputSign = ({ isRequired, name, sign, inputOnChange, placement, ...rest }) => {
  return (
    <StyledContainer className="form-group" placement={placement}>
      <Input
        name={name}
        required={isRequired}
        autoComplete="off"
        onChange={(e) => inputOnChange(e.target.value)}
        {...rest}
      />
      <div className="sign">{sign}</div>
    </StyledContainer>
  );
};

InputSign.propTypes = {
  isRequired: PropTypes.bool,
  name: PropTypes.string.isRequired,
  sign: PropTypes.string.isRequired,
  inputOnChange: PropTypes.func,
  placement: PropTypes.oneOf(['left', 'right']),
};

InputSign.defaultProps = {
  isRequired: true,
  inputOnChange: () => {},
  placement: 'right',
};

export default InputSign;
