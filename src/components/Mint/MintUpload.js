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

  .select {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    border-radius: var(--radius-default);
    // todo: use variables for 'rx='8' ry='8' (border-radius) stroke='%23${'F8DDFF'}' (lavendar)'
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23${'F8DDFF'}' stroke-width='3' stroke-dasharray='10 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");

    :after {
      content: '';
      display: block;
      padding-bottom: 100%;
    }
  }

  #file-uploader {
    display: none;
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

export default function MintDescribe() {
  const match = useRouteMatch();

  return (
    <Container>
      <HeadingText>Upload Art</HeadingText>
      <div className="select">
        <Button as="label" for="file-uploader" isSecondary>
          Select Art
        </Button>
        <input id="file-uploader" type="file" />
      </div>
      <div className="button-bottom">
        <Button isPrimary isLink>
          <Link to={`${match.path}/review`} onClick={() => {}}>
            Last Step: Review
          </Link>
        </Button>
      </div>
    </Container>
  );
}
