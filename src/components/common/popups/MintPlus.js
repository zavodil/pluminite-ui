import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const StyledContainer = styled('div')`
  height: 69px;
  width: 69px;
  border-radius: 50%;
  background: var(--bubble-gum);
  color: var(--plum);
  font-size: 80px;
  text-align: center;
  line-height: 80px;
  cursor: pointer;
  user-select: none;
  box-shadow: var(--shadow-primary);
`;

const MintPlus = () => {
  const history = useHistory();

  return <StyledContainer onClick={() => history.push('/mint')}>+</StyledContainer>;
};

export default MintPlus;
