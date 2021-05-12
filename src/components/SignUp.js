import React, { useState } from 'react';
import styled from 'styled-components';

import bgSignup from '../assets/bg-signup.png';

import Step0 from './SignUp/Step0';
import Step1 from './SignUp/Step1';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 28px;

  @media (min-width: 767px) {
    background: url(${bgSignup}) no-repeat bottom left fixed;
  }
`;

const steps = [Step0, Step1];

export default function SignUp() {
  const [step, setStep] = useState(0);

  const CurrentStep = steps[step];

  return (
    <Container>
      <CurrentStep startNextStep={() => setStep(step + 1)} />
    </Container>
  );
}
