import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { square } from '../../../styles/mixins';

import DiamondIcon from '../../../assets/DiamondIcon';

import { ReactChildrenType } from '../../../types/ReactChildrenTypes';

const Container = styled('div')`
  ${square};

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px 13px;

  .diamond-icon {
    height: 100px;
    width: 100px;
    animation: beat 1.5s cubic-bezier(0.5, 0, 0.5, 1) 0s infinite normal none;
    filter: drop-shadow(var(--shadow-primary));
  }

  @keyframes beat {
    30% {
      transform: scale(1.5);
    }
    60% {
      transform: scale(1);
    }
  }
`;

const Loading = ({ children, waitingFor }) => {
  const isWaitingOver = () => {
    if (Array.isArray(waitingFor)) {
      return waitingFor.every((el) => el !== null && el !== undefined);
    }

    return waitingFor !== null && waitingFor !== undefined;
  };

  if (isWaitingOver()) {
    return children;
  }

  return (
    <Container>
      <DiamondIcon />
    </Container>
  );
};

Loading.propTypes = {
  children: ReactChildrenType,
  waitingFor: PropTypes.any,
};

export default Loading;
