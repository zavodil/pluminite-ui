import React from 'react';
import styled from 'styled-components';

import { ReactChildrenType } from '~/types/ReactChildrenTypes';

const Container = styled('div')`
  width: 100%;
  margin: 25px 0;
  max-width: 355px;

  .separator {
    display: flex;
    align-items: center;
    text-align: center;
  }

  .separator::before,
  .separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--bubble-gum);
  }

  .separator:not(:empty)::before {
    margin-right: 20px;
  }

  .separator:not(:empty)::after {
    margin-left: 20px;
  }
`;

const SeparatorHorizontal = ({ children }) => (
  <Container>
    <div className="separator">{children}</div>
  </Container>
);

SeparatorHorizontal.propTypes = {
  children: ReactChildrenType,
};

export default SeparatorHorizontal;
