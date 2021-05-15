import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from './Button';

const StyledContainer = styled('div')`
  position: fixed;
  display: flex;
  justify-content: center;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 20px 13px;
  background-color: var(--plum);
  box-shadow: 0 0 74px rgba(190, 20, 205, 0.45);

  button {
    width: 100%;
    max-width: 400px;
  }
`;

const ButtonBottom = ({ link, text, onButtonClick, isDisabled }) => {
  const buttonProps = {
    isLink: link && !isDisabled,
    onClick: isDisabled ? () => {} : onButtonClick,
  };

  return (
    <StyledContainer className="button-bottom">
      <Button isPrimary isDisabled={isDisabled} {...buttonProps}>
        {isDisabled ? text : <Link to={link}>{text}</Link>}
      </Button>
    </StyledContainer>
  );
};

ButtonBottom.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func,
  isDisabled: PropTypes.bool,
};

ButtonBottom.defaultProps = {
  onButtonClick: () => {},
  isDisabled: false,
};

export default ButtonBottom;
