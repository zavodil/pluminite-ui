import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { StickedToBottom } from './common/layout';
import Balance from './NavigationComponents/Balance';
import Button from './common/Button';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 90px);
  max-width: 767px;
  padding: 100px 28px 120px;

  @media (min-width: 767px) {
    margin: 0 auto;
    align-items: center;
  }
`;

export default function Gem() {
  const { gemId } = useParams();

  return (
    <Container>
      <h1>Art Title</h1>
    </Container>
  );
}
