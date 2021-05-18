import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DiamondIcon from '../../../assets/DiamondIcon';

import { ReactChildrenType } from '../../../types/ReactChildrenTypes';

const Container = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px 13px;

  > svg {
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

const Loading = ({ children, waitingFor }) =>
  waitingFor.every((el) => el !== null && el !== undefined) ? (
    children
  ) : (
    <Container>
      <DiamondIcon />
    </Container>
  );

Loading.propTypes = {
  children: ReactChildrenType,
  waitingFor: PropTypes.array,
};

export default Loading;
