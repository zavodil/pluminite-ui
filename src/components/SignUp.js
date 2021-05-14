import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { NearContext } from '../contexts';

import { HeadingText } from './common/typography';
import Button from './common/Button';
import SeparatorHorizontal from './common/Separator/SeparatorHorizontal';

import bgSignup from '../assets/bg-signup.png';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 100px 28px 0;

  .trouble {
    margin-top: 40px;
  }

  @media (min-width: 767px) {
    padding-top: 0;
    align-items: center;
    justify-content: center;
    background: url(${bgSignup}) no-repeat bottom left fixed;
  }
`;

export default function SignUp() {
  const { signIn, signUp } = useContext(NearContext);

  const signInAction = () => {
    signIn();
  };

  const signUpAction = () => {
    signUp();
  };

  return (
    <Container>
      <HeadingText>Let’s go</HeadingText>
      <p>Already have a NEAR account?</p>
      <Button isPrimary isLink>
        <Link to="#" onClick={() => signInAction()}>
          Connect NEAR Wallet
        </Link>
      </Button>
      <SeparatorHorizontal>OR</SeparatorHorizontal>
      <p>Need a NEAR wallet?</p>
      <Button isPrimary isLink>
        <Link to="#" onClick={() => signUpAction()}>
          Create a NEAR Wallet
        </Link>
      </Button>
      <p className="trouble">
        Having trouble making a wallet? Email us at <a href="mailto:info@pluminite.com">info@pluminite.com</a>.
      </p>
    </Container>
  );
}
