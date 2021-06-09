import React from 'react';
import styled from 'styled-components';

import { Button } from './common/buttons';
import { HeadingText } from './common/typography';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 28px;
  text-align: center;
`;

const ErrorFallback = () => (
  <Container>
    <HeadingText>
      Sorry :( <br /> There was an unexpected error
    </HeadingText>
    <Button isPrimary>
      <a href="/">Back home</a>
    </Button>
  </Container>
);

export default ErrorFallback;
