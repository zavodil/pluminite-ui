import React from 'react';
import styled from 'styled-components';
import { Button } from '~/components/common/buttons';

import { HeadingText } from '~/components/common/typography';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  min-height: calc(100% - 90px);
  padding: 100px 28px 60px;
  margin: 0 auto;

  p {
    margin: 0 0 30px;
    line-height: 24px;
    text-align: center;
  }

  .button {
    margin: 50px auto 0;
  }

  @media (min-width: 767px) {
    h2 {
      text-align: center;
    }
  }
`;

const NotEnoughBalance = () => (
  <Container>
    <HeadingText>Let&apos;s fix that</HeadingText>
    <p>Looks like we need to get you minting!</p>
    <p>Please submit a request with the button below if you’re having issues minting.</p>
    <p>We’ll get you fixed right up :)</p>
    <Button isPrimary>
      <a href="https://2biqpwq7khk.typeform.com/to/RLbswKM5">Help me Mint!</a>
    </Button>
  </Container>
);

export default NotEnoughBalance;
