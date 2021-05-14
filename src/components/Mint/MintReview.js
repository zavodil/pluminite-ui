import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { HeadingText } from '../common/typography';
import Button from '../common/Button';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;

  h2 {
    margin-bottom: 0;
    text-align: center;
  }

  .button-bottom {
    position: fixed;
    display: flex;
    justify-content: center;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 20px 13px;
    background-color: var(--plum);
    box-shadow: 0 0 74px rgba(190, 20, 205, 0.45);

    button {
      width: 100%;
      max-width: 400px;
    }
  }
`;

export default function MintReview() {
  const match = useRouteMatch();

  return (
    <Container>
      <HeadingText>Yay!</HeadingText>
      <div className="button-bottom">
        <Button isPrimary isLink>
          <Link to={`${match.path}/profile`} onClick={() => {}}>
            Mint NFT
          </Link>
        </Button>
      </div>
    </Container>
  );
}
