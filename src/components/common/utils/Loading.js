import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { DiamondIcon } from '~/components/common/icons';

import { beatAnimate, square } from '~/styles/mixins';

import { ReactChildrenType } from '~/types/ReactChildrenTypes';

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
    ${beatAnimate(1.5)}

    height: 100px;
    width: 100px;
    filter: drop-shadow(var(--shadow-primary));
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
