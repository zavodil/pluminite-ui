import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: column;
  cursor: pointer;

  .bar {
    position: relative;
    display: block;
    width: 30px;
    height: 2px;
    margin: 5px 0;
    background-color: var(--lavendar);
    border-radius: 3px;
  }
`;

const Hamburger = ({ ...props }) => (
  <StyledContainer {...props}>
    <span className="bar" />
    <span className="bar" />
  </StyledContainer>
);

export default Hamburger;
