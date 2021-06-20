import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { NearContext } from '~/contexts';

import { HeadingText } from '~/components/common/typography';
import { Button } from '~/components/common/buttons';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 100px 28px 0;

  p {
    font-size: 18px;
    line-height: 20px;
  }

  .sign-up-offer {
    margin-top: 40px;
  }

  @media (min-width: 767px) {
    padding-top: 0;
    align-items: center;
    justify-content: center;
  }
`;

export default function LogIn() {
  const { signIn } = useContext(NearContext);

  const signInAction = () => {
    signIn();
  };

  return (
    <Container>
      <HeadingText>Let’s go</HeadingText>
      <p>Log In with your NEAR wallet</p>
      <Button isPrimary onClick={() => signInAction()}>
        Connect NEAR Wallet
      </Button>
      <p className="sign-up-offer">
        Don’t have a NEAR wallet? No worries, sign up for a wallet <Link to="/sign-up">here</Link>.
      </p>
    </Container>
  );
}
