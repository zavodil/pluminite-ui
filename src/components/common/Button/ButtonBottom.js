import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from './Button';

import { Portal } from '../utils';

const StyledContainer = styled('div')`
  display: flex;
  justify-content: center;
  padding: 20px 13px;
  background-color: var(--plum);
  box-shadow: 0 -36px 36px rgba(190, 20, 205, 0.22);

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
    <Portal mountClassName="buttons-bottom">
      <StyledContainer className="button-bottom">
        <Button isPrimary isDisabled={isDisabled} {...buttonProps}>
          {isDisabled ? text : <Link to={link}>{text}</Link>}
        </Button>
      </StyledContainer>
    </Portal>
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
