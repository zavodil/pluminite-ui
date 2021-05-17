import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { StickedToBottom } from '../layout';
import Button from './Button';

const StyledButton = styled(Button)`
  width: 100%;
  max-width: 400px;
`;

const ButtonBottom = ({ link, text, onButtonClick, isDisabled }) => {
  const buttonProps = {
    onClick: isDisabled ? () => {} : onButtonClick,
    isDisabled,
    isPrimary: true,
  };

  return (
    <StickedToBottom isPrimary>
      <StyledButton {...buttonProps}>{isDisabled ? text : <Link to={link}>{text}</Link>}</StyledButton>
    </StickedToBottom>
  );
};

ButtonBottom.propTypes = {
  link: PropTypes.string,
  text: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func,
  isDisabled: PropTypes.bool,
};

ButtonBottom.defaultProps = {
  onButtonClick: () => {},
  isDisabled: false,
};

export default ButtonBottom;
