import React from 'react';
// import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { StickedToBottom } from './common/layout';
import Balance from './NavigationComponents/Balance';
import Button from './common/Button';
import { TitleText } from './common/typography';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 90px);
  max-width: 767px;
  padding: 100px 28px 120px;

  .gem-title {
    margin-bottom: 5px;
  }

  .users {
    color: rgba(var(--lavendar-base), 0.7);

    p {
      margin: 0 0 5px;
    }
  }

  @media (min-width: 767px) {
    margin: 0 auto;
    align-items: center;
  }
`;

export default function Gem() {
  // const { gemId } = useParams();

  return (
    <Container>
      <TitleText className="gem-title">Art Title</TitleText>
      <div className="users">
        <p>by bluesygma.near</p>
        <p>owned by bluesygma.near</p>
      </div>
    </Container>
  );
}
